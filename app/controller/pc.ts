import { Controller } from 'egg';
import Util from '../utils';

export default class HomeController extends Controller {

    // 只支持一个目录下创建多个type_id
    // type_id business_desc 多个用,分隔
    // category_id （也就是platform_code）多个的话请发多次请求。。。
    public async addtrace() {
        const { ctx } = this;
        const {
            type_id, business_desc, user_email, user_phone,user_name, disable, param_key, param_value,
            platform_code, category_id
        } = ctx.request.body;

        const paramsOkObj = Util.checkAddtraceParams({
            type_id, business_desc, user_email, user_phone,user_name, platform_code, category_id
        });

        if (paramsOkObj) {
            ctx.body = `${paramsOkObj} 为必填参数！`;
            return;
        }

        // 插入到鲁班服务（该接口自动检测平台目录下typeId是否存在相同
        const lubanIsOK = await ctx.service.luban.addTraceToLUBAN(Util.getLubanParams({
            type_id, business_desc, category_id, disable, user_name
        }));


        if (!lubanIsOK.data.success) {
            ctx.body = lubanIsOK.data.msg;
            return;
        }

        // 插入到自己服务的埋点表中
        await ctx.service.pc.addToBuryTable((Util.getBuryParams({
            type_id, business_desc, user_email, user_phone,user_name, disable, param_key, param_value
        })));

        const hasSame = await ctx.service.pc.checkCateHasSameTypeId({
            type_id, platform_code
        });

        if (!hasSame) {
            // 插入到埋点和目录关系表中
            await ctx.service.pc.addToMiddleTable(Util.getMiddleParams({
                platform_code, type_id
            }));
        }

        ctx.body = {
            result: '注册成功'
        };

    }

    public async gettrace() {
        const { ctx } = this;
        const { pageIndex, pageSize, platform_code, user_id } = ctx.query;
        // TODO 用户id 暂时用用户邮箱标志
        const whereMiddle = Util.cleanWhereObj({
            platform_code
        });
        const whereBury = Util.cleanWhereObj({
            user_email: user_id
        });
        const result = await ctx.service.pc.getBuryInfoFromThisCate({
            pageIndex: Number(pageIndex) || 1,
            pageSize: Number(pageSize) || 20,
            whereMiddle,
            whereBury
        });
        const total_count = await ctx.service.pc.getCountByCate({
            whereMiddle,
            whereBury
        });
        ctx.body = {
            result,
            total_count
        };
    }

    public async sendupdate() {
        const { ctx } = this;
        const { type_id, param_key, param_value, env, platform, version: init_version } = ctx.request.body;
        const hasId = await ctx.service.pc.checkSameTypeId(type_id);
        // 已经在本服务中注册过的直接更新参数
        if (hasId) {
            await ctx.service.pc.updateParams({
                type_id, param_key, param_value
            });
            ctx.body = {
                result: `${type_id} 在规范平台注册过，已更新参数为 ${param_key}`
            };
        } else {
            // 手动将其插入到sendinfo表中
            await ctx.service.pc.addToSendTable({
                type_id, param_key, param_value, env, platform, init_version
            });
            ctx.body = {
                result: `${type_id} 上报成功`
            }
        }
    }

    public async getprefix() {
        const { ctx } = this;
        ctx.body = await ctx.service.pc.queryAllInfoFromPrefixTab();
    }

}

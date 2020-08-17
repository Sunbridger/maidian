import { Controller } from 'egg';
import Util from '../utils';

export default class HomeController extends Controller {

    // 只支持一个目录下创建多个type_id
    // type_id business_desc platform_code多个用,分隔
    // category_id 多个的话请发多次请求。。。
    public async addtrace() {
        const { ctx } = this;
        const {
            type_id, business_desc, user_email, user_phone,user_name, disable, param_key, param_value,
            platform_code, category_id
        } = ctx.request.body;

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

        // 插入到埋点和目录关系表中
        await ctx.service.pc.addToMiddleTable(Util.getMiddleParams({
            platform_code, type_id
        }));

        ctx.body = '注册成功';

    }

    public async gettrace() {
        const { ctx } = this;
        const { pageIndex, pageSize, platform_code, user_id } = ctx.query;
        // TODO 用户id待确定
        console.log(user_id);
        const where = Util.cleanWhereObj({ platform_code });
        const result = await ctx.service.pc.getBuryInfoFromThisCate({
            pageIndex: Number(pageIndex) || 1,
            pageSize: Number(pageSize) || 20,
            where
        });
        const total_count = await ctx.service.pc.getCountByCate(where);
        ctx.body = {
            result,
            total_count
        };
    }

    public async sendupdate() {
        const { ctx } = this;
        const { type_id, param_key, param_value, env, platform, version } = ctx.request.body;
        const hasId = await ctx.service.pc.checkSameTypeId(type_id);
        // 已经在本服务中注册过的直接更新参数
        if (hasId) {
            await ctx.service.pc.updateParams({
                type_id, param_key, param_value
            });
            ctx.body = `${type_id} 注册过了，已更新参数`;
        } else {
            // 手动将其插入到sendinfo表中
            await ctx.service.pc.addToSendTable({
                type_id, param_key, param_value, env, platform, version
            });
            ctx.body = `${type_id} 注册成功`;
        }
    }

    public async getprefix() {
        const { ctx } = this;
        ctx.body = await ctx.service.pc.queryAllInfoFromPrefixTab();
    }



}

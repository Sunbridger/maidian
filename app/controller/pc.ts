import { Controller } from 'egg';
import Util from '../utils';

export default class HomeController extends Controller {

    // 只支持一个目录下创建多个type_id
    // type_id business_desc 多个用,分隔
    // category_id （也就是platform_code）多个的话请发多次请求。。。
    public async addtrace() {
        const { ctx } = this;
        const {
            type_id, type_name, business_desc, user_email, user_phone,user_name, disable, param_key, param_value,
            platform_code, category_id
        } = ctx.request.body;

        const paramsOkObj = Util.checkAddtraceParams({
            type_id, type_name, business_desc, user_phone,user_name, platform_code, category_id
        });

        if (paramsOkObj) {
            ctx.body = `${paramsOkObj} 为必填参数！`;
            return;
        }

        // 插入到鲁班服务（该接口自动检测平台目录下typeId是否存在相同
        const lubanIsOK = await ctx.service.luban.addTraceToLUBAN(Util.getLubanParams({
            type_id, type_name, category_id, disable, user_name
        }));


        if (!lubanIsOK.data.success) {
            ctx.body = lubanIsOK.data.msg;
            return;
        }

        // 插入到自己服务的埋点表中
        await ctx.service.pc.addToBuryTable((Util.getBuryParams({
            type_id, type_name, business_desc, user_email, user_phone,user_name, disable, param_key, param_value
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

        // 删除上报表中已注册的埋点
        await ctx.service.pc.hasOneAndDelet(type_id);

        ctx.body = {
            result: '注册成功'
        };

    }

    public async gettrace() {
        const { ctx } = this;
        const { pageIndex, pageSize, platform_code, user_id } = ctx.query;
        // TODO 用户id 暂时用用户手机标志
        const whereMiddle = Util.cleanWhereObj({
            platform_code
        });
        const whereBury = Util.cleanWhereObj({
            user_phone: user_id
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
        const { type_id, param_key, param_value, env, platform, version: init_version, user_phone, user_name, device } = ctx.request.body;
        const hasId = await ctx.service.pc.checkSameTypeId(type_id);
        // 已经在本服务中注册过的直接更新参数(更新主表及联表的版本号)
        if (hasId) {
            await ctx.service.pc.updateParams({
                type_id, param_key, param_value
            });
            await ctx.service.pc.updateVersion({
                type_id, platform, init_version
            });

            ctx.body = {
                result: `${type_id} 在规范平台注册过，已更新参数为 ${param_key}`
            };
        } else {
            // 手动将其插入到sendinfo表中
            await ctx.service.pc.addToSendTable({
                type_id, param_key, param_value, env, platform, init_version, user_phone, user_name, device
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

    public async delettrace() {
        const { ctx } = this;
        const { type_id, platform_code } = ctx.request.body;
        await ctx.service.pc.delettrace({ type_id, platform_code });

        ctx.body = {
            result: `${platform_code}下的${type_id} 删除成功`
        };
    }

    public async updatetrace() {
        const { ctx } = this;
        const { type_id, platform_code, type_name, disable, param_key, param_value, business_desc, user_email, user_phone,user_name } = ctx.request.body;
        const shouUpdateParams = Util.cleanWhereObj({
            type_id, platform_code, type_name, disable, param_key, param_value,
            business_desc, user_email, user_phone,user_name
        });
        const result = await ctx.service.pc.updatetrace(shouUpdateParams);

        if (result) {
            ctx.body = {
                result: `${type_id} 更新成功`
            };
        } else {
            ctx.body = `${type_id} 不存在`;
        }

    }

    public async trigger() {
        const { token, type } = this.ctx.request.body;
        const prefixUrl = require('path').resolve(__dirname, '../schedule');
        if (token === 'trace') {
            if (require('fs').readdirSync(prefixUrl).includes(type + '.ts')) {
                await this.app.runSchedule(`../schedule/${type}`);
                this.ctx.body = {
                    result: '定时任务执行成功'
                };

            } else {
                this.ctx.body = 'type类型错误，请联系 刘林儒(liulinru@souche.com)';
            }
        } else {
            this.ctx.body = 'token错误，请联系 刘林儒(liulinru@souche.com)';
        }

    }

    public async getdesc() {
        const { type_ids } = this.ctx.request.body;
        if (type_ids) {
            const ids_arr = type_ids.split(',');
            const result = await this.ctx.service.pc.getdesc(ids_arr);
            this.ctx.body = result;
        } else {
            this.ctx.body = 'type_ids 参数必填';
        }

    }

    public async addignore() {
        const { type_id, remark } = this.ctx.request.body;
        if (type_id) {
            const result = await this.ctx.service.pc.addignore(Util.cleanWhereObj({
                type_id,
                remark
            }));
            this.ctx.body = result;
        } else {
            this.ctx.body = 'type_ids 参数必填';
        }
    }

}

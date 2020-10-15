import { Service } from 'egg';
import { Op } from 'sequelize';

export default class Test extends Service {

    public async addToBuryTable(paramsArr) {
        paramsArr.forEach(async element => {
            const objEle = await this.ctx.model.Bury.findOrCreate({
                where: {
                    type_id: element.type_id
                },
                paranoid: false,
                defaults: element
            });
            if (objEle[0]?.dataValues?.deleted_at) {
                objEle[0].restore();
            }
        });
        // return await this.ctx.model.Bury.bulkCreate(paramsArr, {
        //     ignoreDuplicates: true
        // });
    }

    public async addToMiddleTable(paramsArr) {
        return await this.ctx.model.Buryluban.bulkCreate(paramsArr);
    }

    public async addToSendTable(params) {
        const { type_id, env, platform, init_version, param_key, param_value, user_phone, user_name, device } = params;
        if (!type_id) return;
        const isExitObj = await this.ctx.model.Send.findOrCreate({
            where: {
                type_id,
                env,
                platform
            },
            defaults: {
                type_id, env, platform, init_version, param_key, param_value
            }
        });
        if (!isExitObj[1]) {
            isExitObj[0].update({
                param_key,
                param_value,
                current_version: init_version
            });
        }

        const type_idExit = await this.ctx.model.Ignore.findOne({
            where: {
                type_id
            },
            raw: true
        });

        if (!type_idExit) {
            // 报警到钉钉
            await this.ctx.curl('https://oapi.dingtalk.com/robot/send?access_token=b02d06b20782441338c85d43ca0c6fd6f0a404958906adfd570b66f3e475d37f', {
                contentType: 'json',
                method: 'POST',
                data: {
                    "msgtype": "markdown",
                    "markdown": {
                        "title":"未注册埋点上报通知",
                        "text": `### 未注册埋点上报通知 \n\n #### 平台：${platform} \n\n #### 埋点：${type_id} \n\n #### 上报环境：${env} \n\n #### 设备信息：${device || '暂无'} \n\n #### 版本号：${init_version} \n\n #### 用户名：${user_name || user_phone || '暂无'} \n\n **请[查看鲁班](http://f2e.prepub.souche-inc.com/projects/tgc-trace/luban-web2/#/track/wowcar&PLATFORM_WOWCAR_APP_IOS&2/management)及时处理**`
                    }
                }
            });
        }
    }

    public async hasOneAndDelet(type_id) {
        const arr = await this.ctx.model.Send.findAll({
            where: {
                type_id
            }
        });
        arr.forEach((row) => {
            row.destroy();
        });

    }

    public async checkCateHasSameTypeId(params) {
        const { type_id, platform_code } = params;
        const arr = await this.ctx.model.Buryluban.findAll({
            where: {
                type_id,
                platform_code
            }
        });
        return arr.length;
    }

    public async checkSameTypeId(typeId: String) {
        const flag = await this.ctx.model.Bury.findByPk(typeId);
        return !!flag;
    }

    public async orderTypeIdFindAllInfo(params) {
        const { type_id } = params;
        const result = await this.ctx.model.Bury.findByPk(type_id);
        return result;

    }

    public async getBuryInfoFromThisCate(params) {
        const { pageIndex, pageSize, whereMiddle, whereBury } = params;

        const offset = (pageIndex - 1) * pageSize;

        const result = await this.ctx.model.Buryluban.findAll({
            limit: pageSize,
            offset,
            where: whereMiddle,
            include: {
                model: this.ctx.model.Bury,
                as: 'buryObj',
                where: whereBury
            },
            attributes: ['platform_code', 'init_version', 'current_version'],
            order: [['created_at', 'DESC']]
        });
        return result;
    }

    public async updateParams(params) {
        const { type_id, param_key, param_value } = params;
        const thisTypeIdObj = await this.ctx.model.Bury.findByPk(type_id);
        thisTypeIdObj.update({
            param_key, param_value
        });
    }

    // 查询Bury表中的总数根据where
    public async getCountByCate(whereObj) {
        const { whereMiddle, whereBury } = whereObj;
        const result = await this.ctx.model.Buryluban.findAndCountAll({
            where: whereMiddle,
            include: {
                model: this.ctx.model.Bury,
                as: 'buryObj',
                where: whereBury
            }
        });
        return result.count || 0;
    }

    public async hasThisCategoryFromLuban(category_id) {
        return await this.ctx.model.Luban.findOne({
            where: { category_id },
            raw: true,
            attributes: ['luban_id']
        });
    }

    public async queryAllInfoFromPrefixTab() {
        return await this.ctx.model.Prefix.findAll({
            attributes: ['platform_code', 'name_prefix'],
            raw: true
        });
    }

    public async getAllInfoFromSend() {
        const result = await this.ctx.model.Send.findAll();
        return result;
    }

    public async delettrace(params) {
        const { type_id, platform_code } = params;

        await this.ctx.model.Buryluban.destroy({
            where: {
                type_id, platform_code
            }
        });

        const hasOneNow = await this.ctx.model.Buryluban.findOne({
            where: {
                type_id
            }
        });

        if (!hasOneNow) {
            await this.ctx.model.Bury.destroy({
                where: {
                    type_id
                }
            });
        }
    }

    public async updatetrace(params) {
        const { type_id } = params;
        const result = await this.ctx.model.Bury.update(params, {
            where: {
                type_id
            },
        });
        return result[0];
    }

    public async updateVersion(params) {
        const { type_id, platform: platform_code, init_version } = params;
        const isExitObj = await this.ctx.model.Buryluban.findOne({
            where: {
                type_id,
                platform_code
            }
        });
        if (!isExitObj) return;
        const updateObj:{
            init_version?: string,
            current_version?: string
        } = {};

        if (isExitObj?.dataValues?.init_version) {
            updateObj.current_version = init_version;
        } else {
            updateObj.init_version = init_version;
        }

        await isExitObj.update(updateObj);

    }

    public async getdesc(idsArr) {
        const result = await this.ctx.model.Bury.findAll({
            where: {
                type_id: {
                    [Op.in]: idsArr
                }
            },
            attributes: ['type_id', 'business_desc'],
            raw: true
        });
        return result;
    }

    public async addignore(params) {
        return await this.ctx.model.Ignore.findOrCreate({
            where: params,
            defaults: params
        });
    }



}

import { Service } from 'egg';

export default class Test extends Service {

    public async addToBuryTable(paramsArr) {
        return await this.ctx.model.Bury.bulkCreate(paramsArr, {
            ignoreDuplicates: true
        });
    }

    public async addToMiddleTable(paramsArr) {
        return await this.ctx.model.Buryluban.bulkCreate(paramsArr);
    }

    public async addToSendTable(params) {
        const { type_id, env, platform, init_version, param_key, param_value } = params;
        const isExitObj = await this.ctx.model.Send.findOrCreate({
            where: {
                type_id,
                env,
                platform
            },
            defaults: params
        });
        if (!isExitObj[1]) {
            isExitObj[0].update({
                param_key,
                param_value,
                current_version: init_version
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
            attributes: ['platform_code']
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
}

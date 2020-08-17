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
        return await this.ctx.model.Send.create(params);
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
        const { pageIndex, pageSize, where } = params;

        const offset = (pageIndex - 1) * pageSize;

        const result = await this.ctx.model.Buryluban.findAll({
            limit: pageSize,
            offset,
            where,
            include: {
                model: this.ctx.model.Bury,
                as: 'buryObj',
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
    public async getCountByCate(where) {
        const result = await this.ctx.model.Buryluban.findAndCountAll({
            where
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
}

import { Service } from 'egg';
import { Op } from 'sequelize';

const BASEURL = 'http://luban-api.souche-inc.com/api';

export default class Test extends Service {

    // 去鲁班原来的服务去检测是否存在该埋点
    // public async checkFromLUBANSErvice(data) {
    //     const { ctx } = this;
    //     const url = `${BASEURL}track/check.json`;
    //     const result = await ctx.curl(url, {
    //         method: 'POST',
    //         data,
    //         dataType: 'json'
    //     });
    //     return result;
    // }

    // 去鲁班原来的服务注册该埋点(该接口会自动内部检查上面的)
    public async addTraceToLUBAN(data) {
        const { ctx } = this;
        const url = `${BASEURL}/track/metadataTrackApi/track.json`;
        const result = await ctx.curl(url, {
            method: 'POST',
            data,
            dataType: 'json'
        });
        return result;
    }

    // 去鲁班服务查询埋点ID流量数据（pv、uv）
    public async getTracePVUV(data) {
        const { ctx } = this;
        const url = `${BASEURL}/track/trackModelApi/pageView.json`;
        const result = await ctx.curl(url, {
            method: 'GET',
            data,
            dataType: 'json'
        });
        const returnObj:any = [];
        result?.data?.data?.forEach((item) => {
            returnObj.push({
                type_id: item.typeid,
                pv: item.pv,
                uv: item.uv,
                yeast: 0
            });
        })
        const arrObj = await ctx.model[data.type].findAll({
            where: {
                type_id: {
                    [Op.in]: data.typeid?.split(',')
                }
            },
            raw: true,
            attributes: ['type_id', 'yeast']
        });

        const nouvArr = arrObj.map((row) => {
            if (result?.data?.data?.every((item) => item.typeid !== row.type_id)) {
                return {
                    type_id: row.type_id,
                    yeast: Number(row.yeast) + 1,
                    pv: 0,
                    uv: 0
                }
            }
        }).filter((e) => e && e.type_id);

        return [...returnObj, ...nouvArr];
    }
}

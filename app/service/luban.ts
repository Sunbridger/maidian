import { Service } from 'egg';

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
        return result?.data?.data?.map((row) => ({
            type_id: row.typeid,
            pv: row.pv,
            uv: row.uv
        }));
    }
}

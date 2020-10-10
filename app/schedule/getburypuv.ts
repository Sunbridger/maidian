import Util from '../utils';

const len = 10;

module.exports = {
    schedule: {
        cron: '0 0 1 * * *', // 每日1点执行
        type: 'worker', // 指定所有的 worker 都需要执行
        immediate: true
    },
    async task(ctx) {
        const buryIds = await ctx.model.Bury.findAll({
            raw: true,
            attributes: ['type_id']
        });
        Util.splitGroup(buryIds, len).forEach(async (arr) => {
            const ids = arr.map((row) => row.type_id).toString();
            const result = await ctx.service.luban.getTracePVUV({
                typeid: ids,
                datestr: Util.getYesterDateStr()
            });
            await ctx.model.Bury.bulkCreate(result, {
                ignoreDuplicates: true,
                updateOnDuplicate: ['pv', 'uv']
            });
        });
    }
};

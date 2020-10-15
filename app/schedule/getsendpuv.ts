import Util from '../utils';

const len = 10;

module.exports = {
    schedule: {
        cron: '0 0 2 * * *', // 每日2点执行
        type: 'worker' // 指定所有的 worker 都需要执行
    },
    async task(ctx) {
        const sendIds = await ctx.model.Send.findAll({
            raw: true,
            attributes: ['type_id', 'id']
        });
        Util.splitGroup(sendIds, len).forEach(async (arr) => {
            const ids = arr.map((row) => row.type_id).toString();
            const result = await ctx.service.luban.getTracePVUV({
                typeid: ids,
                datestr: Util.getYesterDateStr(),
                type: 'Send'
            });
            sendIds.forEach((ele) => {
                result.forEach((t) => {
                    if (ele.type_id === t.type_id) {
                        t.id = ele.id;
                    }
                });
            });

            await ctx.model.Send.bulkCreate(result, {
                ignoreDuplicates: true,
                updateOnDuplicate: ['pv', 'uv', 'yeast']
            });
        });
    }
};

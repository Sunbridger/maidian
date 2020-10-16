module.exports = {
    schedule: {
        cron: '0 0 1 * * *', // 每日1点执行
        type: 'worker' // 指定所有的 worker 都需要执行
    },
    async task(ctx) {
        await ctx.service.pc.handGetBuryPuv();
        ctx.logger.info('getburypuv success :定时任务启动完成');
    }
};

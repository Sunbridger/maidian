module.exports = {
    schedule: {
        cron: '0 0 2 * * *', // 每日2点执行
        type: 'worker' // 指定所有的 worker 都需要执行
    },
    async task(ctx) {
        await ctx.service.pc.handGetSendPuv();
        ctx.logger.info('getsendpuv success :定时任务启动完成');
    }
};

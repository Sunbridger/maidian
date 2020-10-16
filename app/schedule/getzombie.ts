module.exports = {
    schedule: {
        cron: '0 30 10 * * *', // 每日10点30分执行
        type: 'worker' // 指定所有的 worker 都需要执行
    },
    async task(ctx) {
        await ctx.service.pc.handZombie();
        ctx.logger.info('getzombie success :定时任务启动完成');
    }
};

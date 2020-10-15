module.exports = {
    schedule: {
        cron: '0 30 10 * * *', // 每日1点30分执行
        type: 'worker' // 指定所有的 worker 都需要执行
    },
    async task() {
        // todo 获取非活跃数据报警到钉钉
    }
};

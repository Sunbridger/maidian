import { Subscription } from 'egg';
class CheckSendInfo extends Subscription {
    static get schedule() {
        return {
            cron: '0 9 0 * * *', // 每日9点执行
            type: 'worker'
        };
    }

    async subscribe() {
        const { ctx } = this;
        const result = await ctx.service.pc.getAllInfoFromSend();
        result.forEach(async (row) => {
            const { platform, type_id, env } = row.dataValues;
            await ctx.curl('https://oapi.dingtalk.com/robot/send?access_token=b02d06b20782441338c85d43ca0c6fd6f0a404958906adfd570b66f3e475d37f', {
                contentType: 'json',
                method: 'POST',
                data: {
                    msgtype: "text",
                    text: {
                        "content": `检测到未注册埋点上报：\n平台：${platform}\n埋点：${type_id}\n上报环境：${env}\n请及时处理\n-----来自埋点规范定时任务。`
                    },
                }
            });
        })

    }
}

module.exports = CheckSendInfo;

import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router } = app;

    // 埋点注册
    router.post('/addtrace', controller.pc.addtrace);

    // 埋点数据获取
    router.get('/gettrace', controller.pc.gettrace);

    // 客户端上报更新埋点表或参数表
    router.post('/sendupdate', controller.pc.sendupdate);

    // 获取鲁班配置信息前缀表
    router.get('/getprefix', controller.pc.getprefix);

    // 删除埋点
    router.post('/delettrace', controller.pc.delettrace);

    // 更新埋点
    router.post('/updatetrace', controller.pc.updatetrace);

    // 手动触发定时任务
    router.post('/trigger', controller.pc.trigger);

    // 根据type_id 查询对应的买点描述
    router.post('/getdesc', controller.pc.getdesc);

    // 增加上报白名单接口
    router.post('/addignore', controller.pc.addignore);

};

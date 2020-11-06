import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;

    config.keys = appInfo.name + '_1597038250886_3781';

    config.middleware = ['formatData'];

    config.cors = {
        origin: '*',
        allowMethods: 'GET,POST,PUT,DELETE,HEAD,PATCH,OPTIONS',
        credentials: true,
    };

    config.security = {
        csrf: {
            enable: false,
        },
        methodnoallow: {
            enable: false,
        },
        domainWhiteList: ['*']
    };

    return config;
};

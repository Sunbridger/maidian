import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1597038250886_3781';

  // add your egg config in here
  config.middleware = ['formatData'];

  config.sequelize = {
    dialect: 'mysql',
    host: 'localhost',
    port: 3333,
    username: 'root',
    password: '123456',
    define: {
        timestamps: true,
        freezeTableName: true,
        underscored: false,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
    timezone: '+08:00',
    database: 'maidian'
  };

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
    }
  };

  // the return config will combines to EggAppConfig
  return {
    ...config
  };
};

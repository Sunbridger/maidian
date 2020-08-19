import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import DataBaseConfig from '../app/database/database.config';

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;

    config.keys = appInfo.name + '_1597038250886_3781';

    config.sequelize = {
        dialect: 'mysql',
        host: DataBaseConfig.prod.host,
        port: DataBaseConfig.prod.port,
        username: DataBaseConfig.prod.username,
        password: DataBaseConfig.prod.password,
        define: {
            timestamps: true,
            freezeTableName: true,
            underscored: false,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        },
        timezone: '+08:00',
        database: 'maidian'
    };

    return config;
};

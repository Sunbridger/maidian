import { EggAppConfig, PowerPartial } from 'egg';
import DataBaseConfig from '../app/database/database.config';

export default () => {
    const config: PowerPartial<EggAppConfig> = {};

    config.sequelize = {
        dialect: 'mysql',
        host: DataBaseConfig.dev.host,
        port: DataBaseConfig.dev.port,
        username: DataBaseConfig.dev.username,
        password: DataBaseConfig.dev.password,
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

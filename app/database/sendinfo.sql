CREATE TABLE sendinfo(
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '上报平台ID',
    `type_id` VARCHAR(50) NOT NULL COMMENT '埋点ID',
    `param_key` VARCHAR(255) COMMENT '参数名',
    `param_value` VARCHAR(255) COMMENT '参数说明',
    `platform` VARCHAR(255) COMMENT '上报平台',
    `env` VARCHAR(20) COMMENT '客户端环境|测试预发',
    `init_version` VARCHAR(20) COMMENT '客户端版本号',
    `current_version` VARCHAR(20) COMMENT '客户端版本号',
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` datetime COMMENT '软删除的时间',
    PRIMARY KEY (id),
    INDEX env (env)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

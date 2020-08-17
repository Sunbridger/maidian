CREATE TABLE burylubaninfo(
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '唯一id',
    `type_id` VARCHAR(50) NOT NULL COMMENT '埋点ID',
    `platform_code` VARCHAR(50) NOT NULL COMMENT '平台code',
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

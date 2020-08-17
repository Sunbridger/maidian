CREATE TABLE prefixinfo(
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '唯一id',
    `platform_code` VARCHAR(255) COMMENT '平台code',
    `name_prefix` VARCHAR(255) COMMENT '对应的埋点前缀',
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX `platform_code` (`platform_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

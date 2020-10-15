CREATE TABLE ignoreinfo(
    `type_id` VARCHAR(50) NOT NULL COMMENT '埋点ID',
    `remark` VARCHAR(50) COMMENT '备注',
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` datetime COMMENT '软删除的时间',
    PRIMARY KEY (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

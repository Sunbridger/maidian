CREATE TABLE buryinfo(
    `type_id` VARCHAR(50) NOT NULL COMMENT '埋点ID',
    `business_desc` VARCHAR(255) COMMENT '业务描述',
    `user_email` VARCHAR(50) COMMENT '注册人邮箱',
    `user_phone` VARCHAR(20) COMMENT '注册人电话',
    `user_name` VARCHAR(50) COMMENT '注册人姓名',
    `is_registered` TINYINT(3) DEFAULT 1 COMMENT '是否在鲁班上注册过',
    `disable` TINYINT(3) DEFAULT 1 COMMENT '是否启用埋点',
    `param_key` VARCHAR(255) COMMENT '参数名',
    `param_value` VARCHAR(255) COMMENT '参数说明',
    `deleate_at` datetime COMMENT '软删除的时间',
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (type_id),
    INDEX user_name (user_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

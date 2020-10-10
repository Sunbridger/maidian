module.exports = app => {
    const { STRING, INTEGER, DATE } = app.Sequelize;

    return app.model.define('sendinfo', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        type_id: STRING,
        platform: STRING,
        param_key: STRING,
        param_value: STRING,
        env: STRING,
        init_version: STRING,
        current_version: STRING,
        created_at: DATE,
        updated_at: DATE,
        deleted_at: DATE,
        pv: INTEGER,
        uv: INTEGER
    }, {
        deletedAt: 'deleted_at',
        paranoid: true
    });
  };

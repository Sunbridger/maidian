module.exports = app => {
    const { STRING, INTEGER, DATE } = app.Sequelize;

    return app.model.define('sendinfo', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        type_id: STRING,
        platform: STRING,
        param_key: STRING,
        param_value: STRING,
        env: STRING,
        version: STRING,
        created_at: DATE,
        updated_at: DATE
      });
  };

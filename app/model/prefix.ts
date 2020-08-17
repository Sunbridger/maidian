module.exports = app => {
    const { STRING, INTEGER, DATE } = app.Sequelize;

    return app.model.define('prefixinfo', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        plcatorm_code: STRING,
        name_prefix: STRING,
        created_at: DATE,
        updated_at: DATE
      });
  };

module.exports = app => {
    const { STRING, DATE } = app.Sequelize;

    return app.model.define('ignoreinfo', {
        type_id: { type: STRING, primaryKey: true },
        remark: STRING,
        created_at: DATE,
        updated_at: DATE,
        deleted_at: DATE
    }, {
        deletedAt: 'deleted_at',
        paranoid: true
    });
  };

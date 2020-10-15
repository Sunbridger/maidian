module.exports = app => {
    const { STRING, DATE, INTEGER } = app.Sequelize;

    const Buryluban = app.model.define('burylubaninfo', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        type_id: STRING,
        platform_code: STRING,
        created_at: DATE,
        updated_at: DATE,
        init_version: STRING,
        current_version: STRING
    });
    Buryluban.associate = function() {
        app.model.Buryluban.belongsTo(app.model.Bury, {
            as: 'buryObj',
            foreignKey: 'type_id',
            otherKey: 'platform_code'
        });
    }
    return Buryluban;
};

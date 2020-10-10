module.exports = app => {
    const { STRING, INTEGER, DATE } = app.Sequelize;

    const Bury = app.model.define('buryinfo', {
        type_id: { type: STRING, primaryKey: true },
        business_desc: STRING,
        type_name: STRING,
        user_email: STRING,
        user_phone: STRING,
        user_name: STRING,
        is_registered: INTEGER,
        disable: INTEGER,
        param_key: STRING,
        param_value: STRING,
        deleted_at: DATE,
        created_at: DATE,
        updated_at: DATE,
        pv: INTEGER,
        uv: INTEGER
    }, {
        deletedAt: 'deleted_at',
        paranoid: true
    });

    Bury.associate = function() {
        // app.model.Bury.belongsToMany(app.model.Luban, {
        //     as: 'lubanObj',
        //     through: app.model.Buryluban,
        //     foreignKey: 'type_id',
        //     otherKey: 'platform_code'
        // });
    }


    return Bury;
};

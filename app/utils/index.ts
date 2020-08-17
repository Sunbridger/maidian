export default {

    cleanWhereObj(obj = {}) {
        const newObj = { ...obj };
        Object.keys(newObj).forEach((key) => {
            if (
                newObj[key] === '' ||
                newObj[key] === null ||
                newObj[key] === undefined
            ) {
                delete newObj[key];
            }
        });
        return newObj;
    },

    getLubanParams(obj) {
        let { type_id, business_desc, category_id, disable, user_name } = obj;
        let typeId = '';

        type_id = type_id.split(',');
        business_desc = business_desc.split(',');

        if (type_id.length === business_desc.length) {
            business_desc.forEach((item, index) => {
                typeId += `${item},${type_id[index]}&`;
            });
            typeId = typeId.replace(/\&$/, '');
        }


        return {
            typeId,
            disable,
            categoryId: category_id,
            createUser: user_name
        };
    },

    getBuryParams(obj) {
        let { type_id, business_desc } = obj;
        const resultArr:any = [];

        type_id = type_id.split(',');
        business_desc = business_desc.split(',');

        if (type_id.length === business_desc.length) {
            business_desc.forEach((item, index) => {
                resultArr.push({
                    ...obj,
                    type_id: type_id[index],
                    business_desc: item
                });
            });
        }

        return resultArr;
    },

    getMiddleParams(obj) {
        let { type_id, platform_code } = obj;
        const resultArr:any = [];

        type_id = type_id.split(',');
        platform_code = platform_code.split(',');

        platform_code.forEach((item) => {
            type_id.forEach((row) => {
                resultArr.push({
                    platform_code: item,
                    type_id: row
                });
            })
        });

        return resultArr;
    }
}

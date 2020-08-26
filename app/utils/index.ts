export default {

    checkAddtraceParams(obj) {
        const reaultArr:any = [];

        Object.keys(obj).forEach((key) => {
            if ([null, undefined, ''].includes(obj[key])) {
                reaultArr.push(key);
            }
        });
        return reaultArr.toString();
    },

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
        let { type_id, business_desc, type_name, param_key } = obj;
        const resultArr:any = [];

        type_id = type_id.split(',');
        business_desc = business_desc.split(',');
        type_name = type_name.split(',');
        param_key = param_key.split('&');

        if (
            type_id.length === business_desc.length
            &&
            type_id.length === type_name.length
            ) {
            business_desc.forEach((item, index) => {
                resultArr.push({
                    ...obj,
                    type_id: type_id[index],
                    type_name: type_name[index],
                    business_desc: item,
                    param_key: param_key[index]
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
    },


}

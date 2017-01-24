
define('Object', function (require, module) {

    var $ = require('$');

    //把一个多级的对象线性化。
    function flat(data, seperator) {

        seperator = seperator || '.';

        var all = {};

        Object.keys(data).forEach(function (name) {

            var item = data[name];
            if (!$.Object.isPlain(item)) {
                all[name] = item;
                return;
            }

            Object.keys(item).forEach(function (key) {

                var value = item[key];

                if (value && typeof value == 'object') {

                    var obj = flat(item, seperator);

                    Object.keys(obj).forEach(function (key) {
                        all[name + seperator + key] = obj[key];
                    });
                }
                else {
                    all[name + seperator + key] = value;
                }
            });
        });

        return all;

    }

    

    return {
        'flat': flat,

        'values': function (data) {
            if (!data) {
                return [];
            }

            return Object.keys(data).map(function (key) {
                return data[key];
            });
        },
    };


});

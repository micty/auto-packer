


define('Packer/Options', function (require, module, exports) {

   
    var $ = require('$');
    var $Object = require('Object');


    function format(sample, data) {

        var max = 100;

        for (var i = 0; i < max; i++) {
            sample = $.String.format(sample, data);

            if (!sample.match(/\{.+\}/g)) { //Æ¥Åä {key} ÕâÑùµÄ×Ö¶Î¡£
                break;
            }
        }

        return sample;
    }


    return {

        'format': function (config) {
            var data = $Object.flat(config);
            var sample = JSON.stringify(config, null, 4);
            var options = format(sample, data);

            return options;
        },

    };
   
});

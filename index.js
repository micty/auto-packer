

module.exports = {


    ready: function (fn) {

        var defineJS = require('defineJS');

        defineJS.config({
            base: __dirname,
            modules: [
                'f/',
                'lib/',
                'modules/',
                'defaults/',
            ],
        });


        defineJS.run(function (require, module) {

            fn && fn(require);
          
        });
    },

};
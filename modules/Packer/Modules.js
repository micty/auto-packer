


define('Packer/Modules', function (require, module, exports) {

   
    var $ = require('$');
    var Module = require('Module');
    

    return {

        'get': function (files) {

            var id$mod = {};

            files.forEach(function (file) {

                var mod = new Module(file);
                var data = mod.parse();

                if (!data) {
                    return;
                }

                var id = data.id;
                var old = id$mod[id];
                if (!old) {
                    id$mod[id] = data;
                    return;
                }

                //已存在，出错。
                console.log('存在重复的模块:'.bgRed, id.cyan);
                console.log('文件:'.bgYellow);

                console.log([old.file, data.file].map(function (file) {
                    return '  ' + file.yellow;
                }).join('\r\n'));

                throw new Error();
            });

            return id$mod;
        },

    };
   
});

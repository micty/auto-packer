

define('Packer/Files', function (require, module, exports) {

   
    var $ = require('$');
    var Patterns = require('Patterns');


    return {

        'get': function (dir, list) {

            var files = [];
            var extras = [];

            list.forEach(function (item) {
                if (item.startsWith('&')) {
                    extras.push(item.slice(1));
                }
                else {
                    files.push(item);
                }
            });

            files = Patterns.getFiles(dir, files);
            extras = Patterns.getFiles(dir, extras);
            files = files.concat(extras);

            return files;
        },

    };
   
});

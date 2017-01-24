

define('Packer/Directory', function (require, module, exports) {

   
    var $ = require('$');
    var Patterns = require('Patterns');
    var Directory = require('Directory');
    var File = require('File');


    return {

        'copy': function (src, dest, fn) {

            Directory.copy(src, dest);

            var files = Patterns.getFiles(dest, '**/*');

            files.forEach(function (file) {
      
                var content = File.read(file);
                if (!fn) {
                    return;
                }

                content = fn(file, content);

                if (Array.isArray(content)) {
                    content = content.reverse().find(function (item) {
                        return item !== undefined;
                    });
                }

                var invalid = content === null || content === undefined;

                if (!invalid) {
                    File.write(file, content);
                }
            });
        },

        'delete': Directory.delete,



    };
   
});

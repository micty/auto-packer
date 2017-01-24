


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

                if (old) {
                    console.log('�����ظ���ģ��:', id, '�ļ�:', [old.file, mod.file]);
                    throw new Error();
                }

                id$mod[id] = data;
            });

            return id$mod;
        },

    };
   
});



var HtmlMinifier = require('html-minifier');

var path = require('path');

define('Packer', function (require, module, exports) {
   
    var $ = require('$');
    var File = require('File');
    var Emitter = $.require('Emitter');
    
    var Defaults = require('Defaults');
    var Tasks = require('Tasks');
    var Less = require('Less');

    var Directory = module.require('Directory');
    var Files = module.require('Files');
    var Modules = module.require('Modules');
    var Options = module.require('Options');
    var Refers = module.require('Refers');


    var map = new Map();

   


    function Packer(config) {

        config = Defaults.clone(module.id, config);

        var options = Options.format(config);

        var meta = {
            'emitter': new Emitter(this),
            'options': JSON.parse(options),
            'id$file': [],
        };

        map.set(this, meta);
        this.options = JSON.parse(options);  //���Ⱪ¶һ��ֻ�Ե����ԡ�
    
    }





    Packer.prototype = {
        constructor: Packer,
        options: {},            //���Ⱪ¶һ��ֻ�Ե����ԡ�

        on: function () {
            var meta = map.get(this);
            var emitter = meta.emitter;
            var args = [].slice.call(arguments);
            emitter.on.apply(emitter, args);
        },

        copy: function () {
            var meta = map.get(this);
            var emitter = meta.emitter;
            var options = meta.options.copy;
            var src = options.src;
            var dest = options.dest;

            Directory.delete(dest);

            Directory.copy(src, dest, function (file, content) {
                return emitter.fire('copy', [file, content]);
            });
        },

        html2js: function () {
            var meta = map.get(this);
            var emitter = meta.emitter;
            var options = meta.options;

            var dest = options.copy.dest;
            var files = options.html2js;

            files = Files.get(dest, files);

            files.forEach(function (file) {
                var content = File.read(file);

                //�����¼����������¼�����Ч����ֵ��Ϊ�µ����ݡ�
                var values = emitter.fire('html2js', [file, content]);

                // �� null �� undefined����ֻҪ�¼��в����� null �� undefined ���ǺϷ���ֵ��
                var item = values.reverse().find(function (item) {
                    return item != null;
                });

                if (item != null) {
                    content = item;
                }

                File.write(file + '.js', content);
            });

        },




        define: function () {
            var meta = map.get(this);
            var options = meta.options.define;

            var files = Files.get(options.dir, options.files);
            //File.writeJSON('files.json', files);

            var id$mod = Modules.get(files);
            //File.writeJSON('id$mod.json', id$mod);

            var id$file = Refers.get(options.modules, id$mod);
            meta.id$file = id$file;

            //File.writeJSON('id$file.json', id$file);

            
        },

        concat: function () {
            var meta = map.get(this);
            var emitter = meta.emitter;
            var options = meta.options.concat;
            var dir = options.dir;
            var src = options.src;

            var files = Object.values(meta.id$file);

            var index = src.findIndex(function (item) {
                return typeof item != 'string';
            });

            if (index < 0) {
                index = src.length;
                files = [];
            }

            var begins = src.slice(0, index);
            var ends = src.slice(index + 1);

            begins = Files.get(dir, begins);
            ends = Files.get(dir, ends);
            files = begins.concat(files, ends);


            var content = files.map(function (file) {
                return File.read(file);
            }).join('');

            //�����¼����������¼�����Ч����ֵ��Ϊ�µ����ݡ�
            var values = emitter.fire('concat', [files, content]);

            // �� null �� undefined����ֻҪ�¼��в����� null �� undefined ���ǺϷ���ֵ��
            var item = values.reverse().find(function (item) {
                return item != null; 
            });

            if (item != null) {
                content = item;
            }

            File.write(options.dest, content);

        },

        uglify: function () {
            var meta = map.get(this);
            var emitter = meta.emitter;
            var options = meta.options.uglify;
            var src = options.src;
            var dest = options.dest;

            var content = File.read(src);

            //�����¼����������¼�����Ч����ֵ��Ϊ�µ����ݡ�
            var values = emitter.fire('uglify', [src, content]);

            // �� null �� undefined����ֻҪ�¼��в����� null �� undefined ���ǺϷ���ֵ��
            var item = values.reverse().find(function (item) {
                return item != null; 
                });

            if (item != null) {
                content = item;
            }


            var UglifyJS = require('UglifyJS');
            var data = UglifyJS.minify(content, { fromString: true });
            File.write(dest, data.code);
        },

        html: function () {
            var meta = map.get(this);
            var options = meta.options.html;
            var minify = options.minify;
            var src = options.src;
            var dest = options.dest;

            var files = Files.get(options.src, options.files);

            files.forEach(function (file) {
                var content = File.read(file);
                content = HtmlMinifier.minify(content, minify);

                file = path.relative(src, file);
                file = path.join(dest, file);
                file = file.replace(/\\/g, '/');

                File.write(file, content);
            });

        },

        /**
        * ���� less ���� css ���ݽ��кϲ���
        */
        less: function () {
            var meta = map.get(this);
            var options = meta.options.less;

            var modules = Object.keys(meta.id$file).map(function (id) {
                id = id.split('/').join('-');
                return '**/' + id + '.less';
            });

            var files = Files.get(options.dir, modules);

            function compile(compress) {
                Tasks.serial({
                    'data': files,
                    'each': function (file, index, done) {
                        Less.compile(file, compress, done);
                    },
                    'all': function (values) {
                        var css = values.join('\r\n');
                        var file = options[compress ? 'min' : 'debug'];
                        File.write(file, css);
                    },
                });
            }

            compile(false);     //debug �档
            compile(true);      //min �汾��

        },

        build: function () {
            var meta = map.get(this);
            var options = meta.options;

            if (options.copy) {
                this.copy();
            }

            if (options.html2js) {
                this.html2js();
            }

            if (options.html) {
                this.html();
            }

            if (options.define) {
                this.define();
            }

            if (options.concat) {
                this.concat();
            }

            if (options.uglify) {
                this.uglify();
            }

            if (options.less) {
                this.less();
            }
           
        },

    };


    return Packer;


   
});




define('Packer/Refers', function (require, module, exports) {


    var $ = require('$');




    return {

        'get': function (list, id$mod) {

            //依赖于此的 ids
            var dep$ids = {};

            Object.keys(id$mod).forEach(function (id) {
                var mod = id$mod[id];

                Object.keys(mod.dep$count).forEach(function (dep) {
                    var ids = dep$ids[dep];
                    if (!ids) {
                        ids = dep$ids[dep] = [];
                    }

                    ids.push(id);
                });
            });

            //test
            //var File = require('File');
            //File.writeJSON('id$mod.json', id$mod);
            //console.log(id$mod);
            //console.log(dep$ids);

            var id$file = {};
            var ids = [];
            var exts = [];

            list.forEach(function (item) {
                if (item.startsWith('&')) {
                    exts.push(item);
                }
                else {
                    ids.push(item);
                }
            });

            add(ids);
            //console.log(id$file);


            //尝试加上额外的模块，如配置模块。
            ids = Object.keys(id$file);
            ids = ids.map(function (id) {
                return exts.map(function (item) {
                    return item.replace(/\&/g, id);
                });
            });

            ids = [].concat.apply([], ids); //降维。

            //console.log(ids);

            add(ids, true);

            //console.log(id$file);

            return id$file;




            function add(ids, noError) {

                ids.forEach(function (id) {
                    if (id$file[id]) {
                        return;
                    }

                    var mod = id$mod[id];
                    if (!mod) {
                        if (noError) {
                            return;
                        }
                        console.log('不存在模块:'.bgRed, id.cyan);
                        console.log('依赖于此模块的:'.bgMagenta, dep$ids[id].join(', ').yellow);
                        throw new Error();
                    }


                    id$file[id] = mod.file;

                    var deps = Object.keys(mod.dep$count);

                    deps = deps.filter(function (id) {
                        return !id$file[id];
                    });

                    add(deps, noError);
                });
            }
        },

    };

});

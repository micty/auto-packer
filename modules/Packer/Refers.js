


define('Packer/Refers', function (require, module, exports) {


    var $ = require('$');



    //模块与模块的依赖关系形成一个网状结构。 
    //在这里我们定义什么叫父模块和子模块：
    //如模块 A 与模块 B，如果 A 依赖 B，即 A -> B，则 A 为父模块，B 为子模块。
    //模块也分为两种类型：主模块和辅模块。

    //在这里我们还要定义什么叫主模块和辅模块：
    //主模块就是常规的模块，辅模块就是针对主模块的配置模块。
    //如模块 `Loading`，则可能会有两个配置模块 `Loading.defaults` 和 `Loading.config`，
    //为了方便管理，我们只指定主模块，辅模块则自动尝试搜索引入。
    //由于主模块不一定拥有相应的辅模块，因此搜索辅模块都是尝试的，不一定能搜索到。
    //如果主模块有相应的辅模块则引入，否则忽略，而不管该主模块是否依赖辅模块。
    

    //找出父模块。
    //如 A -> B, C -> B，则 { B: ['A', 'C'] }。
    //即依赖模块 B 的模块列表为 ['A', 'C']。
    function getParents(id$mod) {
        //依赖此的 ids。
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

        return dep$ids;
    }


    //从模块列表中过滤出所有的种子模块。
    function getSeeds(ids) {
        ids = ids.filter(function (id) {
            return !id.startsWith('&');
        });

        return ids;
    }

    //从模块列表中过滤出所有的扩展模块。
    function getExts(ids) {
        ids = ids.filter(function (id) {
            return id.startsWith('&');
        });

        return ids;
    }





    return {

        'get': function (ids, id$mod) {

            var dep$ids = getParents(id$mod);
            var seeds = getSeeds(ids);
            var exts = getExts(ids);

            var id$file = {};   //所有相关的模块。

            add(seeds);   //根据种子模块找出所有相关的模块。


            return { dep$ids, id$file, };



            //当指定为 noError 为 true 时，说明是在尝试搜索额外的模块，不一定能成功。
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

                    var sides = exts.map(function (item) {
                        return item.replace(/\&/g, id);
                    });

                    add(sides, true);



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

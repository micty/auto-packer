


define('Module/Deps', function (require, module, exports) {

   
    var $ = require('$');

    function $require(id) {
        return id;
    }



    function parse(content, regexp, method) {
        var deps = content.match(regexp);

        if (!deps) {
            return [];
        }

        deps = deps.map(function (item, index) {
            if (method) {
                item = item.replace(method, 'require');
            }

            if (!item.endsWith(')')) {
                item += ')';
            }

            return 'list[' + index + '] =' + item + '; ';


        });

        console.log(deps);

        var js = 'var list = [];' +
            deps.join('\r\n') +
            'return list';

        deps = new Function('require', js)($require);

        //去重。
        deps = Array.from(new Set(deps));
        //console.log(deps);
        return deps;

    }



    return {

        //通过 require.new() 动态绑定的模块。
        news: function (content) {
            var regexp = /\s+require.new\(\'[\s\S]*?\'/g;
            var deps = parse(content, regexp, 'require.new');
            return deps;
        },


        //通过 InnerModules.bind() 动态绑定的模块。
        binds: function(content){
            var regexp = /\s+InnerModules.bind\(\'[\s\S]*?\'/g;
            var deps = parse(content, regexp, 'InnerModules.bind');
            return deps;

        },

        //搜索公共模块依赖。
        publics: function (content) {
            var regexp = /\s+require\(\'[\s\S]*?\'\)/g;
            var deps = parse(content, regexp);
            return deps;
        },


        //搜索子模块依赖。
        privates: function (content) {
            var regexp = /\s+module.require\(\'[\s\S]*?\'/g;
            var deps = parse(content, regexp, 'module.require');
            return deps;
        },

    };

});

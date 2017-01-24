


define('Module/Deps', function (require, module, exports) {

   
    var $ = require('$');

    function $require(id) {
        return id;
    }


    return {

        //搜索公共模块依赖。
        publics: function (content) {
            var regexp = /\s+require\(\'[\s\S]*?\'\)/g;
            var deps = content.match(regexp);

            if (!deps) {
                return [];
            }

            deps = deps.map(function (item, index) {
                return 'list[' + index + '] = ' + item + '; ';
            });

            var js = 'var list = [];' + 
                deps.join('\r\n') + 
                'return list';

            deps = new Function('require', js)($require);

            return deps;
         
        },


        //搜索子模块依赖。
        privates: function (content) {
            var regexp = /\s+module.require\(\'[\s\S]*?\'\)/g;
            var deps = content.match(regexp);

            if (!deps) {
                return [];
            }

            deps = deps.map(function (item, index) {
                return 'list[' + index + '] = ' + item + '; ';
            });

            var js = 'var list = [];' +
                deps.join('\r\n') +
                'return list';

            deps = new Function('module', js)({ 'require': $require });

            return deps;
        },

    };

});

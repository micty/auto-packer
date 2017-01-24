


define('Module/ID', function (require, module, exports) {


    //用降级方式处理。
    function get(content) {

        var lines = content.split('\r\n');
        var s = lines.find(function (line) {
            return line.trim().startsWith('define(');
        });

        if (!s) {
            return false;
        }

        var index = s.indexOf(',');
        s = s.slice(0, index) + ')';

        var value;
        new Function('define', s)(function (id) {
            value = id;
        });

        return value;
    }
   

    return {

        //获取当前模块名，即 define() 里的第一个参数。 
        'get': function (content) {
           
            var value = null;

            try{
                new Function('define', content)(function (id, factory) {
                    value = id;
                });
                
                return value;
            }
            catch (ex) {
                //尝试用降级方式处理。
                var id = get(content);
                if (id) {
                    return id;
                }

                if (id !== false) {
                    console.log(ex);
                }
            }
        },

       
    };

});

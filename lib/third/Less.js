

var Less = require('less');     //详见: http://lesscss.org/usage/#programmatic-usage
var colors = require('colors'); //https://github.com/Marak/colors.js

/**
* 对第三方库 less 的封装。
*/
define('Less', function (require, module, exports) {

    var $ = require('$');
    var File = require('File');


    function compile(file, compress, done) {

        //重载 compile(file, done)
        if (typeof compress == 'function') {
            done = compress;
            compress = false;
        }

        var content = File.read(file);

        Less.render(content, {
            'paths': ['.'],             // Specify search paths for @import directives
            'filename': file,           // Specify a filename, for better error messages
            'compress': compress,       // Minify CSS output

        }, function (error, output) {

            if (error) {
                console.log('less 编译错误:'.bgRed, error.message.bgRed);
                console.log('所在文件: '.bgMagenta, file.bgMagenta);
                console.log(error);

                throw error;
            }

            var css = output.css;

            //less 输出的 css 是两个空格缩进的，此处用这种方式换成4个空格缩进，不知是否安全。
            if (!compress) {
                css = css.split('\n  ').join('\r\n    ');
            }

            console.log('编译'.green, file.cyan);
            done(css);

        });
    }





    return {
        'compile': compile,
    };

});





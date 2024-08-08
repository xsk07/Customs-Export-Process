var gulp = require('gulp');
var gulpless = require('gulp-less');
var gulpautoprefixer = require('gulp-autoprefixer');

//Creating a Style task that convert LESS to CSS
gulp.task('default',function(){
    /* This file has variables that need the rules.theme.less and import later */
    var srcfile = './libs/css/bizagi-default-theme.less';
    var newcss = './libs/css/';
        return gulp
                .src(srcfile)
                .pipe(gulpless())
                .pipe(gulpautoprefixer({browsers: ['last 2 versions','>5%']}))
                .pipe(gulp.dest(newcss));
});
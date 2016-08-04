/**
 * Created by 6396000799 on 2016/8/1.
 */
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const minifyCss = require('gulp-minify-css');
const minifyHtml = require('gulp-minify-html');
const imagemin = require('gulp-imagemin');
const base64 = require('gulp-base64'); //css中url图片转base64
const rename = require('gulp-rename');
const gzip = require('gulp-gzip');

gulp.task('gzip', () => 
    gulp.src('dist/**')
        .pipe(gzip({
            append: false,
            // skipGrowingFiles : true //压缩后文件变大则不压缩
        }))
        .pipe(gulp.dest('dist'))
);

gulp.task('babel', () => 
    gulp.src('www/js/main.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('main-compiled.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('www/js'))
);
gulp.task('js-uglify-1', () => 
    gulp.src(['www/js/main-compiled.js', 'www/js/socket.io.js'])
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
);
gulp.task('js-uglify-2', () => 
    gulp.src('www/js/vue.min.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
);
gulp.task('js-uglify', ['js-uglify-1', 'js-uglify-2']);
gulp.task('css-uglify', () => 
    gulp.src('www/css/main.css')
        .pipe(minifyCss())
        .pipe(base64({
            maxImageSize: 20 * 1024  //bytes
        }))
        .pipe(gulp.dest('dist/css'))
);
gulp.task('html-uglify', () =>
    gulp.src('www/index.html')
        .pipe(minifyHtml())
        .pipe(gulp.dest('dist'))
);
gulp.task('imagemin', () =>
    gulp.src('www/img/**')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
);

gulp.watch('www/js/main.js', ['babel']);
gulp.task('all', ['js-uglify', 'css-uglify', 'html-uglify']);
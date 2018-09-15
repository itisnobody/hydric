var gulp = require('gulp'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    prefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    sourcemaps = require('gulp-sourcemaps'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

// Pathes
var path = {
    dev: {
        clean: './dev',
        html: 'dev/',
        css: 'dev/css/',
        fonts: 'dev/fonts/',
        img: 'dev/img/'
    },
    src: {
        html: 'src/*.html',
        sass: ['src/style/**/*.scss', 'src/style/**/*.sass'],
        fonts: 'src/fonts/**/*.*',
        img: 'src/img/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        style: 'src/style/**/*.scss'
    },
};

// Clean
gulp.task('clean', function () {
    return gulp.src(path.dev.clean, {read: false})
        .pipe(clean());
});

// Server
gulp.task('server', function () {
    browserSync.init({
        server: path.dev.html,
        port: 3001
    });
    gulp.watch(path.src.html, ['html']);
    gulp.watch(path.src.sass, ['style']);
});

// Copy
gulp.task('copy', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.dev.fonts))
});

//HTML
gulp.task('html', function () {
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.dev.html))
        .pipe(reload({stream: true}));
});

//Style -- Sass/Scss to CSS
gulp.task('style', function () {
    gulp.src(path.src.sass)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dev.css))
        .pipe(reload({stream: true}));
});

//Images
gulp.task('images', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dev.img))
        .pipe(reload({stream: true}));
});


// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------


gulp.task('default', function(callback) {
    runSequence('copy',
        ['html', 'style', 'images'],
        'server',
        callback);
});
var gulp = require('gulp'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    prefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    sourcemaps = require('gulp-sourcemaps'),
    runSequence = require('run-sequence'),
	ghPages = require('gulp-gh-pages');
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

// Pathes
var path = {
    dev: {
        clean: ['./dev', './.publish'],
        html: 'dev/',
        fonts: 'dev/fonts/',
        img: 'dev/img/',
        style: 'dev/css/'
    },
    src: {
        html: 'src/*.html',
        fonts: 'src/fonts/**/*.*',
        img: 'src/img/**/*.*',
        style: 'src/style/**/*.css',
        sass: ['src/style/**/*.scss', 'src/style/**/*.sass']
    }
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
    gulp.watch(path.src.sass, ['sass']);
    gulp.watch(path.src.style, ['css']);
});

// Copy fonts
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

//Images
gulp.task('images', function () {
    gulp.src(path.src.img)
        // .pipe(imagemin({
        //     progressive: true,
            // svgoPlugins: [{removeViewBox: false}],
        //     use: [pngquant()],
        //     interlaced: true
        // }))
        .pipe(gulp.dest(path.dev.img))
        .pipe(reload({stream: true}));
});

// Sass/Scss to CSS
gulp.task('sass', function () {
    gulp.src(path.src.sass)
        .pipe(sourcemaps.init())
	        .pipe(sass())
	        .pipe(prefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.dev.style))
        .pipe(reload({stream: true}));
});

// Style
gulp.task('css', function () {
    gulp.src(path.src.style)
        .pipe(prefixer())
        .pipe(gulp.dest(path.dev.style))
        .pipe(reload({stream: true}));
});


// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------


gulp.task('default', function(callback) {
    runSequence('copy',
        ['html', 'images', 'css', 'sass'],
        'server',
        callback);
});

gulp.task('deploy', function() {
  return gulp.src('./dev/**/*')
    .pipe(ghPages());
});
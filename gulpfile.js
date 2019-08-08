var { src, dest, series, parallel, watch } = require('gulp'),
    del = require('del'),
    babel = require('gulp-babel'),
    sass = require('gulp-sass'),
    prefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    sourcemaps = require('gulp-sourcemaps'),
	ghPages = require('gulp-gh-pages');

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
        sass: 'src/style/**/*.scss'
    }
};

function clean() {
  return del(path.dev.clean)
}

function server() {
    browserSync.init({
        server: path.dev.html,
        port: 3001
    });
    watch(path.src.html, 'html');
    watch(path.src.sass, 'styles');
}

function fonts() {
    return src(path.src.fonts)
        .pipe(dest(path.dev.fonts))
}

function html() {
    return src(path.src.html)
        .pipe(dest(path.dev.html))
}

function images() {
  return src(path.src.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(dest(path.dev.img))
}

function styles() {
  return src(path.src.sass)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(prefixer())
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(path.dev.style))
}

exports.clean = clean;
exports.server = server;
exports.images = images;
exports.deploy = deploy;

exports.default = series(clean, fonts, parallel(html, styles, images));

function deploy() {
  return src('./dev/**/*')
    .pipe(ghPages());
}
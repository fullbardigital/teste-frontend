// Adiciona os modulos instalados
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

// Função para minificar HTML
function minHTML() {
    return gulp
        .src('./desenv/*.html')
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest('./prod'))
        .pipe(browserSync.stream());
}
// Funçao para compilar o SASS e adicionar os prefixos
function compilaSass() {
    return gulp
        .src('./desenv/sass/*.scss')
        .pipe(
            sass({
                outputStyle: 'compressed'
            })
        )
        .pipe(
            autoprefixer({
                browsers: [
                    'last 2 versions'
                ],
                cascade: false
            })
        )
        .pipe(gulp.dest('./prod/css'))
        .pipe(browserSync.stream());
}
// Função para juntar o JS
function gulpJS() {
    return (
        gulp
            .src('./desenv/js/*.js')
            .pipe(
                babel({
                    presets: ['env']
                })
            )
            .pipe(uglify())
            .pipe(gulp.dest('./prod/js'))
            .pipe(browserSync.stream())
    );
}
// Funcao para minificar imagens para produção
function gulpImages() {
    return gulp
        .src('./desenv/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./prod/img'))
        .pipe(browserSync.stream());
}

// Função para iniciar o browser
function browser() {
    browserSync.init({
        server: {
            baseDir: './prod', //Pasta padrão que será carregada
            index: 'index.html' //Aqui pode mudar a index que será carregada primeiro
        }
    });
}
// Função de watch do Gulp
function watch() {
    gulp.watch('./desenv/sass/*.scss', compilaSass);
    gulp.watch('./desenv/js/*.js', gulpJS);
    gulp.watch('./desenv/*.html', minHTML);
    gulp.watch('./desenv/img/**/*', gulpImages);
    gulp.watch(['./prod']).on('change', browserSync.reload);
}
// Minify HTML
gulp.task('htmlmin', minHTML);
// Compila SASS
gulp.task('sass', compilaSass);
// Complila JS
gulp.task('mainjs', gulpJS);
// Minifica Imagens
gulp.task('min-img', gulpImages);
// Inicia Browser
gulp.task('browser-sync', browser);
// Inicia o watcher
gulp.task('watch', watch);
// Tarefa padrão do Gulp, que inicia o watch e o browser-sync
gulp.task(
    'default',
    gulp.parallel(
        'watch',
        'browser-sync',
        'htmlmin',
        'mainjs',
        'min-img',
        'sass'
    )
);

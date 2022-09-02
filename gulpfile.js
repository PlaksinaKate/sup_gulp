const { src, dest, parallel, series, watch, task } = require('gulp');
var scss = require('gulp-sass')


var browserSync = require('browser-sync').create();
// Определяем логику работы Browsersync
function browsersync() {
    browserSync.init({ // Инициализация Browsersync
        server: { baseDir: 'app/' }, // Указываем папку сервера
        notify: false, // Отключаем уведомления
        online: true // Режим работы: true или false
    })
}

task('scss', () => {
    return src('scss/*.scss')
        .pipe(scss())
        .pipe(dest('css'))
});

task('js', function () {
    return src('js/*js')
        .pipe(browserify())
        .pipe(uglify())
        .pipe(dest('dist/js'));
});

// create a task that ensures the `js` task is complete before
// reloading browsers
task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});

// use default task to launch Browsersync and watch JS files
task('default', ['js'], function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    watch("js/*.js", ['js-watch']);
});

task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

task('serve', ['sass'], function () {

    browserSync.init({
        server: "./app"
    });

    watch("app/scss/*.scss", ['sass']);
    watch("app/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
task('sass', function () {
    return gulp.src("app/scss/*.scss")
        .pipe(sass())
        .pipe(dest("app/css"))
        .pipe(browserSync.stream());
});

task('default', ['serve']);
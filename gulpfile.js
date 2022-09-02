const { src, dest, parallel, series, watch, task } = require('gulp');
const scss = require('gulp-sass')
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();

// Определяем логику работы Browsersync
function browsersync() {
    browserSync.init({ // Инициализация Browsersync
        server: { baseDir: 'src/' }, // Указываем папку сервера
        notify: false, // Отключаем уведомления
        online: true // Режим работы: true или false
    })
}

exports.browsersync = browsersync;

function scripts() {
    return src([ // Берем файлы из источников
        'node_modules/jquery/dist/jquery.min.js', // Пример подключения библиотеки
        'app/js/app.js', // Пользовательские скрипты, использующие библиотеку, должны быть подключены в конце
    ])
        .pipe(concat('app.min.js')) // Конкатенируем в один файл
        .pipe(uglify()) // Сжимаем JavaScript
        .pipe(dest('app/js/')) // Выгружаем готовый файл в папку назначения
        .pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
}

/* task('scss', () => {
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

task('default', ['serve']); */
const { src, dest, parallel, series, watch, task } = require('gulp');
const scss = require('gulp-sass')
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));

const autoprefixer = require('gulp-autoprefixer');

const cleancss = require('gulp-clean-css');

const imagecomp = require('compress-images');

const clean = require('gulp-clean');

// Определяем логику работы Browsersync
function browsersync() {
    browserSync.init({ // Инициализация Browsersync
        server: { baseDir: 'src/' }, // Указываем папку сервера
        notify: false, // Отключаем уведомления
        online: true // Режим работы: true или false
    })
}

function minifyJS() {
    return src([ // Берем файлы из источников
        'src/assets/js/*.js', // Пользовательские скрипты, использующие библиотеку, должны быть подключены в конце
    ])
        .pipe(concat('app.min.js')) // Конкатенируем в один файл
        .pipe(uglify()) // Сжимаем JavaScript
        .pipe(dest('dist/assets/js/')) // Выгружаем готовый файл в папку назначения
        .pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
}

function styles() {
    return src('src/assets/sass/*.scss')
        .pipe(concat('app.min.css')) // Конкатенируем в файл app.min.js
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
        .pipe(cleancss({ level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ })) // Минифицируем стили
        .pipe(dest('dist/assets/css/')) // Выгрузим результат в папку "app/css/"
        .pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}

async function images() {
    imagecomp(
        "src/imgs/src/**", // Берём все изображения из папки источника
        "src/imgs/dest/", // Выгружаем оптимизированные изображения в папку назначения
        { compress_force: false, statistic: true, autoupdate: true }, false, // Настраиваем основные параметры
        { jpg: { engine: "mozjpeg", command: ["-quality", "75"] } }, // Сжимаем и оптимизируем изображеня
        { png: { engine: "pngquant", command: ["--quality=75-100", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
        function (err, completed) { // Обновляем страницу по завершению
            if (completed === true) {
                browserSync.reload()
            }
        }
    )
}

function cleanimg() {
    return src('src/imgs/dest/', { allowEmpty: true }).pipe(clean()) // Удаляем папку "app/images/dest/"
}

function startwatch() {
    watch(['src/assets/**/*.js', '!dist/assets/**/*.min.js'], minifyJS);
    watch('src/assets/sass/*.scss', styles)
    watch('src/*.html').on('change', browserSync.reload);
    watch('src/imgs/src/**/*', images);
}

exports.browsersync = browsersync;
exports.minifyJS = minifyJS;
exports.styles = styles;
exports.images = images;
exports.cleanimg = cleanimg;
exports.default = parallel(styles, minifyJS, browsersync, startwatch);
exports.build = series(styles, minifyJS, images, buildcopy);

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
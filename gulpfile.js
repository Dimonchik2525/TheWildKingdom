import gulp from 'gulp';
import { plugins } from './config/gulp-plugins.js';
import { path } from './config/gulp-settings.js';

global.app = {
   isBuild: process.argv.includes('--build'),
   isDev: !process.argv.includes('--build'),
   isWebP: !process.argv.includes('--nowebp'),
   isFontsReW: process.argv.includes('--rewrite'),
   gulp: gulp,
   path: path,
   plugins: plugins
}

import { reset } from './config/gulp-task/reset.js';
import { html } from './config/gulp-task/html.js';
import { css } from './config/gulp-task/css.js';
import { js } from './config/gulp-task/js.js';
import { jsDev } from './config/gulp-task/js-dev.js';
import { images } from './config/gulp-task/images.js';
//import { ftp } from "./config/gulp-tasks/ftp.js";
import { zip } from "./config/gulp-task/zip.js";
import { sprite } from "./config/gulp-task/sprite.js";
import { otfToTtf, ttfToWoff, fonstStyle } from "./config/gulp-task/fonts.js";


// Последовательная обработака шрифтов
const fonts = gulp.series(reset, otfToTtf, ttfToWoff, fonstStyle);
// Основные задачи будем выполнять параллельно после обработки шрифтов
const devTasks = gulp.parallel(fonts);
// Основные задачи будем выполнять параллельно после обработки шрифтов
const buildTasks = gulp.series(fonts, jsDev, js, gulp.parallel(html, css, images));

// Экспорт задач
export { html }
export { css }
export { js }
export { jsDev }
export { images }
export { fonts }
export { sprite }
//export { ftp }
export { zip }

// Построение сценариев выполнения задач
const development = gulp.series(devTasks);
const build = gulp.series(buildTasks);
//const deployFTP = gulp.series(buildTasks, ftp);
const deployZIP = gulp.series(buildTasks, zip);

// Экспорт сценариев
export { development }
export { build }
//export { deployFTP }
export { deployZIP }

// Выполнение сценария по умолчанию
gulp.task('default', development);
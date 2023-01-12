const { src, dest, watch, series, parallel } = require("gulp");
//CSS Y SASS
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");

const sorucemaps = require("gulp-sourcemaps");

const cssnano = require("cssnano"); //minificar la hoja css

//Imagenes
const imagemin = require("gulp-imagemin");
const wepb = require("gulp-webp");
const avif = require("gulp-avif");

function css(done) {
  //compilar sass
  //pasos 1--identificar archivo, 2 compilar, 3 guardar el .css

  src("src/scss/app.scss")
    .pipe(sorucemaps.init())
    //compilar y luego minificar la hoja css
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sorucemaps.write("."))
    .pipe(dest("build/css"));

  done();
}

function imagenes(done) {
  src("src/img/**/*")
    //minificar imagenes
    .pipe(imagemin({ optimizationLevel: 3 }))
    .pipe(dest("build/img"));
  done();
}

//version imagenes Webp
function versionWebp(done) {
  const opciones = {
    quality: 50,
  };
  src("src/img/**/*.{png,jpg}").pipe(wepb(opciones)).pipe(dest("build/img"));
  done();
}
//version imagenes Avif
function versionAvif(done) {
  const opciones = {
    quality: 50,
  };
  src("src/img/**/*.{png,jpg}").pipe(avif(opciones)).pipe(dest("build/img"));
  done();
}
function dev() {
  //para que se actualice cada vez que hago un cambio para todos los archivos que terminen en .scss
  watch("src/scss/**/*.scss", css);
  watch("src/img/**/*", imagenes);
  /* 
  watch("src/scss/app.scss", css); */
}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series(imagenes, versionWebp, versionAvif, css, dev);

//series-se inicia una tarea y luego la otra
//parallel-se inician al mismo tiempo

const path = require('path');

module.exports = {
  mode: "development", // "production" | "development" | "none"
  // Chosen mode tells webpack to use its built-in optimizations accordingly.
  context: path.join(__dirname, 'src'),
  entry: "./index.js", // string | object | array
  // defaults to ./src
  // Here the application starts executing
  // and webpack starts bundling
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
    chunkFilename: '[chunkhash].js'
  },
  module: {
    // configuration regarding modules
    rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            { 
                loader: "babel-loader",
                options: {
                    presets: ['@babel/preset-env']
                }
            }
          ]
        },
        {
          test: /node_modules\/@angular\/common\/locales/,
          use: [
            { loader: "babel-loader" }
          ]
        },
        {
          test: /\.html$/,
          use: [
            { loader: "html-loader" }
          ]
        },
        {
          test: /\.css$/,
          use: [
            "style-loader",
            "css-loader"
          ]
        },
        {
          test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            { loader: "url-loader?limit=10000&mimetype=application/font-woff" }
          ]
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            { loader: "url-loader?limit=10000&mimetype=application/octet-stream" }
          ]
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            { loader: "file-loader" }
          ]
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            { loader: "url-loader?limit=10000&mimetype=image/svg+xml" }
          ]
        },
        {
          test: /\.(png|jpg|ico)$/,
          use: [
            { loader: "file-loader" }
          ]
        }
      ],
  },
  resolve: {
    // options for resolving module requests
    // (does not apply to resolving to loaders)
    modules: ["node_modules"],
    extensions: [".js", ".css", ".html"],
    // extensions that are used
    alias: {
        "@angular/compiler": "@angular/compiler/bundles/compiler.umd.js",
        "@angular/core": "@angular/core/bundles/core.umd.js",
        "@angular/forms": "@angular/forms/bundles/forms.umd.js",
        "@angular/router": "@angular/router/bundles/router.umd.js",
        "@angular/platform-browser$": "@angular/platform-browser/bundles/platform-browser.umd.js",
        "@angular/platform-browser/platform-browser-animations": "@angular/platform-browser/bundles/platform-browser-animations.umd.js",
        "@angular/platform-browser-dynamic": "@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js",
        "@angular/animations/browser": "@angular/animations/bundles/animations-browser.umd.js",
        "@angular/animations$": "@angular/animations/bundles/animations.umd.js",
        "@angular/common$": "@angular/common/bundles/common.umd.js",
        "zone.js": "zone.js/dist/zone.min.js",
        "rxjs/observable/from": "rxjs/observable/from.js",
        "rxjs/observable/of": "rxjs/observable/of.js",
        "rxjs/observable/fromPromise": "rxjs/observable/fromPromise.js",
        "rxjs/operator/concatMap": "rxjs/operator/concatMap.js",
        "rxjs/operator/every": "rxjs/operator/every.js",
        "rxjs/operator/map": "rxjs/operator/map.js",
        "rxjs/operator/mergeAll": "rxjs/operator/mergeAll.js",
        "rxjs/operator/mergeMap": "rxjs/operator/mergeMap.js",
        "rxjs/operator/reduce": "rxjs/operator/reduce.js",
        "rxjs/operator/last": "rxjs/operator/last.js",
        "rxjs/operator/catch": "rxjs/operator/catch.js",
        "rxjs/operator/concatAll": "rxjs/operator/concatAll.js",
        "rxjs/operator/first": "rxjs/operator/first.js",
        "rxjs/operator/filter": "rxjs/operator/filter.js",
        "rxjs/util/EmptyError": "rxjs/util/EmptyError.js",
        "rxjs/add/operator/catch": "rxjs/add/operator/catch.js",
        "rxjs/add/observable/throw": "rxjs/add/observable/throw.js",
        "rxjs/add/observable/defer": "rxjs/add/observable/defer.js",
        "rxjs/Observable": "rxjs/Observable.js",
        "@angular/material/toolbar": "@angular/material/bundles/material-toolbar.umd.js",
        "@angular/material/menu": "@angular/material/bundles/material-menu.umd.js",
        "@angular/material/icon": "@angular/material/bundles/material-icon.umd.js",
        "@angular/material/button": "@angular/material/bundles/material-button.umd.js",
        "@angular/material/table": "@angular/material/bundles/material-table.umd.js",
        "@angular/material/divider": "@angular/material/bundles/material-divider.umd.js",
        "@angular/material/progess-spinner": "@angular/material/bundles/material-progress-spinner.umd.js",
        "@angular/material/input": "@angular/material/bundles/material-input.umd.js",
        "@angular/material/card": "@angular/material/bundles/material-card.umd.js",
        "@angular/material/slide-toggle": "@angular/material/bundles/material-slide-toggle.umd.js",
        "@angular/material/select": "@angular/material/bundles/material-select.umd.js",
        "@angular/material/core": "@angular/material/bundles/material-core.umd.js",
        "@angular/material/sidenav": "@angular/material/bundles/material-sidenav.umd.js",
        "@angular/material/list": "@angular/material/bundles/material-list.umd.js",
        "@angular/material/expansion": "@angular/material/bundles/material-expansion.umd.js",
        "@angular/material/form-field": "@angular/material/bundles/material-form-field.umd.js",
        "@angular/material/grid-list": "@angular/material/bundles/material-grid-list.umd.js",
        "@angular/material/checkbox": "@angular/material/bundles/material-checkbox.umd.js",
        "@angular/material/chips": "@angular/material/bundles/material-chips.umd.js",
        "@angular/material/paginator": "@angular/material/bundles/material-paginator.umd.js",
        "@angular/cdk/collections": "@angular/cdk/bundles/cdk-collections.umd.js",
        "@angular/material/dialog": "@angular/material/bundles/material-dialog.umd.js",
        "flexboxgrid": "flexboxgrid/css/flexboxgrid.css",
        "ng2-charts": "ng2-charts/bundles/ng2-charts.umd.js",
        "chartjs-plugin-datalabels": "chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.js"
    },
    /* Alternative alias syntax (click to show) */
    /* Advanced resolve configuration (click to show) */
  },
  devtool: "source-map", // enum
  // the home directory for webpack
  // the entry and module.rules.loader option
  //   is resolved relative to this directory
  target: "web", // enum
  // Don't follow/bundle these modules, but request them at runtime from the environment
  stats: "errors-only",
  // lets you precisely control what bundle information gets displayed
  plugins: [
    // ...
  ]
}
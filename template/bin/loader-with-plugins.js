const $path = require('path')
const $fs = require('fs')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const prettyjson = require('prettyjson')
const { getFilename } = require('./utils')

exports.getVueLoaderWithPlugins = function () {
  const VueLoaderPlugin = require('vue-loader/lib/plugin')
  return {
    loaders: {
      test: /\.vue$/,
      use: ["thread-loader", {
        loader: 'vue-loader',
      }],
      exclude: /node_modules/,
    },
    plugins: [new VueLoaderPlugin()]
  }
}

const BaseLoader = ['css-loader', 'stylus-loader'] // ['postcss-loader', 'css-loader', 'stylus-loader']
exports.getStlyLoaderMaybeWithPluginsAsEntryHandler = function (isdev, withPlugin) {
  const test = /\.styl$/

  if (withPlugin) {
    return {
      loaders: {
        test,
        loader: ExtractTextWebpackPlugin.extract({
          use: BaseLoader,
          remove: false
        })
      },
      plugins: [ new ExtractTextWebpackPlugin(getFilename(isdev, true, 'css')) ]
    }
  } else {
    return {
      loaders: {
        test,
        use: ["thread-loader", 'style-loader'].concat(BaseLoader)
      },
      plugins: []
    }
  }
}

exports.getStylLoaderMaybeWithPlugins = function (isdev, withPlugin) {
  const test = /\.styl$/
  const MiniCssExtractPlugin = require("mini-css-extract-plugin");
  const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

  if (withPlugin) {
    return {
      loaders: {
        test,
        use: ["thread-loader", {
          loader: MiniCssExtractPlugin.loader
        }].concat(BaseLoader)
      },
      plugins: [ new MiniCssExtractPlugin(getFilename(isdev, true, 'css')), new OptimizeCssAssetsPlugin() ]
    }
  } else {
    return {
      loaders: {
        test,
        use: ["thread-loader", 'style-loader'].concat(BaseLoader)
      },
      plugins: []
    }
  }
}

function try_require(path_) {
  var json = {}
  try {
    if ($fs.existsSync(path_)) {
      json = require(path_)
    }
  } catch (e) {}
  return json
}

exports.getJadeLoaderWithPlugins = function (isdev, assetsRoot) {
  const test = /\.jade$/
  let manifest = null

  return {
    loaders: {
      test: test,
      loader: ExtractTextWebpackPlugin.extract({
        use: {
          loader: 'jade-url-replace-loader',
          options: {
            attrs: ['a:href', 'img:src','script:src','link:href'],
            getEmitedFilePath: function (url) {
              if (isdev) return url
              if (!manifest) {
                var m1 = try_require($path.join(assetsRoot, 'manifest-js.json'))
                var m2 = try_require($path.join(assetsRoot, 'manifest-stylus.json'))
                var m3 = try_require($path.join(assetsRoot, 'manifest-img.json'))
                manifest = Object.assign({}, m1, m2, m3)
                console.log('Process view files')
                console.log('Manifest from previous compilation:')
                for (var file in manifest) {
                  console.log(' ' + file.green + ' => \n   ' + manifest[file].yellow)
                }
              }
              var hashed = manifest[url]
              if (hashed) {
                return hashed
              } else {
                if (url.indexOf('/lib/') < 0) {
                  if (url.indexOf('javascript:;') === 0 ||
                    url.indexOf('mailto:') === 0 ||
                    url.indexOf('http') === 0 ||
                    url.indexOf('#{') === 0) {
                      //do not care above url
                  } else {
                    console.warn('[WARN]: Not found ' + url + ' in manifest files'.magenta)
                  }
                }
                return url
              }
            }
          }
        }
      })
    },
    plugins: [
      new ExtractTextWebpackPlugin(getFilename(true, false, 'jade'))
    ]
  }
}

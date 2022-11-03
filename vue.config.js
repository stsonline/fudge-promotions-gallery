const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = {
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin()
    ],
    module: {
      exprContextCritical: false
    },
    resolve: {
      fallback: {
        fs: false,
        net: false
      }
    }
  }
};

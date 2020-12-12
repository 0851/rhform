const path = require('path')
module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    exclude: /node_modules/,
    loader: require.resolve('babel-loader'),
    options: {
      "extends": path.resolve(__dirname, "../../.babelrc")
    }
  })
  config.module.rules.push({
    test: /\.less$/,
    exclude: /node_modules/,
    include: path.resolve(__dirname, '../../src'),
    use: [
      {
        loader: require.resolve('style-loader') // creates style nodes from JS strings
      },
      {
        loader: require.resolve('css-loader') // translates CSS into CommonJS
      },
      {
        loader: require.resolve('less-loader')  // compiles Less to CSS
      }
    ]
  })

  config.resolve.extensions.push('.js', '.ts', '.tsx')
  config.resolve.symlinks = false

  return config
}

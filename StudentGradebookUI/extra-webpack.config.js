const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  plugins: [
    new NodePolyfillPlugin()
  ],
  resolve: {
    fallback: {
      "stream": require.resolve("stream-browserify"),
      "string_decoder": require.resolve("string_decoder/")
    }
  }
};

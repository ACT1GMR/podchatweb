const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (e, argv) => {
  const mode = argv.mode;
  let base = {
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: {minimize: true}
            }
          ]
        },
        {
          test: /\.(png|jpg|gif|ttf|eot|woff2|woff)$/,
          use: [
            {
              loader: "url-loader"
            }
          ]
        },
        {
          test: /\.scss$/,
          use: [
            "style-loader", // creates style nodes from JS strings
            {
              loader: "css-loader",
              options: {
                modules: true,
                localIdentName: mode === "production" ? "[hash:base64:5]" : "[local]"
              }
            },
            {
              loader: "sass-loader",
              options: {
                data: '@import "../variables.scss";',
                includePaths: [__dirname, "styles"]
              }
            }
          ],

        }
      ]
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "./index.html",
        filename: "./index.html"
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      })
    ],
    node: {
      fs: "empty",
      net: "empty",
      tls: "empty"
    },
  };

  //IF MODE IS PRODUCTION
  if (mode === "production") {
    base.output = {
      path: __dirname + "/dist",
      filename: "index.js",
      library: "",
      libraryTarget: "commonjs"
    }
  } else {
    base.devtool = "source-map"
  }

  return base;
};

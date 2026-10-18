module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "webpack"],

    files: [
      {
        pattern: "src/**/*.spec.jsx",
        watched: false,
      },
    ],

    preprocessors: {
      "src/**/*.spec.jsx": ["webpack"],
    },

    webpack: {
      mode: "development",
      devtool: "inline-source-map",

      resolve: {
        extensions: [".js", ".jsx"],
      },

      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  ["@babel/preset-react", { runtime: "automatic" }],
                ],
              },
            },
          },
          {
            test: /\.(png|jpe?g|svg|webp|gif|mp4)$/i,
            type: "asset/resource",
          },
        ],
      },
    },

    browsers: ["ChromeHeadless"],
    reporters: ["progress"],
    singleRun: true,
  });
};
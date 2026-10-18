module.exports = function (config) {
  const medirCobertura = process.env.HUERTO_COVERAGE === "1";
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
                plugins: medirCobertura
                  ? [["babel-plugin-istanbul", { exclude: ["**/*.spec.jsx", "**/node_modules/**"] }]]
                  : [],
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
    reporters: medirCobertura ? ["progress", "coverage"] : ["progress"],
    coverageReporter: {
      dir: "coverage",
      reporters: [{ type: "json", subdir: ".", file: "coverage-executed.json" }],
    },
    singleRun: true,
  });
};

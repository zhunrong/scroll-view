process.env.VUE_APP_VERSION = require("./package.json").version;

const isDev = process.env.NODE_ENV === "development";

module.exports = {
  outputDir: "docs",
  publicPath: isDev ? "/" : "/scroll-view/",
  configureWebpack: config => {
    if (config.output.libraryTarget === "umd") {
      config.externals = {
        "@juggle/resize-observer": "@juggle/resize-observer",
      };
    }
  }
};

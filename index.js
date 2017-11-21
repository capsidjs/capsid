if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/capsid-cjs");
} else {
  module.exports = require("./dist/capsid-cjs.development");
}

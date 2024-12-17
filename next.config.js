const path = require("node:path");

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};

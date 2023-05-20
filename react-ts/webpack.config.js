const CopyWebpackPlugin = require("copy-webpack-plugin"); // Copies individual files or entire directories to the build directory
const path = require("path"); // Node.js path module for working with file paths


module.exports = {
  mode: process.env.NODE_ENV ?? "development", // Use "production" for minified bundle
  entry: "./src/entrypoint.tsx", // Entry point of your application
  module: {
    rules: [
      /**
       * TS/TSX Loader
       *
       * This will load our React component files
       */
      {
        test: /\.tsx?$/, // File extension pattern for TypeScript and JSX files

        /** This uses tsc (TypeScript compiler) under the hood, and reads tsconfig.json for config */
        use: "ts-loader", // Loader for TypeScript files

        exclude: /node_modules/, // Exclude the 'node_modules' folder from being processed
      },

      /**
       * CSS Loader
       *
       * This will load our per-component CSS files
       */
      {
        test: /\.css$/, // File extension pattern for CSS files
        use: ["style-loader", "css-loader"], // Loaders to apply to CSS files
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"], // File extensions to resolve
  },
  output: {
    filename: "bundle.js",  // Name of the bundled output file
    path: path.resolve(__dirname, "dist"), // Output directory for bundled files
  },

  /**
   * Copies all files from /public to /dist.  This is for **production build only** (not used by dev server)
   *
   * ### Why do we need this?
   *
   * Since we are building our bundle.js to the dist/ folder, we also want our index.html and globals.css files
   * to live in the same directory so that /dist has EVERYTHING needed to serve the app.
   *
   * 1. Run `yarn build`
   * 2. Use live-server (or some other server) and serve the contents of /dist
   */
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "public" }], // Copy all files from /public to /dist
    }),
  ],
};
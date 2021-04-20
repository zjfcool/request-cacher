import { babel } from "@rollup/plugin-babel";
export default {
  input: "./index.js",
  output: [
    {
      file: "dist/request-cacher.js",
      format: "umd",
      name: "requestCacher",
    },
  ],
  plugins: [
    babel({
      exclude: /node_modules/,
    }),
  ],
};

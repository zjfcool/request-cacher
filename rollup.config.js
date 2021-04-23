export default {
  input: "./index.js",
  output: [
    {
      file: "lib/request-cacher.js",
      format: "umd",
      name: "requestCacher",
    },
    {
      file: "lib/request-cacher.esm.js",
      format: 'esm'
    },
    {
      file: "lib/request-cacher.cjs.js",
      format: 'cjs'
    },
  ],
};

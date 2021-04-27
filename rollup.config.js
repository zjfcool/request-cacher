export default {
  input: "./index.js",
  output: [
    {
      file: "lib/request-cacher.js",
      format: "umd",
      name: "requestCacher",
    },
  ],
};

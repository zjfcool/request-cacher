import html, { makeHtmlAttributes } from '@rollup/plugin-html'
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
    html({
      publicPath: '/request-cacher/dist/',
      template: ({ attributes, meta, files, publicPath, title }) => {
        const scripts = (files.js || [])
          .map(({ fileName }) => {
            const attrs = makeHtmlAttributes(attributes.script);
            return `<script src="${publicPath}${fileName}"${attrs}></script>`;
          })
          .join('\n');

        const links = (files.css || [])
          .map(({ fileName }) => {
            const attrs = makeHtmlAttributes(attributes.link);
            return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`;
          })
          .join('\n');

        const metas = meta
          .map((input) => {
            const attrs = makeHtmlAttributes(input);
            return `<meta${attrs}>`;
          })
          .join('\n');

        return `
    <!doctype html>
    <html${makeHtmlAttributes(attributes.html)}>
      <head>
        ${metas}
        <title>${title}</title>
        ${links}
      </head>
      <body>
      <button id="btn">fetch发送请求</button>
    <button id="btn2">axios发送请求</button>
    <button id="btn3">xhr发送请求</button>
    <button id="btn4">清除缓存</button>
        ${scripts}
        <script src="https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js"></script>
    <script>
        window.onload = function () {
            const btn = document.querySelector('#btn')
            const btn2 = document.querySelector('#btn2')
            const btn3 = document.querySelector('#btn3')
            const btn4 = document.querySelector('#btn4')
            btn.addEventListener('click', fetchHandler)
            btn2.addEventListener('click', axiosHandler)
            btn3.addEventListener('click', xhrHandler)
            btn4.addEventListener('click', clearAllHandler)
        }
        const {requestCache,clearAll} = window.requestCacher
        function httpGet(url) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.open('get', url)
                xhr.onload = () => {
                    if (xhr.status === 200) {
                        try {
                            let result = JSON.parse(xhr.responseText);
                            resolve(result)
                        } catch (err) {
                            resolve(xhr.responseText)
                        }

                    } else {
                        reject(xhr)
                    }
                }
                xhr.send()
            })
        }
        function fetchHandler() {
            requestCache(fetch, '${publicPath}user.json').then(res => {
                console.log(res)
            }).catch((err) => console.log(err))
        }
        function axiosHandler() {
            requestCache(axios, '${publicPath}user.json').then(res => {
                console.log(res)
            })
        }
        function xhrHandler() {
            requestCache(httpGet, '${publicPath}user.json').then(res => {
                console.log(res)
            })
        }
        function clearAllHandler() {
            clearAll()
        }
    </script>
      </body>
    </html>`;
      }
    })
  ],
};

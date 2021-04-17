function getType(a) {
    return Object.prototype.toString.call(a).slice(8, -1).toLowerCase()
}
function isFunction(a) {
    return getType(a) === 'function'
}
function isObject(a) {
    return getType(a) === 'object';
}
let cacheObj = {};
function requestCache(request, ...args) {
    return new Promise(async (resolve, reject) => {
        let url = "";
        if (typeof args[0] === 'string') {
            url = args[0]
        } else if (isObject(args[0])) {
            url = args[0] && args[0].url
        }
        if (url === '') return console.error('not found request url')
        if (!cacheObj[url]) {
            cacheObj[url] = {
                data: null,
                status: 1,
            }
        }
        if (cacheObj[url].status === 1 && cacheObj[url].data) return resolve(cacheObj[url]);
        if (isFunction(request)) {
            const result = request(...args)
            if (result instanceof Promise) {
                result.then(async res => {
                    cacheObj[url].status = 1;
                    if (res.json && isFunction(res.json)) {
                        cacheObj[url].data = await res.json()
                        resolve(cacheObj[url])
                    }
                    else {
                        cacheObj[url].data = res.data || res;
                        resolve(cacheObj[url])
                    }
                }).catch(err => {
                    cacheObj[url].status = 0
                    reject(err)
                })
            }
        }

    })
}
function getCatchObj() {
    return cacheObj
}
function clear(urls) {
    if (typeof urls === 'string') urls = [urls]
    if (Array.isArray(urls)) {
        urls.forEach(url => {
            if (cacheObj[url]) delete cacheObj[url]
        })
    }
}
function clearAll() {
    cacheObj = {}
    return cacheObj;
}
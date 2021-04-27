function getType(a) {
    return Object.prototype.toString.call(a).slice(8, -1).toLowerCase();
}
function isFunction(a) {
    return getType(a) === "function";
}
function isObject(a) {
    return getType(a) === "object";
}
function isNumber(a) {
    return getType(a) === 'number';
}
function isString(a) {
    return getType(a) === 'string';
}
function hashCode(str) {
    var hash = 0,
        i,
        chr,
        len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
let cacheObj = {};
const fromTYpe = {
    cache: "cache",
    request: "request"
}
function requestCache(request, ...args) {
    return new Promise(async (resolve, reject) => {
        let url = "";
        if (typeof args[0] === "string") {
            url = args[0];
        } else if (isObject(args[0])) {
            url = args[0] && args[0].url;
        }
        if (url === "") return console.error("not found request url");
        let oid = url
        try {
            oid = hashCode(JSON.stringify(args.map((arg, index) => ({ [index]: arg }))))
        } catch (err) {
            console.error(err)
        }
        if (!cacheObj[oid]) {
            cacheObj[oid] = {
                data: null,
                oid: oid,
                options: args,
                status: 1,
                from: fromTYpe.cache
            };
        }
        if (cacheObj[oid].status === 1 && cacheObj[oid].data)
            return resolve(cacheObj[oid]);
        if (isFunction(request)) {
            const result = request(...args);
            if (result instanceof Promise) {
                result
                    .then((res) => {
                        cacheObj[oid].status = 1;
                        cacheObj[oid].from = fromTYpe.request;
                        if (res.json && isFunction(res.json)) {
                            if (res.ok) {
                                res.json().then(data => {
                                    cacheObj[oid].data = data
                                    resolve(cacheObj[oid]);
                                })
                            } else {
                                cacheObj[oid].status = 0;
                                reject(res)
                            }

                        } else {
                            cacheObj[oid].data = res.data || res;
                            resolve(cacheObj[oid]);
                        }
                    })
                    .catch((err) => {
                        cacheObj[oid].status = 0;
                        reject(err);
                    });
            }
        }
    });
}
function getCache() {
    return cacheObj;
}
function getCacheByOids(oids) {
    if (isNumber(oids) || isString(oids)) return cacheObj[oid];
    if (Array.isArray(oids)) {
        return oids.map((oid) => cacheObj[oid]);
    }
    console.error('arguments should be a number || string || array')
}
function clearCache() {
    cacheObj = {};
    return cacheObj;
}
function clearCacheByOids(oids) {
    if (isNumber(oids) || isString(oids)) oids = [oids];
    if (Array.isArray(oids)) {
        oids.forEach((oid) => {
            if (cacheObj[oid]) delete cacheObj[oid];
        });
    }
}

export {
    requestCache,
    clearCache,
    clearCacheByOids,
    getCache,
    getCacheByOids
};

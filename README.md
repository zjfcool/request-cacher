# Request Cacher
Cache network request data to avoid repeated requests and improve response time.
# Install
```node
npm install request-cacher -S
```
# Usage
```javascript
import {requestCache} from 'request-cacher'
// import axios from 'axios'
async function getData(){
    //oid is unique identification ;data is response data; options is request function arguments;
    //const {oid,data,options} = await requestCache(axios,url)
    const {oid,data,options} = await requestCache(fetch,url,{method:"get"})
    console.log(oid,data)
}
setInterval(()=>{
    getData()//In fact,only one HTTP request occurred
},1000)
```
# API
### requestCache(request,...args)
* request
    * type:function;such as axios,fetch ...
* args
    * is request function option
* return 
    * Promise,and resolve result is a object {oid,data,options,status}
### getCache()
* return cache object
### getCacheByOids(oids)
* oids
    * type:string||number||array, is http request unique identification;
* return
    * oids is string||number return a object
    * oids is array return a array
### clearCache()
After clear cache, http request will be available
## clearCacheByOids(oids)
Clear one or more HTTP request cache
* oids
    * type:string||number||array, is http request unique identification;

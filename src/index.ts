import fetch from "node-fetch";
import { parse } from 'node-html-parser';
import { URL } from "url";
import { ThrottledAsyncCalls } from './async_throttle';


const urlsMap: {
    [name: string]: {
        [key: string]: number
    }| undefined
} = {}

async function parseUrl(_url: string, base: string) {
    return new URL(_url, base);
}

const {func: tfetch} = ThrottledAsyncCalls.wrap(fetch)
let t = 0

async function addEntryAndFetch(context:  { readonly host: string, readonly baseUrl: string}, _url: string, callBack: typeof addEntryAndFetch) {

    const url = await parseUrl(_url, context.baseUrl).catch(e => {
       
    })

    { // Sync block
        if(!url) {
            return;
        }
        
        if(url.host != context.host) {
            return;
        }



        const queryStrippedUrl = `${url.protocol}//${url.host}${url.pathname || "/"}`

        urlsMap[queryStrippedUrl] = urlsMap[queryStrippedUrl] || {}
        const search  = url.search   || '/'
        
        if(urlsMap[queryStrippedUrl]![search]) {
            urlsMap[queryStrippedUrl]![search] += 1;
            return;
        } else {
            urlsMap[queryStrippedUrl]![search]  = 1
        }

    }
    
    return tfetch(url.toString())
        .then( (e) => {
            return e.text();
        })
        .then( (e) => {
                console.log(`Fetching ${_url}`, e.substr(0, 50));
                (parse(e) as any)
                .querySelectorAll('a')
                .map((element: any) =>  element.attributes.href)
                .map((currentUrl: string)  => callBack(context, currentUrl, callBack))
            
        })
}


addEntryAndFetch({host: "medium.com", baseUrl: "https://medium.com"}, "//medium.com", addEntryAndFetch)






import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import { URL } from "url";


const urlsMap: {
    [name: string]: {
        [key: string]: number
    }| undefined
} = {}

/**
 * Function wraps error handling with promise, while parsing url
 */
async function parseUrl(_url: string, base: string) {
    return new URL(_url, base);
}

export class Crawler {

    constructor(
        private fetchFunc: typeof fetch, 
        private context: {hostName: string, baseUrl: string, startUrl: string},
        ) {
    
    }


    /***
     * @param context Accepts const context
     * @param _url String URL
     * @param callBack An async delegate (basically reference to itself - type)
     */
    async  addEntryAndFetch(_url: string) {

        const url = await parseUrl(_url, this.context.baseUrl).catch(e => {
        
        })

        { // Sync block
            if(!url) {
                return;
            }
            
            if(url.host != this.context.hostName) {
                return;
            }



            const queryStrippedUrl = `${url.protocol}//${url.host}${url.pathname || "/"}`

            urlsMap[queryStrippedUrl] = urlsMap[queryStrippedUrl] || {}
            const search  = url.search   || '<current>'
            
            if(urlsMap[queryStrippedUrl]![search]) {
                urlsMap[queryStrippedUrl]![search] += 1;
                return;
            } else {
                urlsMap[queryStrippedUrl]![search]  = 1
            }

        }
        
        return this.fetchFunc(url.toString())
            .then( (e) => {
                return e.text();
            })
            .then( (e) => {
                    console.log(`Fetching ${_url}`, e.substr(0, 50));
                    (parse(e) as any)
                    .querySelectorAll('a')
                    .map((element: any) =>  element.attributes.href)
                    .map((currentUrl: string) => this.addEntryAndFetch(currentUrl))
                
            })
    }
    start() {
       this.addEntryAndFetch(this.context.startUrl)
    }
}








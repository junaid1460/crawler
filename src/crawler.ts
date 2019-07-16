import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import { URL } from "url";

/**
 * This may become another data store if persistence is necessity
 */
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
         // A fetch like func which basically accepts url and resturns response
        private fetchFunc: (url: string) => ReturnType<typeof fetch>,
        private context: {
            hostName: string, 
            baseUrl: string, 
            startUrl: string,
            maxUrls: number, // Maximum urls to fetch
            verbose: boolean
        },
        ) {}


    /***
     * @param context Accepts const context
     * @param _url String URL
     * @param callBack An async delegate (basically reference to itself - type)
     */
    async  crawl(_url: string) {
        // Parse
        const url = await parseUrl(_url, this.context.baseUrl).catch(e => {
        
        })

        // Validation
        if(!url) {
            return;
        }
        
        if(url.host != this.context.hostName) {
            return;
        }


        // Add entry
        const queryStrippedUrl = `${url.protocol}//${url.host}${url.pathname || "/"}`

        urlsMap[queryStrippedUrl] = urlsMap[queryStrippedUrl] || {}
        const search  = url.search   || '<current>'
        

        if(urlsMap[queryStrippedUrl]![search]) {
            urlsMap[queryStrippedUrl]![search] += 1;
            return;
        } else {
            urlsMap[queryStrippedUrl]![search]  = 1
        }

        
        // Fetch
        return this.fetchFunc(url.toString())
            .then( (e) => {
                return e.text();
            })
            .then( (e) => {
                    console.log(`Duplicates: ${Object.keys(urlsMap[queryStrippedUrl]!).length}  Fetching ${_url}`, e.substr(0, 50));
                    const tasks = (parse(e) as any)
                    .querySelectorAll('a')
                    .map((element: any) =>  element.attributes.href)
                    .map((currentUrl: string) => this.crawl(currentUrl))
                    return Promise.all(tasks)
            })
    }

    start() {
       return this.crawl(this.context.startUrl)
    }
}








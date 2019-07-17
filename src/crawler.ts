import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import { URL } from "url";



/**
 * Function wraps error handling with promise, while parsing url
 */
async function parseUrl(_url: string, base: string) {
    return new URL(_url, base);
}

export const SelfToken = "<current>"

export type CrawlerSearchRef =  {
    [key: string]: number
} 
export type CrawlerResult  = {
    [name: string]:CrawlerSearchRef
} 

export class Crawler {

    /**
     * This may become another data store if persistence is necessity
     */
     urlsMap: CrawlerResult = {}

     crawlCount  = 0

    constructor(
         // A fetch like func which basically accepts url and resturns response
        private fetchFunc: (url: string) => ReturnType<typeof fetch>,
        private context: {
            hostName: string, 
            baseUrl: string, 
            startUrl: string,
            depth?: number, // Maximum urls to fetch, it doesn't mean it will exact number
            verbose?: boolean
        },
        ) {}


    /***
     * @param _url Url
     * @param depth root is 0
     */
    async  crawl(_url: string, depth: number = 0) {
        if(this.context.depth &&  depth >=  this.context.depth!) {
            return
        }
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

        this.urlsMap[queryStrippedUrl] = this.urlsMap[queryStrippedUrl] || {}
        const search  = url.search   || SelfToken
        

        if(this.urlsMap[queryStrippedUrl]![search]) {
            this.urlsMap[queryStrippedUrl]![search] += 1;
            return;
        } else {
            this.crawlCount += 1
            this.urlsMap[queryStrippedUrl]![search]  = 1
        }

        
        // Fetch
        return this.fetchFunc(url.toString())
            .then( (e) => {
                return e.text();
            })
            .then( (e) => {
                    if(this.context.verbose)
                        console.log(`Total: ${this.crawlCount} Fetching ${_url}`, e.substr(0, 50));
                    const tasks = (parse(e) as any)
                    .querySelectorAll('a')
                    .map((element: any) =>  element.attributes.href)
                    .map((currentUrl: string) => this.crawl(currentUrl, depth + 1))
                    return Promise.all(tasks)
            })
    }

    start() {
       return this.crawl(this.context.startUrl).then(e => {
           return this.urlsMap
       })
    }
}








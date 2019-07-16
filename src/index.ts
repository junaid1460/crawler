 import fetch from 'node-fetch';
import { resolve, URL } from 'url';
import { ThrottledAsyncCalls } from './async_throttle';
import { Crawler, CrawlerSearchRef, SelfToken } from './crawler';
import { Utils } from './utils';

const mediumHostName = "medium.com"
const mediumCrawler = new Crawler(
     ThrottledAsyncCalls.wrap(fetch).func,
     {
         baseUrl: `https://${mediumHostName}`,
         hostName: mediumHostName,
         startUrl: `https://${mediumHostName}`,
         maxRootUrls: 5,
         verbose: true
     }
 )

interface CrawlResult {
    url: string;
    referenceCount: number;
    queryParams: string[]
}

mediumCrawler.start().then(async (e) => {
    // Now process data
    const value: CrawlResult[] = await Promise.all(Utils.mapToArray(e).map(({key, value}) => {
        return getRefCountAndParams(key, value)
    }))
    console.log()
})



async function getRefCountAndParams(baseUrl: string, ref: CrawlerSearchRef): Promise<CrawlResult> {
    const searchParams = Utils.mapToArray(ref)
    const { value } = searchParams.reduce((p, n) => ({key: 'count', value: p.value + n.value}) )
    const queryParams = searchParams.map(e => {
        if(e.key == SelfToken) 
            return new URL(baseUrl)
        return new URL(resolve(baseUrl, e.key))
    }).map(e => {
        return Utils.getItemsFromIterable(e.searchParams.keys())
    })
    const flattened = Utils.flattenArray(queryParams)
    return {
        referenceCount: value, 
        queryParams: Utils.getUniqueEntries(flattened), 
        url: baseUrl 
    }
}

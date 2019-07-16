 import fetch from 'node-fetch';
import { ThrottledAsyncCalls } from './async_throttle';
import { Crawler } from './crawler';

const mediumHostName = "medium.com"
const mediumCrawler = new Crawler(
     ThrottledAsyncCalls.wrap(fetch).func,
     {
         baseUrl: `https://${mediumHostName}`,
         hostName: mediumHostName,
         startUrl: `https://${mediumHostName}`,
         maxRootUrls: 10,
         verbose: true
     }
 )

mediumCrawler.start().then( (e: any) => {
    // Now process data

})


function mapToArray<T>(map: {[name: string]: T}): Array<{key: string, value: T}> {
    return Object.keys(map).map(key  => {
        return {
            key: key,
            value: map[key]
        }
    })
}
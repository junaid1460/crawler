# Simple crawler
<span class="badge-npmversion"><a href="https://www.npmjs.com/package/@junaid1460/crawler" title="View this project on NPM"><img src="https://img.shields.io/npm/v/@junaid1460/crawler.svg" alt="NPM version" /></a></span>
Crawls hyperlink from provided base url
Features
 - Generic
 - Custom depth
 - Handled DOS by limited calls (check below how it's done)

Example:
```typescript
 import fetch from 'node-fetch';
import { ThrottledAsyncCalls } from './async_throttle';
import { Crawler } from './crawler';

const mediumHostName = "medium.com"
const mediumCrawler = new Crawler(
     ThrottledAsyncCalls.wrap({
         concurrency:  5,
         func: fetch
     }).func,
     {
         baseUrl: `https://${mediumHostName}`,
         hostName: mediumHostName,
         startUrl: `https://${mediumHostName}`,
         depth: 3,
         verbose: true
     }
 )
mediumCrawler.start().then(async (e) => {
    // Now process data
    // play with it
})  
```

The repo contains also a simple wrapper to limit call concurreny to specified number.
It doesn't matter which function you are wrapping
  - Limits concurreny
  - No ugly wrappers, neat code
  - Treat it like your `async` function and do `.then`,  everything is handled.

Example
```typescript

import { ThrottledAsyncCalls } from '../src/async_throttle';

async function  test(x: number) {
  return x + 1
}

// Simple, yet powerful
const {func: func, object: boundObject} = ThrottledAsyncCalls.wrap({
    concurrency:  4,  // Max concurrent calls 
    func: test // function to wrap
})


// Call it like below

 function start(index) {
    return Promise.all([
     func(0).then(e => console.log(index)),
     func(0),
     func(0),
     func(0),
     func(0),
     func(0),
     func(0),
     func(0),
     func(0).then(e => console.log(index))
    ])
}

start(1).then(async e => {
    console.log("After all tasks done executing", e)
})

```

# License
MIT
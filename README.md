# Simple crawler
Crawls hyperlink from provided base url

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

Example
```typescript

import { ThrottledAsyncCalls } from '../src/async_throttle';

async function  test(x: number) {
  return x + 1
}

// Simple and powerfiul
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
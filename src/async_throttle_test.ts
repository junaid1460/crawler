import { ThrottledAsyncCalls } from './async_throttle';


 async function  test  ( x: number) {
  return x
}
const func = ThrottledAsyncCalls.wrap(test)




 function start(index: number) {
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

async function myTest() {
    await Promise.all(new Array(10000).fill(0).map((e, index) =>  start(index))).then(e =>  {
        console.log(func)
    })
}

myTest()
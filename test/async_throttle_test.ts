import { ThrottledAsyncCalls } from '../src/async_throttle';


 async function  test  ( x: number) {
  return x
}
const {func: func, object: boundObject} = ThrottledAsyncCalls.wrap(test)




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
    await Promise.all(new Array(10000).fill(0).map((e, index) =>  start(index))).then(async e =>  {
        if(boundObject.size != 0) {
            return Promise.reject("Did not execute everything from queue")
        }
    })
}

myTest()
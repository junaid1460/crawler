import { ThrottledAsyncCalls } from '../src/async_throttle';


function t2() {
    return new Promise((resolve, _)=> {
        throw new Error("")
    })
}

async function  test(x: number) {
    if(x%2 == 1) {
        return  t2().then(async e => {
            return x;
        })
    }
    return x
}
const {func: func, object: boundObject} = ThrottledAsyncCalls.wrap({
    concurrency:  2,
    func: test
})




 function start() {
    return Promise.all(new Array(100).fill(0).map((v, i) => func(i).then(e => {
        console.log(e)
    }).catch(err =>  console.log("error", i))))
}

async function myTest() {
    await start().then(async e => {
        // console.log(e)
        if(boundObject.size != 0) {
            return Promise.reject("Did not execute everything from queue")
        }
    })
}

myTest()
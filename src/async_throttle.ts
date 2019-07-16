interface ThrottlerOptions<T> {
    concurrency: number,
    func: T,
}

/**
 * Class wraps any function and throttles call to N at a time
 */
export class ThrottledAsyncCalls<T extends (...args: any) => F, G, F extends Promise<G> = ReturnType<T>,> {
    private active: boolean = false;


    /**
     * This data store may go as redis or SQS or any other
     * if planning crawl from multiple instances / state maintainance
     * which would eventually make this class a task runner like celery
     */
    private queue: (()  => any)[] = []
    get size () {
        return this.queue.length
    }
    constructor(private options:ThrottlerOptions<T> ){}
    call(...args: Parameters<T>) {
        const closurev = new Promise<G>((resolve, reject)=> {
            const func =  () =>  this.options.func(...(args as any)).then(response => resolve(response)).catch(err => reject(err))
            this.queue.push(func)
            if(!this.active) {
                this.active = true;
                this.exec()
            }
        })
        return  closurev as F
    }

    private async exec() {
        if(this.queue.length == 0) {
            this.active = false
            return;
        }
        const tasks = this.queue.splice(0, 5).map(task => task())
        await Promise.all(tasks)
        this.exec()
    }

    static wrap< T extends (...args: any) => any>(opt: ThrottlerOptions<T> ) {
        const obj = new ThrottledAsyncCalls(opt)
        const newFunc =obj.call
        return { func: newFunc.bind(obj) as typeof newFunc, object: obj}
    }
}
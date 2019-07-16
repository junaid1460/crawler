export class ThrottledAsyncCalls<T extends (...args: any) => F, G, F extends Promise<G> = ReturnType<T>,> {
    private active: boolean = false;
    private queue: (()  => any)[] = []
    constructor(private func: T){}
    call(...args: Parameters<T>) {
        const closurev = new Promise<G>((resolve, reject)=> {
            const func =  () =>  this.func(...(args as any)).then(response => resolve(response)).catch(err => reject(err))
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

    static wrap< T extends (...args: any) => any>(func: T) {
        const obj = new ThrottledAsyncCalls(func)
        const newFunc =obj.call
        return newFunc.bind(obj) as typeof newFunc
    }
}
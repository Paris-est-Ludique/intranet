const CACHE_RENEW_DELAY = 10000

export default function DBManager<OperationReturn>(): any {
    type OperationType = "add" | "list" | "set"

    interface Operation {
        task: () => Promise<OperationReturn>
        type: OperationType
        resolve: (value: OperationReturn) => void
        reject: (reason: unknown) => void
    }

    let cache: any
    let cacheTime = 0

    const operations: Operation[] = []

    async function addDBOperation(type: OperationType, task: () => Promise<OperationReturn>) {
        console.log(`New ${type} DB Operation in line.`)
        return new Promise(
            (resolve: (value: OperationReturn) => void, reject: (reason: unknown) => void) => {
                operations.push({ task, type, resolve, reject })
                if (operations.length === 1) {
                    runOperation(operations[0])
                }
            }
        )
    }

    function runNextDBOperation(): void {
        operations.shift()
        console.log("DB Operation completed.")
        if (operations[0]) {
            runOperation(operations[0])
        }
    }

    function runOperation(operation: Operation): void {
        const { task, type, resolve, reject } = operation
        if (type === "list") {
            const now = +new Date()
            if (now < cacheTime + CACHE_RENEW_DELAY) {
                console.log("Using cache")
                resolve(cache)
                runNextDBOperation()
            } else {
                console.log("Refreshing cache")
                task()
                    .then((val: OperationReturn) => {
                        cache = val
                        cacheTime = now
                        resolve(val)
                    })
                    .catch(reject)
                    .finally(runNextDBOperation)
            }
        } else {
            cacheTime = 0
            task().then(resolve).catch(reject).finally(runNextDBOperation)
        }
    }

    return addDBOperation
}

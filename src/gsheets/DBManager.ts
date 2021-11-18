const CACHE_RENEW_DELAY = 10000

const cache: { [sheetName: string]: any } = {}
const cacheTime: { [sheetName: string]: number } = {}

export default function DBManager<OperationReturn>(sheetName: string): any {
    type OperationType = "add" | "list" | "set"

    cacheTime[sheetName] = 0

    interface Operation {
        task: () => Promise<OperationReturn>
        type: OperationType
        resolve: (value: OperationReturn) => void
        reject: (reason: unknown) => void
    }

    const operations: Operation[] = []

    async function addDBOperation(type: OperationType, task: () => Promise<OperationReturn>) {
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
        if (operations[0]) {
            runOperation(operations[0])
        }
    }

    function runOperation(operation: Operation): void {
        const { task, type, resolve, reject } = operation
        if (type === "list") {
            const now = +new Date()
            if (now < cacheTime[sheetName] + CACHE_RENEW_DELAY) {
                resolve(cache[sheetName])
                runNextDBOperation()
            } else {
                task()
                    .then((val: OperationReturn) => {
                        cache[sheetName] = val
                        cacheTime[sheetName] = now
                        resolve(val)
                    })
                    .catch(reject)
                    .finally(runNextDBOperation)
            }
        } else {
            cacheTime[sheetName] = 0
            task().then(resolve).catch(reject).finally(runNextDBOperation)
        }
    }

    return addDBOperation
}

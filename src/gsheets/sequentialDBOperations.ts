export default function sequentialDBOperations<OperationReturn>(): any {
    interface Operation {
        task: () => Promise<OperationReturn>
        resolve: (value: OperationReturn) => void
        reject: (reason: unknown) => void
    }

    const operations: Operation[] = []

    async function addDBOperation(task: () => Promise<OperationReturn>) {
        return new Promise(
            (resolve: (value: OperationReturn) => void, reject: (reason: unknown) => void) => {
                operations.push({ task, resolve, reject })
                if (operations.length === 1) {
                    task().then(resolve).catch(reject).finally(runNextDBOperation)
                }
            }
        )
    }

    function runNextDBOperation(): void {
        operations.shift()
        if (operations[0]) {
            const { task, resolve, reject } = operations[0]
            task().then(resolve).catch(reject).finally(runNextDBOperation)
        }
    }

    return addDBOperation
}

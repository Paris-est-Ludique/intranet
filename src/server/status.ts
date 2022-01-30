const messages: string[][] = []
let _messageCount = 0

export function addStatus(...messageParams: string[]): void {
    messages.push(messageParams)
    if (messages.length === _messageCount) {
        showStatus()
    } else if (messages.length > _messageCount) {
        console.error(...messageParams)
    }
}

function showStatus(): void {
    console.error("")
    messages.forEach((messageParams) => console.error(...messageParams))
}

export function showStatusAt(messageCount: number): void {
    _messageCount = messageCount
}

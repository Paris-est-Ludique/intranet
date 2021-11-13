export interface StateRequest {
    readyStatus: "idle" | "request" | "success" | "failure"
    error?: string
}

interface YadioRequest {
    amount: number
    from: string
    to: string
}

export interface ApiYadio {
    request: YadioRequest
    result: number
    rate: number
    timestamp: number
    error?: string
}
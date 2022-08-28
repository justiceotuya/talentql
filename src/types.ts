interface ResultResponse {
    results: {
        [key: number]: TResultData[],
        paging: TPaging
    }[]
}
type TResultData = {
    id: string,
    row: number,
    age: number,
    gender: string
}
type TpaginationData = Record<number, TResultData[]>
type TPaging = {
    next: string,
    previous?: string
}

export {
    ResultResponse,
    TResultData,
    TpaginationData,
}

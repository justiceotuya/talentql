import {
    ResultResponse,
    TResultData,
    TpaginationData,
} from './types'


const startApp = async () => {

    let currentPage = 1;
    let tableData: TResultData[] = [];
    let dataStore: TpaginationData = {}
    let status: "LOADING" | "DATA" | "ERROR" | "IDLE" = "IDLE"



    async function fetchData(page: number): Promise<ResultResponse> {

        status = "LOADING"
        renderData()
        let url = `https://randomapi.com/api/8csrgnjw?key=LEIX-GF3O-AG7I-6J84&page=${page}`
        const response = await fetch(url);
        if (!response.ok) {
            status = "ERROR"
            renderData()
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }
        status = "DATA"
        const result = await response.json();
        return result;
    }


    async function getData(page: number): Promise<void> {
        //return the data from cache
        if (dataStore[page]) {
            tableData = dataStore[page]
            currentPage = page
            renderData()
        } else {
            fetchData(page).then(data => {
                //the api result returns the page number and page number + 1 as keys, we would like to cache it so that we dont make such round trip again
                const { paging, ...restData } = data.results[0]
                dataStore = { ...dataStore, ...restData }
                tableData = dataStore[page]
                currentPage = page
                renderData()
            });
        }
    }

    const renderData = () => {
        let newHtml
        let btnGroupEl: HTMLElement | null = document.querySelector(".btn-group")

        if (status == "DATA") {
            newHtml = tableData.map(data => {
                const { row, age, gender } = data
                return `
        <tr>
        <td>${row}</td>
        <td>${age}</td>
        <td>${gender}</td>
        </tr>
        `
            })
            if (btnGroupEl) btnGroupEl.style.visibility = "visible"

            if (pageView && dataSink) {
                pageView.textContent = `page ${currentPage}`
                dataSink.innerHTML = newHtml.join("").toString()
            }

            if (currentPage === 1) {
                previousButton.disabled = true
                return
            } else {
                previousButton.disabled = false
            }
        }

        if (status === "ERROR" && dataSink) {
            newHtml = `
            <p>Error getting data</p>
            <button id="retryBtn">retry</button>
            `
            dataSink.innerHTML = newHtml.toString()
            const retryBtn: HTMLButtonElement | null = document.querySelector("#retryBtn")
            retryBtn?.addEventListener("click", () => {
                getData(currentPage)
            });

        }

        if (status === "LOADING" && dataSink) {
            newHtml = `
            <p>Loading ...</p>
            `
            dataSink.innerHTML = newHtml.toString()
            if (btnGroupEl) btnGroupEl.style.visibility = "hidden"
        }
    }


    const goToNextPage = () => {
        getData(currentPage + 1)
    }

    const goToPreviousPage = () => {
        getData(currentPage - 1)
    }


    // let pageView = document.querySelector('[data-pageview]')
    let dataSink = document.querySelector('[ data-sink]')
    let btnGroup = document.querySelectorAll(".btn-group")

    const [previous, next, pageView] = btnGroup[0].children
    const previousButton = previous as HTMLButtonElement
    const nextButton = next as HTMLButtonElement

    previousButton.addEventListener("click", goToPreviousPage)
    nextButton.addEventListener("click", goToNextPage)

    getData(currentPage)
};

document.addEventListener('DOMContentLoaded', startApp);

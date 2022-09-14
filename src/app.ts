interface ResultResponse {
      results: {
            [key: number]: TResultData[];
            paging?: TPaging;
      }[];
}
type TResultData = {
      id: string;
      row: number;
      age: number;
      gender: string;
};
type TpaginationData = Record<number, TResultData[]>
type TPaging = {
      next: string;
      previous?: string;
};



let currentPage = 1;
let tableData: TResultData[] = [];
let dataStore: TpaginationData = {};
let loadStatus: "LOADING" | "DATA" | "ERROR" | "IDLE" = "IDLE";
let nextData: TResultData[]

let dataSink: HTMLTableColElement | null = document.querySelector('[ data-sink]');
let dataLoading: HTMLParagraphElement | null = document.querySelector('[ data-loading]');
let btnGroup = document.querySelectorAll(".btn-group");
let btnGroupEl: HTMLElement | null = document.querySelector(".btn-group");

async function fetchData(page: number): Promise<ResultResponse> {

      loadStatus = "LOADING";
      renderData();
      let url = `https://randomapi.com/api/8csrgnjw?key=LEIX-GF3O-AG7I-6J84&page=${page}`
      const response = await fetch(url);
      if (!response.ok) {
            loadStatus = "ERROR"
            renderData()
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
      }
      loadStatus = "DATA"
      const result = await response.json();
      return result;
}


async function getData(page: number): Promise<void> {
      //return the data from cache
      if (currentPage % 2 !== 0 && !!tableData.length) {
            tableData = nextData
            nextData = {}
            currentPage++
            renderData()
      } else {
            fetchData(page).then(data => {
                  //the api result returns the page number and page number + 1 as keys, we would like to cache it so that we dont make such round trip again
                  delete data?.results[0]?.paging
                  let result = Object.values(data?.results[0])

                  tableData = result[0]
                  nextData = result[1]
                  currentPage !== 1 && currentPage++
                  renderData()
            });
      }
}

const renderData = () => {
      let newHtml


      if (loadStatus == "DATA") {
            newHtml = tableData.map(data => {
                  const { id, row, age, gender } = data
                  return `
        <tr data-entryid="${id}">
        <td>${row}</td>
        <td>${age}</td>
        <td>${gender}</td>
        </tr>
        `
            })
            if (dataLoading) dataLoading.style.visibility = "hidden"

            if (pageView && dataSink) {
                  pageView.textContent = `Showing Page ${currentPage}`
                  dataSink.innerHTML = newHtml.join("").toString()
            }

            if (currentPage === 1) {
                  previousButton.disabled = true
                  return
            } else {
                  previousButton.disabled = false
            }
      }

      if (loadStatus === "ERROR" && dataSink) {
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

      if (loadStatus === "LOADING" && dataLoading) {
            dataLoading.style.visibility = "visible"
      }
}


const goToNextPage = () => {
      getData(currentPage + 1)
}

const goToPreviousPage = () => {
      getData(currentPage - 1)
}



const [previous, next, pageView] = btnGroup[0].children
const previousButton = previous as HTMLButtonElement
const nextButton = next as HTMLButtonElement

previousButton.addEventListener("click", goToPreviousPage)
nextButton.addEventListener("click", goToNextPage)

getData(currentPage)
const startApp = async () => {
};

document.addEventListener('DOMContentLoaded', startApp);

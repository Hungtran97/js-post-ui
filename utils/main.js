import postApi from "../js/postApi.js"

async function main () {
    const queryParam = {
        _page: 1,
        _limit: 10,
    }
    const response = await postApi.getAll()
    console.log(response)
}
 main()
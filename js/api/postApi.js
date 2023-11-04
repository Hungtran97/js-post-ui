import axiosClient from "./axiosClient.js"

const postApi = {
    getAll(params) {
        const url = '/posts'
        return axiosClient.get(url, {params})
    },
    getById(id) {
        const url = `/post/${id}`
        return axiosClient.get(url)
    },
    add(data) {
        const url = '/posts'
        return axiosClient.get(url, data)
    },
    update(data) {
        const url = `/post/${data.id}`
        return axiosClient.patch(url, data)
    },
    remove(id) {
        const url = `/post/${id}`
        return axiosClient.delete(url)
    },

}
export default postApi
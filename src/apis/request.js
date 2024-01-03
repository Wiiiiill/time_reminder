import axios from "axios";

const requester = axios.create({
    timeout: 66000, // 单位：毫秒
    headers: {
        "current-version": "1.1.00",
        "Content-Type": "application/json;charset=UTF-8",
        "Cache-Control": "no-cache"
    }
})

requester.interceptors.request.use((config) => {
    console.log('req config', config)
    const token = sessionStorage.getItem("token");
    if (token) {
        config.headers.common["Authorization"] = "Bearer " + token;
    }
    return config
}, (error) => {
    console.error('req error', error)
    return Promise.reject(error);
});

requester.interceptors.response.use((resp) => {
    console.log('resp', resp)
    return resp.data
}, (error) => {
    console.error('resp error', error)
    return Promise.reject(error);
})

export const modulePath = (path, test = false) => {
    return (process.env.NODE_ENV === "development" ? test ? "/db" : "/api" : "") + path
}
export default requester
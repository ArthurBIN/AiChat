import axios from "axios";

const myaxios = axios.create({
    baseURL: 'http://192.168.4.1:5010',
    withCredentials: true
})

export default myaxios

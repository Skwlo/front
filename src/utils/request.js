import axios from 'axios';
import router from "@/router";
import { serverIp } from "../../public/config";

const request = axios.create({
    baseURL: `http://${serverIp}:9090`,
    timeout: 30000
})

// request 拦截器
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';

    // 读取用户信息
    let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

    // 如果存在用户信息且token有效，设置token
    if (user && user.token) {
        config.headers['token'] = user.token; // 设置请求头的token
    }

    return config;
}, error => {
    return Promise.reject(error);
});

// response 拦截器
request.interceptors.response.use(
    response => {
        let res = response.data;

        // 如果是返回的文件
        if (response.config.responseType === 'blob') {
            return res;
        }

        // 兼容服务端返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res;
        }

        // 当权限验证不通过时跳转到登录页面
        // if (res.code === '401') {
        //     router.push("/login");
        // }
        return res;
    },
    error => {
        console.log('err' + error); // for debug
        return Promise.reject(error);
    }
);

export default request;

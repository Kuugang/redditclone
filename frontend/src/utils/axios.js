import axios from "axios";
import { BACKEND_URL } from "./constants";

export const axiosReq = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
});

axiosReq.interceptors.request.use(
    (config) => {
        config.headers["authorization"] = `Bearer ${JSON.parse(
            localStorage.getItem("token")
        )}`;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
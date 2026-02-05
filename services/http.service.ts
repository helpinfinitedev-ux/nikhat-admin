import axios from "axios";
import { toast } from "sonner";

const { CancelToken } = axios;

let source = CancelToken.source();

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

axios.interceptors.request.use(
  (config) => ({ ...config, cancelToken: source.token }),
  (error) => Promise.reject(error)
);
axios.interceptors.response.use(
  (res) => {
    const { message } = res.data;
    toast.success(message || "Fetch successful");

    return res;
  },
  (err) => {
    const { message: msg, response } = err;
    const message = response?.data?.message;
    if (!response) throw err;

    const code = response.data.statusCode;

    if (code === 401 || message === "Session has expired" || message === "Unauthorized Access") {
      source.cancel(message);

      setTimeout(() => {
        source = CancelToken.source();

        if (window.location.pathname !== "/") window.location.assign("/");
      }, 300);
    }

    throw err;
  }
);
const http = {
  get: axios.get,
  put: axios.put,
  post: axios.post,
  patch: axios.patch,
  delete: axios.delete,
  setJWT: () => {
    axios.defaults.headers.common.Authorization = "Bearer " + localStorage.getItem("adminToken") || "";
  },
  setMultiPart: () => ({ headers: { "Content-Type": "multipart/form-data" } }),
};

export default http;

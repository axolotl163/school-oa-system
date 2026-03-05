import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use(
  (config) => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const classId = localStorage.getItem("class_id");
    if (username) {
      config.headers["X-Username"] = encodeURIComponent(username);
    }
    if (role) {
      config.headers["X-User-Role"] = encodeURIComponent(role);
    }
    if (classId) {
      config.headers["X-Class-Id"] = encodeURIComponent(classId);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("isLogin");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
    if (error.response?.status === 403) {
      alert("权限不足，无法执行此操作");
    }
    return Promise.reject(error);
  }
);

export default api;

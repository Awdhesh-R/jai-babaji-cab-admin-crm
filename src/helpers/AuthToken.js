export const authToken = localStorage.getItem("token");

export const isAuth = authToken ? true : false;
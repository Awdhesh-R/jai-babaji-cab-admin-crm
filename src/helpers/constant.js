require('dotenv').config();
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const constant = {
    AUTHAPI: {
        POSTURL: {
            adminLogin: baseUrl + "/rbac/login",
        }
    },
    DASHBOARDAPI: {
        GETURL: {
            adminUserDetail: baseUrl + "/rbac",
        },
    }
};

export default constant;

export const ACTIVE_RIDE_STATUSES = [
    "confirmed",
    "assigned",
    "arrived",
    "started",
    "completed",
];

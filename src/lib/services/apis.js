const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

//@/lib/services/apis
export const authEndpoints = {
    LOGIN_API: BACKEND_URL + '/auth/login'
}
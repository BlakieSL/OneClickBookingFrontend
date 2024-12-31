import {isUserAdmin, isUserLoggedIn} from "../helpers/tokenUtils.js";
import {Navigate} from "react-router-dom";

export const PrivateAdminRoute = ({ element: Element }) =>
    (isUserLoggedIn() && isUserAdmin()) ? Element : <Navigate to='/login' />;
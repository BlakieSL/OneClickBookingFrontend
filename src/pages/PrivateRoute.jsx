import {isUserLoggedIn} from "../helpers/tokenUtils.js";
import {Navigate} from "react-router-dom";

export const PrivateRoute = ({ element: Element }) =>
    isUserLoggedIn() ? Element : <Navigate to='/login' />;
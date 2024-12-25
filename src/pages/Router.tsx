import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Registration from "./pages/Registration";
import Login from "./pages/Login";

const router = createBrowserRouter([
    { path: '/registration', element: <Registration /> },
    { path: '/login', element: <Login /> },
]);

export function Router() {
    return <RouterProvider router={router} />;
}
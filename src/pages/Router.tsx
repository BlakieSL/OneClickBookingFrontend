import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import ServicePoints from "./pages/ServicePoints";
import {PrivateRoute} from "./PrivateRoute";

const router = createBrowserRouter([
    { path: '/registration', element: <Registration /> },
    { path: '/login', element: <Login /> },
    { path: '/service-points', element: <PrivateRoute element={<ServicePoints />} /> }
]);

export function Router() {
    return <RouterProvider router={router} />;
}
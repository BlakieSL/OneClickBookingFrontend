import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Registration from "./pages/registration/Registration";
import Login from "./pages/login/Login";
import ServicePoints from "./pages/servicePoints/ServicePoints";
import {PrivateRoute} from "./PrivateRoute";
import ServicePoint from "./pages/servicePoint/ServicePoint";
import Employee from "./pages/employee/Employee";

const router = createBrowserRouter([
    { path: '/registration', element: <Registration /> },
    { path: '/login', element: <Login /> },
    { path: '/service-points', element: <PrivateRoute element={<ServicePoints />} /> },
    { path: '/service-points/:id', element: <PrivateRoute element={<ServicePoint />} /> },
    { path: '/service-points/:id/employees/:employeeId', element: <PrivateRoute element={<Employee />} /> }
]);

export function Router() {
    return <RouterProvider router={router} />;
}
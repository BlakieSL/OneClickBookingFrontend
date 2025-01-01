import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Registration from "./pages/registration/Registration";
import Login from "./pages/login/Login";
import ServicePoints from "./pages/servicePoints/ServicePoints";
import {PrivateRoute} from "./PrivateRoute";
import ServicePoint from "./pages/servicePoint/ServicePoint";
import Employee from "./pages/employee/Employee";
import User from "./pages/user/User";
import Navigation from "./pages/navigation/Navigation";
import Employees from "./pages/employees/Employees";
import AdminUsers from "./pages/adminUsers/AdminUsers";
import {PrivateAdminRoute} from "./PrivateAdminRoute";
import AdminReviews from "./pages/adminReviews/AdminReviews";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigation />,
        children: [
            { path: '/service-points', element: <PrivateRoute element={<ServicePoints />} /> },
            { path: '/service-points/:id', element: <PrivateRoute element={<ServicePoint />} /> },
            { path: '/service-points/:id/employees/:employeeId', element: <PrivateRoute element={<Employee />} /> },
            { path: '/employees', element: <PrivateRoute element={<Employees /> } /> },
            { path: '/employees/:employeeId', element: <PrivateRoute element={<Employee />} /> },
            { path: '/user', element: <PrivateRoute element={<User /> } /> },
            { path: '/admin-users', element: <PrivateAdminRoute element={<AdminUsers /> } /> },
            { path: '/admin-reviews', element: <PrivateAdminRoute element={<AdminReviews /> }/> }
        ]
    },
    { path: '/registration', element: <Registration /> },
    { path: '/login', element: <Login /> },
]);

export function Router() {
    return <RouterProvider router={router} />;
}
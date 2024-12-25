import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Registration from "./Registration";

const router = createBrowserRouter([
    { path: '/registration', element: <Registration /> },
]);

export function Router() {
    return <RouterProvider router={router} />;
}
import { createBrowserRouter } from "react-router";
import Layout from "../layouts/layout.tsx";
import Home from "../pages/Home.tsx";
import Register from "../pages/auth/register.tsx";
import Stories from "../pages/Category/stories/stories.tsx";
import MyAccount from "../pages/auth/myaccount.tsx";
import ProfileEdit from "../pages/auth/profileEdit.tsx";
import ProductListPage from "../pages/Category/ProductListPage.tsx";
import Dashboard from "../pages/Admin/Dashboard.tsx";
import UserManager from "../pages/Admin/UserManager.tsx";
import ProductEdit from "../pages/Admin/ProductEdit.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            /*계정*/
            { path: "register", element: <Register /> },
            { path: "myaccount", element: <MyAccount /> },
            { path: "myaccount/ProfileEdit", element: <ProfileEdit /> },
            /*카테고리*/
            { path: "category/:category/:id", element: <ProductListPage /> },
            { path: "stories", element: <Stories /> },
        ]
    },
    /* 관리용 */
    {
        path: "/admin",
        children: [
            { index: true, element: <Dashboard /> }, 
            { path: "user", element: <UserManager /> },
            { path: "ProductEdit", element: <ProductEdit />}
        ]
    }
]);

export default router;
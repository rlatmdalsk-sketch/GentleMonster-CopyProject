import {createBrowserRouter} from "react-router";
import Layout from "../layouts/layout.tsx";
import Home from "../pages/Home.tsx";
import Register from "../pages/auth/register.tsx";
import C2026Sunglasses from "../pages/Category/sunglasses/2026-collection.tsx";
import CF2025Sunglasses from "../pages/Category/sunglasses/2025-fall-collection.tsx";
import CB2025Sunglasses from "../pages/Category/sunglasses/2025-bold-collection.tsx";
import PocketSunglasses from "../pages/Category/sunglasses/pocket-collection.tsx";
import BestSunglasses from "../pages/Category/sunglasses/bestsellers.tsx";
import TintedSunglasses from "../pages/Category/sunglasses/tinted-lenses.tsx";
import Stories from "../pages/Category/stories/stories.tsx";
import MyAccount from "../pages/auth/myaccount.tsx";
import ProfileEdit from "../pages/auth/profileEdit.tsx";



const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {index: true, element: <Home />}, /*메인홈*/
            { path: "/register", element: <Register />},
            { path: "/myaccount", element: <MyAccount />},
            { path: "/myaccount/ProfileEdit", element: <ProfileEdit />},

            /* 선글라스 카테고리 */
            { path: "category/sunglasses/2026-collection", element: <C2026Sunglasses /> },
            { path: "category/sunglasses/2025-fall-collection", element: <CF2025Sunglasses /> },
            { path: "category/sunglasses/2025-bold-collection", element: <CB2025Sunglasses /> },
            { path: "category/sunglasses/pocket-collection", element: <PocketSunglasses /> },
            { path: "category/sunglasses/bestsellers", element: <BestSunglasses /> },
            { path: "category/sunglasses/tinted-lenses", element: <TintedSunglasses /> },

            /*stoires 카테고리*/

            { path: "/stories", element: <Stories /> },

        ]

    }
])

export default router;
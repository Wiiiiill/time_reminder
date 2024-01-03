import { Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Login from "@/layout/Login";

const lazyLoad = (moduleName) => {
    const Module = lazy(() => {
        return import(`../pages/${moduleName}.jsx`)
    })
    return <Suspense><Module Test={Math.random()} /></Suspense>
}
const Appraisal = ({ children }) => {
    const token = sessionStorage.getItem('token')
    return token || true ? children : <Navigate to="/login" />;
}
export const defaultRoutes = [
    { path: "/", element: <Navigate to="/login" /> },
    { path: "/login", element: <Login /> },]
export const extra = [
    { path: "/about", element: <Appraisal>{lazyLoad("About")}</Appraisal> },
    {
        path: "/home",
        element: <Appraisal>{lazyLoad("Home")}</Appraisal>,
        children: [
            { path: "news", element: lazyLoad("News") },
            { path: "message", element: lazyLoad("Message"), children: [{ path: "detail", element: lazyLoad("Detail") }] },
        ],
    },
];

import React from "react";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import LoginSignup from "../User/LoginSignup/LoginSignup";

const ProtectedRoute = () => {
    const { loading, isAuthenticated } = useSelector((state) => state.user);

    return (
        <>
            {" "}
            {loading === false &&
                (isAuthenticated ? <Outlet /> : <LoginSignup />)}
        </>
    );
};
const AdminRoute = () => {
    const { loading, isAuthenticated, user } = useSelector(
        (state) => state.user
    );

    return (
        <>
            {" "}
            {loading === false &&
                (isAuthenticated && user.role === "admin" ? (
                    <Outlet />
                ) : (
                    <LoginSignup />
                ))}
        </>
    );
};
export { AdminRoute };
export default ProtectedRoute;

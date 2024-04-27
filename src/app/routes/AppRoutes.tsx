import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "../layout/MainLayout";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={ <MainLayout/> } />
            <Route path="/*" element={ <Navigate to='/' /> } />
        </Routes>
    );
};
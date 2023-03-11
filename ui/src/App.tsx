import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LogoutPage from "./pages/LogoutPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";

const App: React.FC = () => {
    //console.log = console.warn = console.error = () => {};

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/signup" element={<SignupPage />}></Route>
            <Route path="/logout" element={<LogoutPage />}></Route>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/password/reset" element={<LoginPage />}></Route>
            <Route path="/profile/:id" element={<ProfilePage />}></Route>
        </Routes>
    );
};

export default App;

import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LogoutPage from "./pages/LogoutPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import PayPage from "./pages/PayPage";
import OrdersListPage from "./pages/OrdersListPage";
import OrderPage from "./pages/OrderPage";
import ForgottenPasswordPage from "./pages/ForgottenPasswordPage";
import PasswordResetPage from "./pages/PasswordResetPage";
import ConversationPage from "./pages/ConversationPage";

const App: React.FC = () => {
    //console.log = console.warn = console.error = () => {};

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/signup" element={<SignupPage />}></Route>
            <Route path="/logout" element={<LogoutPage />}></Route>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/password/reset" element={<ForgottenPasswordPage />}></Route>
            <Route path="/password/reset/:hash" element={<PasswordResetPage />}></Route>
            <Route path="/profile/:id" element={<ProfilePage />}></Route>
            <Route path="/product/:id" element={<ProductPage />}></Route>
            <Route path="/checkout/" element={<CheckoutPage />}></Route>
            <Route path="/pay/:id" element={<PayPage />}></Route>
            <Route path="/orders/" element={<OrdersListPage />}></Route>
            <Route path="/order/:id" element={<OrderPage />}></Route>
            <Route path="/message/:id" element={<ConversationPage />}></Route>
        </Routes>
    );
};

export default App;

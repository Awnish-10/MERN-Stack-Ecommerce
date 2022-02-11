import "./App.css";
import Header from "./component/layout/Header/Header.js";
import UserOptions from "./component/layout/Header/UserOptions.js";
import Home from "./component/Home/Home.js";
import Footer from "./component/layout/Footer/Footer.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Products/Products.js";
import Search from "./component/Search/Search.js";
import LoginSignup from "./component/User/LoginSignup/LoginSignup.js";
import Profile from "./component/User/Profile";
import ProtectedRoute, {
    AdminRoute,
} from "./component/Route/ProtectedRoute.js";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirnOrder from "./component/Cart/ConfirnOrder.js";
import Payment from "./component/Cart/Payent.js";
import OrderSuccess from "./component/Cart/OrderSuccess.js";
import MyOrders from "./component/Order/MyOrders.js";
import OrderDetails from "./component/Order/OrderDetails.js";
import Dashboard from "./component/Admin/Dashboard.js";
import AllProductsList from "./component/Admin/AllProductsList.js";
import NewProduct from "./component/Admin/NewProduct.js";
import UpdateProduct from "./component/Admin/UpdateProduct.js";
import OrderList from "./component/Admin/OrderList.js";
import ProcessOrder from "./component/Admin/ProcessOrder.js";
import UsersList from "./component/Admin/UsersList.js";
import UpdateUser from "./component/Admin/UpdateUser.js";
import ProductReviews from "./component/Admin/ProductReviews.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import WebFont from "webfontloader";
import store from "./store";
import { clearErrors, loadUser } from "./actions/userAction";
import { useSelector } from "react-redux";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import NotFound from "./component/layout/NotFound/NotFound";
import About from "./component/layout/About/About";
import Contact from "./component/layout/Contact/Contact.js";

function App() {
    const { isAuthenticated, user, error } = useSelector((state) => state.user);
    const [stripeApiKey, setStripeApiKey] = useState("");
    // console.log("err in app", error);

    async function getStripeApiKey() {
        const { data } = await axios.get("/api/v1/stripeapikey");

        setStripeApiKey(data.stripeApiKey);
    }
    useEffect(() => {
        store.dispatch(loadUser());

        WebFont.load({
            google: {
                families: ["Roboto", "Droid Sans", "Chilanka"],
            },
        });
        getStripeApiKey();
    }, []);
    useEffect(() => {
        if (error) {
            store.dispatch(clearErrors());
        }
    }, [error]);
    // window.addEventListener("contextmenu", (e) => e.preventDefault());
    return (
        <>
            <Router>
                {isAuthenticated && <UserOptions user={user} />}
                <Header />
                <Routes>
                    <Route exact path="/about" element={<About />} />
                    <Route exact path="/contact" element={<Contact />} />
                    <Route exact path="/" element={<Home />} />
                    <Route
                        exact
                        path="/product/:id"
                        element={<ProductDetails />}
                    />
                    <Route exact path="/products" element={<Products />} />
                    <Route path="/products/:keyword" element={<Products />} />
                    <Route exact path="/search" element={<Search />} />
                    <Route exact path="/login" element={<LoginSignup />} />
                    <Route
                        exact
                        path="/password/forgot"
                        element={<ForgotPassword />}
                    />
                    <Route exact path="/cart" element={<Cart />} />
                    <Route
                        exact
                        path="/password/reset/:token"
                        element={<ResetPassword />}
                    />
                    <Route element={<ProtectedRoute />}>
                        <Route exact path="/account" element={<Profile />} />
                        <Route
                            exact
                            path="/me/update"
                            element={<UpdateProfile />}
                        />
                        <Route
                            exact
                            path="/password/update"
                            element={<UpdatePassword />}
                        />
                        <Route exact path="/shipping" element={<Shipping />} />
                        <Route
                            exact
                            path="/order/confirm"
                            element={<ConfirnOrder />}
                        />

                        {stripeApiKey && (
                            <Route
                                exact
                                path="/process/payment"
                                element={
                                    <Elements stripe={loadStripe(stripeApiKey)}>
                                        <Payment />{" "}
                                    </Elements>
                                }
                            />
                        )}
                        <Route
                            exact
                            path="/success"
                            element={<OrderSuccess />}
                        />
                        <Route exact path="/orders" element={<MyOrders />} />
                        <Route
                            exact
                            path="/order/:id"
                            element={<OrderDetails />}
                        />
                    </Route>
                    <Route element={<AdminRoute />}>
                        <Route
                            exact
                            path="/admin/dashboard"
                            element={<Dashboard />}
                        />
                        <Route
                            exact
                            path="/admin/products"
                            element={<AllProductsList />}
                        />
                        <Route
                            exact
                            path="/admin/new-product"
                            element={<NewProduct />}
                        />
                        <Route
                            exact
                            path="/admin/update-product/:id"
                            element={<UpdateProduct />}
                        />
                        <Route
                            exact
                            path="/admin/orders"
                            element={<OrderList />}
                        />
                        <Route
                            exact
                            path="/admin/order/:id"
                            element={<ProcessOrder />}
                        />
                        <Route
                            exact
                            path="/admin/users"
                            element={<UsersList />}
                        />
                        <Route
                            exact
                            path="/admin/user/:id"
                            element={<UpdateUser />}
                        />
                        <Route
                            exact
                            path="/admin/reviews"
                            element={<ProductReviews />}
                        />
                    </Route>
                    <Route path="*" exact={true} element={<NotFound />} />
                </Routes>
                <Footer />
            </Router>
        </>
    );
}

export default App;

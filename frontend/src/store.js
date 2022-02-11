import { createStore, combineReducers, applyMiddleware } from "redux";
import Thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
    deleteReviewReducer,
    newProductReducer,
    newReviewReducer,
    productDetailReducer,
    productReducer,
    productReviewsReducer,
    updateProductReducer,
} from "./reducers/productReducer";
import {
    allUsersReducer,
    forgotPasswordReducer,
    profileReducer,
    userDetailsReducer,
    userReducer,
    userUpdateDelete,
} from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReducer";
import {
    allOrdersReducer,
    myOrdersReducer,
    newOrderReducer,
    orderDetailsReducer,
    orderReducer,
} from "./reducers/orderReducer";

const reducer = combineReducers({
    products: productReducer,
    productDetail: productDetailReducer,
    user: userReducer,
    profile: profileReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer, //use not found in project
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    newReview: newReviewReducer,
    productReviews: productReviewsReducer,
    deleteReview: deleteReviewReducer,
    newProduct: newProductReducer,
    updateProduct: updateProductReducer,
    allOrders: allOrdersReducer,
    order: orderReducer, //delete and update order
    allUsers: allUsersReducer,
    editUser: userUpdateDelete,
    getUser: userDetailsReducer,
});
const initialState = {
    cart: {
        cartItems: localStorage.getItem("cartItems")
            ? JSON.parse(localStorage.getItem("cartItems"))
            : [],
        shippingInfo: localStorage.getItem("shippingInfo")
            ? JSON.parse(localStorage.getItem("shippingInfo"))
            : {},
    },
};
const middleware = [Thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;

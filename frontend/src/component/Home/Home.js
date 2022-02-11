import React, { useEffect } from "react";
import { CgMouse } from "react-icons/all";
import { useDispatch, useSelector } from "react-redux";
import { clearError, getAllProducts } from "../../actions/productAction";
import Loader from "../layout/loader/Loader";
import MetaData from "../layout/MetaData";
import "./Home.css";
import ProductCard from "./ProductCard.js";
import { useAlert } from "react-alert";

// const product22 = {
//     name: "T-Shirt",
//     price: "Rs. 399",
//     images: [
//         {
//             url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dCUyMHNoaXJ0fGVufDB8fDB8fA%3D%3D&w=300&q=80",
//         },
//     ],
//     id: "awnish",
// };

const Home = () => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => {
        return state.products;
    });
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearError());
        }
        dispatch(getAllProducts());
    }, [dispatch, error, alert]);

    return (
        <>
            <MetaData title="Ecommerce" />
            {loading ? (
                <Loader />
            ) : (
                <>
                    <MetaData title="ECOMMERCE" />
                    <div className="banner">
                        <p>Welcome to Ecommerce</p>
                        <h1>FIND AMAZING PRODUCTS BELOW</h1>

                        <a href="#container">
                            <button>
                                Scroll <CgMouse />
                            </button>
                        </a>
                    </div>

                    <h2 className="homeHeading">Featured Products</h2>
                    <div className="container" id="container">
                        {/* {console.log("producrs", products)} */}
                        {products &&
                            products.map((product) => {
                                return (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                    />
                                );
                            })}
                    </div>
                </>
            )}
        </>
    );
};

export default Home;

import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { clearError, getAllProducts } from "../../actions/productAction";
import ProductCard from "../Home/ProductCard";
import Loader from "../layout/loader/Loader";
import Pagination from "react-js-pagination";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import "./products.css";
import MetaData from "../layout/MetaData";
const categories = [
    "All",
    "Laptop",
    "Footwear",
    "Bottom",
    "accessory",
    "Attire",
    "Camera",
    "SmartPhones",
    "Tops",
];
const Products = () => {
    const dispatch = useDispatch();

    const alert = useAlert();
    const {
        products,
        loading,
        error,
        productCount,
        countPerPage,
        filteredProductsCount,
    } = useSelector((state) => state.products);
    // console.log("total product", productCount);
    const { keyword } = useParams();

    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 125000]);
    const [category, setCategory] = useState("");
    const [ratings, setRatings] = useState(0);
    useEffect(() => {
        setCurrentPage(1);
    }, [
        keyword,
        price,
        category,
        ratings,
        filteredProductsCount,
        countPerPage,
    ]);
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearError());
        }
        if (filteredProductsCount < countPerPage) {
            setCurrentPage(1);
        }
        dispatch(
            getAllProducts(keyword, currentPage, price, category, ratings)
        );
    }, [
        dispatch,
        keyword,
        alert,
        error,
        currentPage,
        price,
        category,
        ratings,
        filteredProductsCount,
        countPerPage,
    ]);

    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    };
    const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
    };
    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <MetaData title="PRODUCTS -- ECOMMERCE" />
                    <h2 className="productsHeading">Products</h2>

                    <div className="products">
                        {products &&
                            products.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                />
                            ))}
                    </div>
                    <div className="filterBox">
                        <Typography>Price</Typography>
                        <Slider
                            value={price}
                            onChange={priceHandler}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            min={0}
                            max={125000}
                        />
                        <Typography>Categories</Typography>
                        <ul className="categoryBox">
                            {categories.map((category) => (
                                <li
                                    className="category-link"
                                    key={category}
                                    onClick={() => setCategory(category)}
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>
                        <fieldset>
                            <Typography component="legend">
                                Ratings Above
                            </Typography>
                            <Slider
                                value={ratings}
                                onChange={(e, newRating) => {
                                    setRatings(newRating);
                                }}
                                aria-labelledby="continuous-slider"
                                valueLabelDisplay="auto"
                                min={0}
                                max={5}
                            />
                        </fieldset>
                    </div>
                    {countPerPage < filteredProductsCount && (
                        <div className="paginationBox">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={countPerPage}
                                totalItemsCount={productCount}
                                onChange={setCurrentPageNo} //passes an array of lower and higher values
                                nextPageText="Next"
                                prevPageText="Prev"
                                firstPageText="1st"
                                lastPageText="Last"
                                itemClass="page-item"
                                linkClass="page-link"
                                activeClass="pageItemActive"
                                activeLinkClass="pageLinkActive"
                            />
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default Products;

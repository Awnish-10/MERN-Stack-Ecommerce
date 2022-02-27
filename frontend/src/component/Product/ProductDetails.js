import React, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { useDispatch, useSelector } from "react-redux";
import {
    clearError,
    getproductDetail,
    newReview,
} from "../../actions/productAction";
import { Rating } from "@material-ui/lab";
import "./productDetail.css";
import { useParams } from "react-router";
import Loader from "../layout/loader/Loader";
import ReviewCard from "./ReviewCard";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import { addItemsToCart } from "../../actions/cartAction";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { NEW_REVIEW_RESET } from "../../constants/ProductReducerConstants";

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const alert = useAlert();

    const { loading, error, product } = useSelector((state) => {
        return state.productDetail;
    });
    const { success, error: reviewError } = useSelector(
        (state) => state.newReview
    );
    const { isAuthenticated } = useSelector((state) => state.user);
    const params = useParams();
    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    // console.log("product", product);

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearError());
        }
        if (reviewError) {
            alert.error(reviewError);
            dispatch(clearError());
        }
        if (success) {
            alert.success("Review Submitted Successfully");
            dispatch({ type: NEW_REVIEW_RESET });
        }

        dispatch(getproductDetail(id));
    }, [dispatch, id, error, alert, success, reviewError]);

    const options = {
        size: "large",
        value: product.ratings,
        readOnly: true,
        precision: 0.5,
    };
    const decreaseQuantity = () => {
        if (quantity <= 1) {
            return;
        }
        setQuantity((prevValue) => {
            return prevValue - 1;
        });
    };
    const increaseQuantity = () => {
        if (product.stock <= quantity) {
            return;
        }
        setQuantity((prevValue) => {
            return prevValue + 1;
        });
    };
    const addToCartHandler = () => {
        dispatch(addItemsToCart(params.id, quantity));
        alert.success("Item Added To Cart");
    };
    const submitReviewToggle = () => {
        setOpen((prevValue) => {
            return !prevValue;
        });
    };
    const reviewSubmitHandler = () => {
        if (!isAuthenticated) {
            alert.error("Login to add Review");
            setOpen(false);
            return;
        }
        const myForm = new FormData();

        myForm.set("rating", rating);
        myForm.set("comment", comment);
        myForm.set("productId", params.id);
        dispatch(newReview(myForm));

        setOpen(false);
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <MetaData title={`${product.name} -- ECOMMERCE`} />
                    <div className="ProductDetails">
                        <div>
                            <Carousel className="carouserParentDiv">
                                {product &&
                                    product.images &&
                                    product.images.map((item, i) => (
                                        <div className="carouselImgParent">
                                            <img
                                                className="CarouselImage"
                                                key={i}
                                                src={item.url}
                                                alt={`${i} Slide`}
                                            />
                                        </div>
                                    ))}
                            </Carousel>
                        </div>

                        <div>
                            <div className="detailsBlock-1">
                                <h2>{product.name}</h2>
                                <p>Product # {product._id}</p>
                            </div>
                            <div className="detailsBlock-2">
                                <Rating {...options} />
                                <span className="detailsBlock-2-span">
                                    {" "}
                                    (
                                    {product.numberOfReviews
                                        ? product.numberOfReviews
                                        : "0"}{" "}
                                    Reviews)
                                </span>
                            </div>
                            <div className="detailsBlock-3">
                                <h1>{`₹${product.price}`}</h1>
                                <div className="detailsBlock-3-1">
                                    <div className="detailsBlock-3-1-1">
                                        <button onClick={decreaseQuantity}>
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            readOnly
                                        />
                                        <button onClick={increaseQuantity}>
                                            +
                                        </button>
                                    </div>
                                    <button
                                        disabled={
                                            product.Stock < 1 ? true : false
                                        }
                                        onClick={addToCartHandler}
                                    >
                                        Add to Cart
                                    </button>
                                </div>

                                <p>
                                    Status:
                                    <b
                                        className={
                                            product.Stock < 1
                                                ? "redColor"
                                                : "greenColor"
                                        }
                                    >
                                        {product.Stock < 1
                                            ? "OutOfStock"
                                            : "InStock"}
                                    </b>
                                </p>
                            </div>

                            <div className="detailsBlock-4">
                                Description : <p>{product.description}</p>
                            </div>

                            <button
                                onClick={submitReviewToggle}
                                className="submitReview"
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>
                    <h3 className="reviewsHeading">REVIEWS</h3>

                    <Dialog
                        aria-labelledby="simple-dialog-title"
                        open={open}
                        onClose={submitReviewToggle}
                    >
                        <DialogTitle>Submit Review</DialogTitle>
                        <DialogContent className="submitDialog">
                            <Rating
                                onChange={(e) => setRating(e.target.value)}
                                value={rating}
                                size="large"
                            />

                            <textarea
                                className="submitDialogTextArea"
                                cols="30"
                                rows="5"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={submitReviewToggle}
                                color="secondary"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={reviewSubmitHandler}
                                color="primary"
                            >
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* {console.log("reviews", product.reviews)} */}
                    {product.reviews && product.reviews[0] ? (
                        <div className="reviews">
                            {product.reviews &&
                                product.reviews.map((review, i) => (
                                    <ReviewCard key={i} review={review} />
                                ))}
                        </div>
                    ) : (
                        <p className="noReviews">No Reviews Yet</p>
                    )}
                </>
            )}
        </>
    );
};

export default ProductDetails;

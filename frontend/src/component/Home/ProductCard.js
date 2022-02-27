import React from "react";
import { Rating } from "@material-ui/lab";
import { Link } from "react-router-dom";
import "./Home.css";

const ProductCard = ({ product }) => {
    const options = {
        value: product.ratings,
        readOnly: true,
        precision: 0.5,
    };
    const mainImage = product.images.length > 0 ? product.images[0].url : "";
    return (
        <Link className="productCard" to={`/product/${product._id}`}>
            <img src={mainImage} alt={product.name} />
            <p>{product.name}</p>
            <div>
                <Rating {...options} />
                <span className="productCardSpan">
                    {`${
                        product.numberOfReviews ? product.numberOfReviews : "0"
                    }Reviews`}
                </span>
            </div>
            <span>{`₹${product.price}`}</span>
        </Link>
    );
};

export default ProductCard;

import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  // get products
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProducts(data?.product?._id, data?.product?.category?._id);
    } catch (err) {
      console.log(err);
    }
  };

  // get similar products
  const getSimilarProducts = async (id, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/related-product/${id}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (err) {
      console.log(err);
    }
  };

  function trimDescription(description) {
    let trimmedDescription = "";
    if (description.length > 50) {
      trimmedDescription = description.substring(0, 50) + "...";
    } else {
      trimmedDescription = description;
    }
    return trimmedDescription;
  }

  return (
    <Layout>
      <div className="row container mt-3">
        <div className="col-md-6">
          <img
            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
            className="card-img-top"
            alt={product.name}
          />
        </div>
        <div className="col-md-6">
          <h1 className="text-center">Product Details</h1>
          <h5>Name : {product.name}</h5>
          <h5>
            Description :{" "}
            <span className="fw-light fs-6">{product.description}</span>
          </h5>
          <h5>Price : {product.price}</h5>
          <h5>Category : {product.category?.name}</h5>
          <button className="btn btn-secondary ms-1">ADD TO CART</button>
        </div>
      </div>
      <hr />
      <div className="row container">
        <h3>Similar Products</h3>
        {relatedProducts.length < 1 && <p>No Similar Products Found</p>}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((product) => {
            return (
              <>
                <div className="card m-2" style={{ width: "18rem" }}>
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                    className="card-img-top"
                    alt={product.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">
                      {trimDescription(product.description)}
                    </p>
                    <p className="card-text">₹{product.price}</p>
                    <button className="btn btn-primary ms-1">
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;

import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const getProductsByCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (params?.slug) getProductsByCategory();
  }, [params?.slug]);

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
      <div className="container mt-3">
        <h3 className="text-center">{category?.name}</h3>
        <div className="d-flex flex-wrap">
          {products?.map((product) => {
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
                    <button
                      className="btn btn-primary ms-1"
                      onClick={() => navigate(`/product/${product.slug}`)}
                    >
                      See Details
                    </button>
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

export default CategoryProduct;

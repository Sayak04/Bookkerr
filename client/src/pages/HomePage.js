import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/Cart";

const HomePage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong in getting category");
    }
  };

  // get total count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-count`
      );
      setTotal(data?.total);
    } catch (err) {
      console.log(err);
      toast.error("Somthing went wrong in getting the total");
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  // get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      if (data?.success) {
        setProducts(data?.products);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
      toast.error("Could not get all products");
    }
  };

  // load more products function
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (err) {
      setLoading(false);
      console.log(err);
      toast.error("Could not load more products...");
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filteredProduct();
  }, [checked, radio]);

  // filter by category
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((category) => category !== id);
    }
    setChecked(all);
  };

  // get filtered products
  const filteredProduct = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/product-filters`,
        { checked, radio }
      );
      setProducts(data?.products);
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
    <Layout title={"Home - Bookkerr"}>
      <div className="row mt-3">
        <div className="col-md-2">
          <h4 className="text-center">Filter by Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((category) => (
              <Checkbox
                key={category._id}
                onChange={(e) => handleFilter(e.target.checked, category._id)}
              >
                {category.name}
              </Checkbox>
            ))}
          </div>
          <h4 className="text-center mt-4">Filter by Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((pro) => (
                <div key={pro._id}>
                  <Radio value={pro.array}>{pro.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column mt-4">
            <button
              className="btn btn-secondary"
              onClick={() => window.location.reload()}
            >
              Clear All
            </button>
          </div>
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Books</h1>
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
                      <button
                        className="btn btn-primary ms-1"
                        onClick={() => {
                          setCart([...cart, product]);
                          localStorage.setItem(
                            "cart",
                            JSON.stringify([...cart, product])
                          );
                          toast.success("Product added to cart successfully");
                        }}
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading..." : "Load More..."}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;

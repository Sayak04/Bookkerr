import React from "react";
import Layout from "../components/Layout/Layout";
import { useSearch } from "../context/Search";

const Search = () => {
  const [values, setValues] = useSearch();

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
    <Layout title={"Searched Books"}>
      <div className="container">
        <div className="text-center">
          <h1>Search Results</h1>
          <h6>
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length} products`}
          </h6>
          <div className="d-flex flex-wrap mt-4">
            {values?.results.map((product) => {
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
      </div>
    </Layout>
  );
};

export default Search;

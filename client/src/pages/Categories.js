import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import useCategory from "./../hooks/useCategory";

const Categories = () => {
  const categories = useCategory();
  return (
    <Layout title={"Categories - Bookkerr"}>
      <div className="container">
        <div className="row">
          {categories?.map((category) => (
            <div className="col-md-6 mt-5 mb-3 gx-3 gy-3" key={category._id}>
              <Link
                to={`/category/${category.slug}`}
                className="btn btn-primary"
              >
                {category?.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;

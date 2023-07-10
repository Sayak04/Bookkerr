import React from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/Cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  const totalPrice = () => {
    try {
      let totalSum = 0;
      cart?.map((item) => (totalSum += item.price));
      return totalSum;
    } catch (err) {
      console.log(err);
    }
  };

  const removeCartItem = (id) => {
    try {
      let userCart = [...cart];
      let index = userCart.findIndex((item) => item._id === id);
      userCart.splice(index, 1);
      setCart(userCart);
      localStorage.setItem("cart", JSON.stringify(userCart));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <div className="container mb-5">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {`Hello ${auth?.token && auth?.user?.name}`}
            </h1>
            <h4 className="text-center">
              {cart?.length > 0
                ? `You have ${cart?.length} items in your cart ${
                    auth?.token ? "" : "Please login to checkout"
                  }`
                : "Your cart is empty"}
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <div className="row">
              {cart?.map((product) => (
                <div className="row mb-2 p-3 card flex-row">
                  <div className="col-md-4">
                    <img
                      src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                      className="card-img-top"
                      alt={product.name}
                      height="300px"
                    />
                  </div>
                  <div className="col-md-8">
                    <h4>{product.name}</h4>
                    <p>{product.description.substring(0, 300)}...</p>
                    <h4>Price:- ₹ {product.price}</h4>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        removeCartItem(product._id);
                      }}
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-4 text-center">
            <h3>Cart Summary</h3>
            <p>Total Payment:- </p>
            <hr />
            <h4>Total:- ₹{totalPrice()}</h4>
            {auth?.user?.address ? (
              <>
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h5>{auth?.user?.address}</h5>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Edit Address
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Edit Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/login", {
                        state: "/cart"
                      })}
                    >
                      Please login to checkout
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;

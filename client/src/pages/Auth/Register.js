import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import {useNavigate} from 'react-router-dom';
import { toast } from "react-toastify";
import axios from "axios";
import '../../styles/AuthStyles.css';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/register`,
        { name, email, password, phone, address, answer }
      );
      if(res.data.success) {
        toast.success(res.data.message);
        navigate('/login');
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong...");
    }
  };

  const handleName = (event) => {
    setName(event.target.value);
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handlePhone = (event) => {
    setPhone(event.target.value);
  };

  const handleAddress = (event) => {
    setAddress(event.target.value);
  };

  const handleAnswer = (event) => {
    setAnswer(event.target.value);
  }

  return (
    <Layout title="Register - Bookkerr">
      <div className="form-container">
        <h1> Register Page </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              value={name}
              onChange={handleName}
              className="form-control"
              id="exampleInputName"
              placeholder="Enter your name..."
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              value={email}
              onChange={handleEmail}
              className="form-control"
              id="exampleInputEmail"
              placeholder="Enter your email..."
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={handlePassword}
              className="form-control"
              id="exampleInputPassword"
              placeholder="Enter your password..."
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={phone}
              onChange={handlePhone}
              className="form-control"
              id="exampleInputPhone"
              placeholder="Enter your phone number..."
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={address}
              onChange={handleAddress}
              className="form-control"
              id="exampleInputAddress"
              placeholder="Enter your address..."
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={answer}
              onChange={handleAnswer}
              className="form-control"
              id="exampleInputAnswer"
              placeholder="Name your favourite book..."
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;

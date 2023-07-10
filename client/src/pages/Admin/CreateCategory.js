import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { Button, Modal } from "antd";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import CategoryForm from "../../components/Form/CategoryForm";

const CreateCategory = () => {
  const [auth, setAuth] = useAuth();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  // handle form
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/category/create-category`,
        { name },
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      if (data?.success) {
        toast.success(`${name} is created`);
        getAllCategories();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong in input form");
    }
    setName("");
  };

  // update category
  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/category/update-category/${selected._id}`,
        { name: updatedName },
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategories();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong in update form");
    }
  };

  // delete category
  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/category/delete-category/${selected._id}`,
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      if (data.success) {
        toast.success(`Category deleted successfully`);
        getAllCategories();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong in update form");
    }
  };

  // get all categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error getting all categories...");
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1> Manage Category...</h1>
            <div className="p-3 w-50">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div className="w-75">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((category) => {
                    return (
                      <>
                        <tr>
                          <td key={category._id}>{category.name}</td>
                          <td>
                            <button
                              className="btn btn-primary ms-2"
                              onClick={() => {
                                setVisible(true);
                                setUpdatedName(category.name);
                                setSelected(category);
                              }}
                            >
                              Edit
                            </button>
                            <button className="btn btn-danger ms-2" onClick={() => {
                              setSelected(category)
                              handleDelete()
                            }}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Modal
              onCancel={() => setVisible(false)}
              footer={null}
              open={visible}
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdate}
              />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;

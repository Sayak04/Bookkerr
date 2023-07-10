import React from "react";

const CategoryForm = ({ handleSubmit, value, setValue }) => {
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter new category"
            value={value}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </>
  );
};

export default CategoryForm;

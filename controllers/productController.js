import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from "fs";
import slugify from "slugify";

export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity } = req.fields;
    const { photo } = req.files;

    // validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });

      case !description:
        return res.status(500).send({ error: "Description is required" });

      case !price:
        return res.status(500).send({ error: "Price is required" });

      case !category:
        return res.status(500).send({ error: "Catgeory is required" });

      case !quantity:
        return res.status(500).send({ error: "Quantity is required" });

      case !photo || photo.size > 10000000:
        return res.status(500).send({
          error: "Photo is required and less than 1mb size should it be...",
        });
    }
    const products = new productModel({
      ...req.fields,
      slug: slugify(name),
    });

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product created successfully",
      products,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Something went wrong...",
      err,
    });
  }
};

// get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      total: products.length,
      message: "Products fetched successfully",
      products,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Something went wrong...",
      err,
    });
  }
};

// get a single product based on slug
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    if (!product) {
      res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Product was successfully fetched",
      product: product,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Something went wrong...",
      err,
    });
  }
};

// get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id).select("photo");
    if (product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Something went wrong...",
      err,
    });
  }
};

// delete product
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Something went wrong...",
      err,
    });
  }
};

//update product
export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity } = req.fields;
    const { photo } = req.files;

    // validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });

      case !description:
        return res.status(500).send({ error: "Description is required" });

      case !price:
        return res.status(500).send({ error: "Price is required" });

      case !category:
        return res.status(500).send({ error: "Catgeory is required" });

      case !quantity:
        return res.status(500).send({ error: "Quantity is required" });

      case !photo || photo.size > 10000000:
        return res.status(500).send({
          error: "Photo is required and less than 1mb size should it be...",
        });
    }
    const products = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product updated successfully",
      products,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Something went wrong...",
      err,
    });
  }
};

// Filter controller
export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Filters failed",
      err,
    });
  }
};

// Count of products
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Filter count failed",
      err,
    });
  }
};

// Product list based on page
export const productListController = async (req, res) => {
  try {
    const perPage = 3;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Product list failed",
      err,
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(result);
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Search product failed",
      err,
    });
  }
};

// get related products
export const relatedProductController = async (req, res) => {
  try {
    const { id, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: id },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Search related products failed",
      err,
    });
  }
};

// get category wise product
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({category}).populate('category');
    res.status(200).send({
      success:true,
      message: "Product category successfully retrieved...",
      category,
      products,
    })
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Product category not found",
      err,
    });
  }
};

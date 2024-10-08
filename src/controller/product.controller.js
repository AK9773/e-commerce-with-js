import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { Product } from "../model/product.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.utils.js";
import ApiFeature from "../utils/apiFeature.utils.js";
import getImageName from "../utils/getImageName.utils.js";

const getProductList = asyncHandler(async (req, res) => {
  const totalProducts = await Product.countDocuments();

  const page = Number(req.query.page) || 1;
  const apiFeature = new ApiFeature(Product.find(), req.query)
    .search()
    .filter()
    .pagination();

  const productList = await apiFeature.query;
  const visibleProducts = productList.length;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        "Total Products": totalProducts,
        "Visible Products": visibleProducts,
        page,
        productList,
      },
      "Products is fetched",
      "products"
    )
  );
});

const addProduct = asyncHandler(async (req, res) => {
  const { name, price, category, description } = req.body;

  if (!name || !price) {
    throw new ApiError(400, "name and price are required");
  }

  const localThumbnailFilePath = req.files?.thumbnail[0].path;
  if (!localThumbnailFilePath) {
    throw new ApiError(400, "Thumbnail is required");
  }
  const thumbnail = await uploadOnCloudinary(
    localThumbnailFilePath,
    "products"
  );

  let localImagesFilePath = [];
  if (req.files && req.files.images) {
    for (const image of req.files.images) {
      localImagesFilePath.push(image.path);
    }
  }

  let images = [];
  for (let index = 0; index < localImagesFilePath.length; index++) {
    const localImagePath = localImagesFilePath[index];
    const image = await uploadOnCloudinary(localImagePath, "products");
    images.push(image?.url);
  }

  const product = await Product.create({
    name,
    price,
    category,
    description,
    thumbnail: thumbnail.url,
    images,
    owner: req.user._id,
  });

  const savedProduct = await Product.findById(product._id).select(
    "-createdAt -updatedAt -__v"
  );
  if (!savedProduct) {
    throw new ApiError(500, "Something went wrong while adding product");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        savedProduct,
        "Product saved successfully",
        "product"
      )
    );
});

const getProduct = asyncHandler(async (req, res) => {
  const productId = req.params.productId;

  const product = await Product.findById(productId).select(
    "-createdAt -updatedAt -__v"
  );
  if (!product) {
    throw new ApiError(400, "Product does not exist with the product id");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, product, "Product fetched successfully", "product")
    );
});

const updateProductDetails = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(
      400,
      `Product does not exist with the product id ${productId}`
    );
  }

  let { name, price, category, description } = req.body;

  if (!name) {
    name = product.name;
  }
  if (!price) {
    price = product.price;
  }

  if (!category) {
    category = product.category;
  }
  if (!description) {
    description = product.description;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        name: name,
        price: price,
        category: category,
        description: description,
      },
    },
    { new: true }
  );

  if (!updatedProduct) {
    throw new ApiError(
      500,
      "something went wrong while updating product details"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProduct,
        "Product details updated successfully",
        "product"
      )
    );
});

const updateProductThumbnail = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(
      400,
      `Product does not exist with the product id ${productId}`
    );
  }
  const localThumbanilFilePath = req.file?.path;

  if (!localThumbanilFilePath) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const thumbnail = await uploadOnCloudinary(
    localThumbanilFilePath,
    "products"
  );
  if (!thumbnail) {
    throw new ApiError(500, "Error in uploading thumbnail");
  }

  const imageName = getImageName(product.thumbnail);

  await deleteFromCloudinary(`products/${imageName}`);

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        thumbnail: thumbnail.url,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedProduct, "Thumbnail is updated", "product")
    );
});

const updateProductImages = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(
      400,
      `Product does not exist with the product id ${productId}`
    );
  }

  const localImageFilePaths = req.files?.images;

  if (!localImageFilePaths || !localImageFilePaths.length) {
    throw new ApiError(400, "Images are required");
  }
  let imageUrls = [];
  for (const localImagePath of localImageFilePaths) {
    const image = await uploadOnCloudinary(localImagePath.path, "products");
    if (!image) {
      throw new ApiError(500, "Error in uploading image");
    }
    imageUrls.push(image?.url);
  }

  const imagesUrl = product.images;
  if (imagesUrl.length > 0) {
    for (const imageUrl of imagesUrl) {
      const imageName = getImageName(imageUrl);
      await deleteFromCloudinary(`products/${imageName}`);
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        images: imageUrls,
      },
    },
    { new: true }
  );

  if (!updatedProduct) {
    throw new ApiError(
      500,
      "Something went wrong while updating product images"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProduct,
        "Product updated successfully",
        "product"
      )
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  if (!productId) {
    throw new ApiError(400, "Product Id is missing");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(
      400,
      `Product does not exist with product id : ${productId}`
    );
  }

  const images = [product.thumbnail];
  for (const image of product?.images) {
    images.push(image);
  }

  for (const image of images) {
    const imageName = getImageName(image);
    await deleteFromCloudinary(`products/${imageName}`);
  }

  await Product.findByIdAndDelete(productId);

  const confirmDelete = await Product.findById(productId);

  if (confirmDelete) {
    throw new ApiError(500, "Failed to delete the product");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product Deleted Succeessfully"));
});

const getProductListOfSeller = asyncHandler(async (req, res) => {
  let sellerId;
  if (req.body?.sellerId) {
    sellerId = req.body?.sellerId;
  } else {
    sellerId = req.user._id;
  }
  const productList = await Product.find({
    owner: sellerId,
  }).select("name price color category thumbnail");

  return res
    .status(200)
    .json(
      new ApiResponse(200, productList, "Data fetched Successfully", "products")
    );
});

export {
  getProductList,
  addProduct,
  getProduct,
  updateProductDetails,
  updateProductThumbnail,
  updateProductImages,
  deleteProduct,
  getProductListOfSeller,
};

import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { Product } from "../model/product.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.utils.js";

const getImageName = (url) => {
  const arrayOfUrl = url.split("/");
  const imageName = arrayOfUrl[arrayOfUrl.length - 1].split(".")[0];
  return imageName;
};

const getProductList = asyncHandler(async (req, res) => {
  const productList = await Product.find();

  return res
    .status(200)
    .json(new ApiResponse(200, productList, "Product fetched Successfully"));
});

const addProduct = asyncHandler(async (req, res) => {
  const { name, price, color, category, description } = req.body;

  if (!name || !price) {
    throw new ApiError(400, "name and price are required");
  }

  const localThumbnailFilePath = req.files?.thumbnail[0].path;
  if (!localThumbnailFilePath) {
    throw new ApiError(400, "Thumbnail is required");
  }
  const thumbnail = await uploadOnCloudinary(localThumbnailFilePath);

  let localImagesFilePath = [];
  if (req.files && req.files.images) {
    for (const image of req.files.images) {
      localImagesFilePath.push(image.path);
    }
  }

  let images = [];
  for (let index = 0; index < localImagesFilePath.length; index++) {
    const localImagePath = localImagesFilePath[index];
    const image = await uploadOnCloudinary(localImagePath);
    images.push(image?.url);
  }

  const product = await Product.create({
    name,
    price,
    color,
    category,
    description,
    thumbnail: thumbnail.url,
    images,
    owner: req.user._id,
  });

  const savedProduct = await Product.findById(product._id);
  if (!savedProduct) {
    throw new ApiError(500, "Something went wrong while adding product");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, savedProduct, "Product saved successfully"));
});

const getProduct = asyncHandler(async (req, res) => {
  const productId = req.params.productId;

  if (!productId) {
    throw new ApiError(400, "productId is missing");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(400, "Product does not exist with the product id");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
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

  let { name, price, color, category, description } = req.body;

  if (!name) {
    name = product.name;
  }
  if (!price) {
    price = product.price;
  }
  if (!color) {
    color = product.color;
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
        color: color,
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
        "Product details updated successfully"
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

  const thumbnail = await uploadOnCloudinary(localThumbanilFilePath);
  if (!thumbnail) {
    throw new ApiError(500, "Error in uploading thumbnail");
  }

  const imageName = getImageName(product.thumbnail);

  await deleteFromCloudinary(imageName);

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
    .json(new ApiResponse(200, updatedProduct, "Thumbnail is updated"));
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
    const image = await uploadOnCloudinary(localImagePath.path);
    if (!image) {
      throw new ApiError(500, "Error in uploading image");
    }
    imageUrls.push(image?.url);
  }

  const imagesUrl = product.images;
  if (imagesUrl.length > 0) {
    for (const imageUrl of imagesUrl) {
      const imageName = getImageName(imageUrl);
      await deleteFromCloudinary(imageName);
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
    .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
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
    .json(new ApiResponse(200, productList, "Data fetched Successfully"));
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

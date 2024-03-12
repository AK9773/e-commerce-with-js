import { query } from "express";

class ApiFeature {
  constructor(query, queryElements) {
    this.query = query;
    this.queryElements = queryElements;
  }

  search() {
    const keyword = this.queryElements.keyword
      ? {
          name: {
            $regex: this.queryElements.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query
      .find({ ...keyword })
      .select("-createdAt -updatedAt -__v");
    return this;
  }

  filter() {
    let copyOfQueryElements = { ...this.queryElements };
    const removeFields = ["page", "keyword", "limit"];
    removeFields.forEach((element) => delete copyOfQueryElements[element]);

    const { lt, lte, gt, gte } = copyOfQueryElements;
    const priceRange = {};

    if (lt) {
      priceRange.$lt = parseInt(lt);
      delete copyOfQueryElements.lt;
    }
    if (lte) {
      priceRange.$lte = parseInt(lte);
      delete copyOfQueryElements.lte;
    }
    if (gt) {
      priceRange.$gt = parseInt(gt);
      delete copyOfQueryElements.gt;
    }
    if (gte) {
      priceRange.$gte = parseInt(gte);
      delete copyOfQueryElements.gte;
    }

    copyOfQueryElements.price = { ...priceRange };

    this.query = this.query.find(copyOfQueryElements);
    return this;
  }

  pagination(resultPerPage) {
    const pageNumber = Number(this.queryElements.page) || 1;
    const skip = resultPerPage * (pageNumber - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

export default ApiFeature;

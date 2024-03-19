export class ApiResponse {
  constructor(statusCode, data, message = "Success", type) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;

    switch (type) {
      case "user":
        this.user = data;
        break;
      case "users":
        this.users = data;
        break;
      case "tokens":
        this.tokens = data;
        break;
      case "product":
        this.product = data;
        break;
      case "products":
        this.products = data;
        break;
      case "cart":
        this.cart = data;
        break;
      case "carts":
        this.carts = data;
        break;
      case "order":
        this.order = data;
        break;
      case "orders":
        this.orders = data;
        break;
      case "address":
        this.address = data;
        break;
      case "addresses":
        this.addresses = data;
        break;
      default:
        this.data = data;
        break;
    }
  }
}

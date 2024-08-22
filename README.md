# Backend for e-commerce website Using Node.js and Express.js

## Tech Stack

    Node.js, Express.js, MongoDB, JWT for authentication, bcrypt, nodemailer to send email

## Deploy using Docker

To deploy the application using Docker please follow below steps:

1. clone the repository
2. Signup on cloudinary => Dashboard
3. Please note cloud name in Product Environment Section and click on "Go to API Keys" button and copy "API Key" and "API Secret"
4. Paste your credentials in docker-compose.yml file in CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
5. Add Access token secret and Refresh token secret in docker-compose.yml
6. For nodemailer credentials, please login to Gmail => Manage your Google Account => Search App Passwords in search box => Create App Password => copy App Password
7. In environment veriable in docker-compose.yml, paste the app password in "PASSWORD" and email id in EMAIL"
8. Run below command
   > docker compose up -d

## API Documentation

### User APIs

1. Get User
   > Note: This API can be accessed only when user is logged in

```javascript
API: http://localhost:3000/api/v1/users/getUser
Method:GET
Response: {
    "statusCode": 200,
    "message": "User is fetched successfully",
    "success": true,
    "user": {
        "_id": "66b61aa4eb885ee68094f920",
        "username": "abcdefg",
        "fullName": "abcdefg",
        "email": "abcdefg@ak.com",
        "avatar": "http://res.cloudinary.com/dhi3ppizy/image/upload/v1723210405/users/bchrdn5f5uuvhmy2xpmm.jpg",
        "role": "user",
        "createdAt": "2024-08-09T13:33:24.501Z",
        "updatedAt": "2024-08-09T13:36:43.125Z",
        "__v": 0
    }
}
```

2. Register User

```javascript
API: http://localhost:3000/api/v1/users/register
Method: POST
Formdata: {
        "username": "abcdefg",
        "fullName": "abcdefg",
        "email": "abcdefg@ak.com",
        "password": "abcdefg@123"
        "avatar": File
    }
Response: {
    "statusCode": 200,
    "message": "User Registered Successfully",
    "success": true,
    "user": {
        "_id": "66b61aa4eb885ee68094f920",
        "username": "abcdefg",
        "fullName": "abcdefg",
        "email": "abcdefg@ak.com",
        "avatar": "http://res.cloudinary.com/dhi3ppizy/image/upload/v1723210405/users/bchrdn5f5uuvhmy2xpmm.jpg",
        "role": "user",
        "createdAt": "2024-08-09T13:33:24.501Z",
        "updatedAt": "2024-08-09T13:33:24.501Z",
        "__v": 0
    }
}
```

3. Login (Access Token and Refresh Token in cookies)

```javascript
API: http://localhost:3000/api/v1/users/login
Method: POST
Payload: {
    "username":"abcdefg",
    "password":"abcdefg@123"
}
Response: {
    "statusCode": 200,
    "message": "User logged in successfull",
    "success": true,
    "user": {
        "_id": "66b61aa4eb885ee68094f920",
        "username": "abcdefg",
        "fullName": "abcdefg",
        "email": "abcdefg@ak.com",
        "avatar": "http://res.cloudinary.com/dhi3ppizy/image/upload/v1723210405/users/bchrdn5f5uuvhmy2xpmm.jpg",
        "role": "user"
    }
}
```

4. Logout
   > Note: This API can be accessed only when user is logged in

```javascript
API: http://localhost:3000/api/v1/users/logout
Method: POST
Response: {
    "statusCode": 200,
    "message": "User logged out successful",
    "success": true,
    "data": "Logged Out"
}
```

5. Refresh Access Token

```javascript
API: http://localhost:3000/api/v1/users/refreshAccessToken
Method: POST
Response: {
    "statusCode": 200,
    "message": "Access token refreshed",
    "success": true,
    "tokens": {
        "accessToken": "eyJhbGciOiIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmI2MWFhNViODg1ZWU2ODA5NGY5MjAiLCJ1c2VybmFtZSI6ImFiY2RlZmciCJlbWFpbCI6ImFiY2RlZmdAYWsuY29tIiwiaWF0IjoxNzIzMjEwODQ5LCJleHAiOjE3MjMyMTgwNDl9.PPMX-L9oljjhqNfFXH4N_PAtp2mFDDj0gr8vzHENR4",
        "refreshToken": "eyJhbGciOJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmI2MWFhNGViODg1ZWU2OD5NGY5MjAiLCJ1c2VybmFtZSI6ImFiY2RlZmciLJlbWFpbCI6ImFiY2RlZmdAYWsuY29tIiwiaWF0IjoxNzIzMjEwODQ5LCJleHAiOjE3MjQwNzQ4NDl9.pBVGIx2bx4_RiXSSLo339NCMem2cC8RNbRMqOLPO90"
    }
}
```

6. Change Password
   > Note: This API can be accessed only when user is logged in.

```javascript
API: http://localhost:3000/api/v1/users/changePassword
Method: PATCH
Payload: {
    "oldPassword":"abcdefg@123",
    "newPassword":"abcdef@123"
}
Response: {
    "statusCode": 200,
    "message": "Password Updated Successfuylly",
    "success": true,
    "user": {
        "_id": "66b61aa4eb885ee68094f920",
        "username": "abcdefg",
        "fullName": "abcdefg",
        "email": "abcdefg@ak.com",
        "avatar": "http://res.cloudinary.com/dhi3ppizy/image/upload/v1723210405/users/bchrdn5f5uuvhmy2xpmm.jpg",
        "role": "admin",
        "createdAt": "2024-08-09T13:33:24.501Z",
        "updatedAt": "2024-08-09T13:49:07.427Z",
        "__v": 0
    }
}
```

7. Update Role to Seller
   > Note: This API can be accessed only when user's role is admin.

```javascript
API: http://localhost:3000/api/v1/users/updateRoleToSeller/{userId}
Method: POST
Response: {
    "statusCode": 200,
    "message": "User Role is updated to seller",
    "success": true,
    "user": {
        "_id": "66b61aa4eb885ee68094f920",
        "username": "abcdefg",
        "fullName": "abcdefg",
        "email": "abcdefg@ak.com",
        "avatar": "http://res.cloudinary.com/dhi3ppizy/image/upload/v1723210405/users/bchrdn5f5uuvhmy2xpmm.jpg",
        "role": "seller",
        "createdAt": "2024-08-09T13:33:24.501Z",
        "updatedAt": "2024-08-09T13:46:07.021Z",
        "__v": 0
    }
}
```

8. Update Role to Admin
   > Note: This API can be accessed only when user's role is admin.

```javascript
API: http://localhost:3000/api/v1/users/updateRoleToAdmin/{userId}
Method: POST
Response: {
    "statusCode": 200,
    "message": "User Role is updated to admin",
    "success": true,
    "user": {
        "_id": "66b61aa4eb885ee68094f920",
        "username": "abcdefg",
        "fullName": "abcdefg",
        "email": "abcdefg@ak.com",
        "avatar": "http://res.cloudinary.com/dhi3ppizy/image/upload/v1723210405/users/bchrdn5f5uuvhmy2xpmm.jpg",
        "role": "admin",
        "createdAt": "2024-08-09T13:33:24.501Z",
        "updatedAt": "2024-08-09T13:46:48.894Z",
        "__v": 0
    }
}
```

9. Forgot Password

```javascript
API: http://localhost:3000/api/v1/users/forgotPassword
Method: POST
Payload: {"email":"abcdefg@ak.com"}
Response:{
    "statusCode": 200,
    "message": "Otp is sent",
    "success": true,
    "data": {}
}
```

10. Reset Password

```javascript
API: http://localhost:3000/api/v1/users/resetPassword
Method: PATCH
Payload: {
    "email":"abcdefg@ak.com",
    "otp":862771,
    "newPassword":"abcdef@123"
}
Response: {
    "statusCode": 200,
    "message": "Password is successfully reset",
    "success": true,
    "user": {
        "_id": "66b61aa4eb885ee68094f920",
        "username": "abcdefgh",
        "fullName": "abcdefgh",
        "email": "abcdefg@ak.com",
        "role": "user"
    }
}
```

11. Update Avatar
    > Note: This API can be accessed only when user is logged in.

```javascript
API: http://localhost:3000/api/v1/users/updateAvatar
Method: PATCH
FormData: {"avatar": file}
Response: {
    "statusCode": 200,
    "message": "Avatar is updated",
    "success": true,
    "user": {
        "_id": "66b61aa4eb885ee68094f920",
        "username": "abcdefg",
        "fullName": "abcdefg",
        "email": "abcdefg@ak.com",
        "avatar": "http://res.cloudinary.com/dhi3ppizy/image/upload/v1723211804/users/pnttmjpqiy1n61ckhkgx.jpg",
        "role": "user",
        "createdAt": "2024-08-09T13:33:24.501Z",
        "updatedAt": "2024-08-09T13:56:44.807Z"
    }
}
```

12. Update User Details
    > Note: This API can be accessed only when user is logged in.

```javascript
API: http://localhost:3000/api/v1/users/updateUserDetails
Method: PATCH
Payload: {
    "username":"abcdefgh",
    "fullName":"abcdefgh",
    "email":"abcdefgh@ak.com"
}
Response: {
    "statusCode": 200,
    "message": "User details updated successfully",
    "success": true,
    "user": {
        "_id": "66b61aa4eb885ee68094f920",
        "username": "abcdefgh",
        "fullName": "abcdefgh",
        "email": "abcdefgh@ak.com",
        "avatar": "http://res.cloudinary.com/dhi3ppizy/image/upload/v1723211804/users/pnttmjpqiy1n61ckhkgx.jpg",
        "role": "user",
        "createdAt": "2024-08-09T13:33:24.501Z",
        "updatedAt": "2024-08-09T13:59:45.569Z"
    }
}
```

---

### Product APIs

1. Get Product List

```javascript
API: http://localhost:3000/api/v1/products/getProductList
Method: GET
Response: {
    "statusCode": 200,
    "message": "Products is fetched",
    "success": true,
    "products": {
        "Total Products": 2,
        "Visible Products": 2,
        "page": 1,
        "productList": [
            {
                "_id": "66b35b299a4035e0c2bccd5a",
                "name": "laptop",
                "price": 60000,
                "category": "Electronics",
                "description": "best",
                "owner": "65fa6abfa42ae2b3d7d7176e",
                "thumbnail": thumbnailUrl,
                "images": [
                    url1,
                    url2,
                    url3,
                    url4
                ]
            },
            {
                "_id": "66b35b679a4035e0c2bccd70",
                "name": "laptop",
                "price": 60000,
                "category": "Electronics",
                "description": "SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology A12 Bionic chip",
                "owner": "65fa6abfa42ae2b3d7d7176e",
                "thumbnail": thumbnailUrl,
                "images": [
                    url1,
                    url2,
                    url3,
                    url4
                ]
            }
        ]
    }
}

```

2. Get Product by Product id

```javascript
API: http://localhost:3000/api/v1/products/getProduct/{productId}
Method: GET
Response: {
    "statusCode": 200,
    "message": "Product fetched successfully",
    "success": true,
    "product": {
        "_id": "66b35b299a4035e0c2bccd5a",
        "name": "laptop",
        "price": 60000,
        "category": "Electronics",
        "description": "best",
        "owner": "65fa6abfa42ae2b3d7d7176e",
        "thumbnail": thumbnailUrl,
        "images": [
                    url1,
                    url2,
                    url3,
                    url4
                ]
    }
}

```

3. Add Product
   > Note: This API can be accessed only if user's role is admin or seller.

```javascript
API: http://localhost:3000/api/v1/products/addProduct
Method: POST
Formdata:{
    "name": "mobile2",
    "price": 10001,
    "category": "mobile",
    "description": "best mobile",
    thumbnail:File,
    images: File[]
    }
Response: {
    "statusCode": 201,
    "message": "Product saved successfully",
    "success": true,
    "product": {
        "_id": "66b6dc446d298b9ed505fa7e",
        "name": "mobile2",
        "price": 10001,
        "category": "mobile",
        "description": "best mobile",
        "owner": "66b61aa4eb885ee68094f920",
        "thumbnail": thumbnailUrl,
        "images": [
                    url1,
                    url2,
                    url3,
                    url4
                ]
    }
}

```

4. Update Product Details
   > Note: This API can be accessed only if user's role is admin or seller.

```javascript
API: http://localhost:3000/api/v1/products/updateProductDetails/{productId}
Method: PATCH
Payload:{
    "name":"mobile",
    "price":10001,
    "category":"electronics",
    "description":"Best to buy."
}
Response: {
    "statusCode": 200,
    "message": "Product details updated successfully",
    "success": true,
    "product": {
        "_id": "66b6dc446d298b9ed505fa7e",
        "name": "mobile",
        "price": 10001,
        "category": "electronics",
        "description": "Best to buy.",
        "owner": "66b61aa4eb885ee68094f920",
        "thumbnail": thumbnailUrl,
        "images": [
                    url1,
                    url2,
                    url3,
                    url4
                ],
        "createdAt": "2024-08-10T03:19:32.807Z",
        "updatedAt": "2024-08-10T03:25:14.453Z",
        "__v": 0
    }
}

```

5. Update Product Thumbanail
   > Note: This API can be accessed only if user's role is admin or seller.

```javascript
API: http://localhost:3000/api/v1/products/updateThumbnail/{productId}
Method: PATCH
Formdata:{"thumbanail": file}
Response: {
    "statusCode": 200,
    "message": "Thumbnail is updated",
    "success": true,
    "product": {
        "_id": "66b6dc446d298b9ed505fa7e",
        "name": "mobile",
        "price": 10001,
        "category": "electronics",
        "description": "Best to buy.",
        "owner": "66b61aa4eb885ee68094f920",
        "thumbnail": thumbnailUrl,
        "images": [
                    url1,
                    url2,
                    url3,
                    url4
                ],
        "createdAt": "2024-08-10T03:19:32.807Z",
        "updatedAt": "2024-08-10T03:29:48.232Z",
        "__v": 0
    }
}

```

6. Update Product Images
   > Note: This API can be accessed only if user's role is admin or seller.

```javascript
API: http://localhost:3000/api/v1/products/updateImages/{productId}
Method: PATCH
Formdata:{"images": file[]}
Response:{
    "statusCode": 200,
    "message": "Product updated successfully",
    "success": true,
    "product": {
        "_id": "66b6dc446d298b9ed505fa7e",
        "name": "mobile",
        "price": 10001,
        "category": "electronics",
        "description": "Best to buy.",
        "owner": "66b61aa4eb885ee68094f920",
        "thumbnail": thumbnailUrl,
        "images": [
                    url1,
                    url2,
                    url3,
                ],
        "createdAt": "2024-08-10T03:19:32.807Z",
        "updatedAt": "2024-08-10T03:31:59.274Z",
        "__v": 0
    }
}

```

7. Delete Product
   > Note: This API can be accessed only if user's role is admin or seller.

```javascript
API: http://localhost:3000/api/v1/products/deleteProduct/{productId}
Method: DELETE
Response:{
    "statusCode": 200,
    "message": "Product Deleted Succeessfully",
    "success": true,
    "data": null
}

```

8. Get Product List of a Seller
   > Note: This API can be accessed only if user's role is admin or seller.

```javascript
API: http://localhost:3000/api/v1/products/getProductListOfSeller
Method: GET
Response:{
    "statusCode": 200,
    "message": "Data fetched Successfully",
    "success": true,
    "products": [
        {
            "_id": "66b6dc446d298b9ed505fa7e",
            "name": "mobile",
            "price": 10001,
            "category": "electronics",
            "thumbnail": thumnailUrl
        }
    ]
}

```

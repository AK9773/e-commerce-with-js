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
7. In environment veriable in  docker-compose.yml, paste the app password in "PASSWORD" and email id in "EMAIL"

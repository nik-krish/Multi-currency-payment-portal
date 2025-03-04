# Multi-Currency Payment Portal

## Overview
The **Multi-Currency Payment Portal** is a secure and user-friendly web application that facilitates online transactions in multiple currencies. It integrates **Stripe API** for payment processing and employs **JWT-based authentication** to ensure secure access. The application is built using the **MERN (MongoDB, Express, React, Node.js) stack**.

## Features
- **User Authentication**: Secure login and registration with JWT.
- **Stripe Integration**: Process payments in multiple currencies.
- **Real-time Exchange Rates**: Fetch exchange rates from an external API.
- **Transaction History**: Track past payments.
- **Responsive UI**: Designed for a seamless experience across devices.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)
- **Payment Processing**: Stripe API

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js
- MongoDB
- Stripe Account with API keys

### Steps to Run Locally
1. **Clone the Repository**
   ```sh
   git clone https://github.com/nik-krish/Multi-currency-payment-portal.git
   cd Multi-currency-payment-portal
   ```

2. **Install Dependencies**
   ```sh
   npm install
   cd client
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root and add:
   ```env
   MONGO_URI=<your_mongo_connection_string>
   JWT_SECRET=<your_jwt_secret>
   STRIPE_SECRET_KEY=<your_stripe_secret_key>
   ```

4. **Start the Application**
   ```sh
   npm run dev
   ```

## API Endpoints
| Method | Endpoint           | Description          |
|--------|-------------------|----------------------|
| POST   | /api/auth/register | Register a user     |
| POST   | /api/auth/login    | Login a user        |
| GET    | /api/rates         | Get exchange rates  |
| POST   | /api/payment       | Process a payment  |

## Usage
1. Register/Login to access the portal.
2. Select a currency and enter payment details.
3. Process the payment securely via Stripe.
4. View transaction history in the dashboard.

##Sample Image

![Screenshot 2025-03-03 192123](https://github.com/user-attachments/assets/4939c0a7-f21d-43c9-886c-6295c94db1ca)

![Screenshot 2025-03-03 194846](https://github.com/user-attachments/assets/71aa217a-2716-4b4e-a0f5-9d3c71eaf110)

![Screenshot 2025-03-03 194900](https://github.com/user-attachments/assets/a657b0e0-81da-4c2f-bcaa-e440f12ed12b)

![image](https://github.com/user-attachments/assets/02a4c899-e20e-4096-a53a-6a7139fbe6a1)

## License
This project is open-source and available under the **MIT License**.

## Author
[**Nikhil Krishan**](https://github.com/nik-krish)


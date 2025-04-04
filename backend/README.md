# QuickBooks Online Backend

This is the backend service for the QuickBooks Online integration project. It provides APIs to sync data such as Chart of Accounts, Payees, and Transactions from QuickBooks Online to a MongoDB database.

## Features

- OAuth2 authentication with QuickBooks Online.
- Sync Chart of Accounts, Payees, and Transactions.
- Fetch synced data from MongoDB.
- Token management for QuickBooks Online API.

## Prerequisites

- Node.js (v14 or later)
- MongoDB

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `backend` directory and add the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/qbo_db
   QBO_CLIENT_ID=<Your QuickBooks Client ID>
   QBO_CLIENT_SECRET=<Your QuickBooks Client Secret>
   QBO_REDIRECT_URI=http://localhost:5000/auth/callback
   QBO_ENVIRONMENT=sandbox
   QBO_REFRESH_TOKEN=<Your refresh token>
   QBO_REALM_ID=<Your your realmID>
   ```

4. Start the MongoDB server.

5. Run the backend server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `GET /auth` - Redirects to QuickBooks Online for OAuth2 authentication.
- `GET /auth/callback` - Handles the OAuth2 callback and stores tokens in MongoDB.

### Data Sync
- `GET /api/qbo/chart-of-accounts` - Sync Chart of Accounts from QuickBooks Online.
- `GET /api/qbo/payees` - Sync Payees from QuickBooks Online.
- `GET /api/qbo/transactions` - Sync Transactions from QuickBooks Online.
- `GET /api/qbo/sync-data` - Fetch all synced data from MongoDB.

### Token Management
- `GET /api/qbo/check-auth` - Checks if the QuickBooks Online token is valid and refreshes it if necessary.

## Project Structure

```
backend/
├── config/          # Database configuration
├── controllers/     # API controllers
├── models/          # Mongoose models
├── routes/          # API routes
├── server.js        # Main server file
├── .env             # Environment variables
├── .gitignore       # Git ignore file
```

## License

This project is licensed under the MIT License.
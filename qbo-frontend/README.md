# QuickBooks Online Frontend

This is the frontend application for the QuickBooks Online integration project. It provides a user interface to authenticate with QuickBooks Online, view synced data, and manage settings.

## Features

- OAuth2 authentication with QuickBooks Online.
- Dark mode toggle for better user experience.
- Dashboard to display synced data.
- Responsive design for various screen sizes.

## Prerequisites

- Node.js (v14 or later)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ManishMahto1/QuickBooksOnline.git
   cd qbo-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

4. Run the frontend application:
   ```bash
   npm run dev
   ```

## Project Structure

```
qbo-frontend/
├── public/          # Static assets
├── src/             # Source code
│   ├── components/  # React components
│   ├── App.jsx      # Main application file
│   ├── index.js     # Entry point
├── .env             # Environment variables
├── .gitignore       # Git ignore file
```

## License

This project is licensed under the MIT License.
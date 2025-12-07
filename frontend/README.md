# MyApp Frontend

A React-based authentication application with login and register functionality.

## Features

- **Login Tab**: Requires email and password
- **Register Tab**: Requires name, email, password, and password confirmation
- Form validation with error/success messages
- Responsive design
- Beautiful gradient UI

## Installation

1. Navigate to the frontend directory:
```bash
cd c:\Users\16845\myApp\frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── AuthPage.jsx        # Combined Login/Register component
│   ├── AuthPage.css        # Styling for authentication
│   ├── App.jsx             # Main App component
│   ├── App.css             # App styling
│   └── index.js            # Entry point
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## Features & Validations

### Login Form
- Email validation (valid email format required)
- Password field (required)
- Form submission handling

### Register Form
- Name field (required)
- Email validation (valid email format required)
- Password field (minimum 6 characters)
- Password confirmation field
- Password match validation

## Customization

To integrate with a backend API, modify the `handleLogin` and `handleRegister` functions in `AuthPage.jsx` with your API endpoints.

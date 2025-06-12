# Node Authentication System

A comprehensive user authentication system built with Node.js, Express, and MongoDB that provides secure user registration, login, and profile management functionality.

## Features

- User Authentication
  - Secure registration with email verification
  - Login with JWT token authentication
  - Password hashing using bcrypt
  - Password reset functionality
  - Session management
  - OAuth integration (Google, Facebook)

- User Management
  - Profile creation and updates
  - Avatar upload
  - Email preferences management
  - Account deletion
  - Role-based access control

- Security Features
  - Input validation and sanitization
  - Rate limiting for API endpoints
  - CSRF protection
  - XSS prevention
  - Secure HTTP headers
  - Password strength requirements

- Error Handling
  - Comprehensive error logging
  - User-friendly error messages
  - Request validation
  - API error responses

## Installation

```bash
# Clone the repository
git clone https://github.com/SandeepKumarNayak/nodeauthentication.git

# Navigate to project directory
cd nodeauthentication

# Install dependencies
npm install
```

## Usage

This project provides user authentication functionality using Node.js, Express, and MongoDB. Follow these steps to use the application:

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register a new user |
| `/api/auth/verify-email` | GET | Verify user email |
| `/api/auth/login` | POST | Login existing user |
| `/api/auth/logout` | GET | Logout current user |
| `/api/auth/refresh-token` | POST | Refresh JWT token |
| `/api/auth/forgot-password` | POST | Request password reset |
| `/api/auth/reset-password` | POST | Reset user password |
| `/api/auth/profile` | GET | Get user profile |
| `/api/auth/profile` | PUT | Update user profile |
| `/api/auth/avatar` | POST | Upload user avatar |
| `/api/auth/delete-account` | DELETE | Delete user account |

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

# Session
SESSION_SECRET=your_session_secret

# Email Configuration
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

## Tech Stack

- Node.js - Runtime environment
- Express - Web framework
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- Bcrypt - Password hashing
- Express-session - Session management
- Multer - File uploads
- Nodemailer - Email sending
- Express-validator - Input validation
- Winston - Logging
- EJS - View engine
- Bootstrap - Frontend styling

## Features Implementation Details

- User Registration and Login
  - Email verification
  - Password strength validation
  - Login attempt limiting
  - Remember me functionality
  - Secure session handling

- Profile Management
  - Profile photo upload
  - Profile information updates
  - Email preferences
  - Password changes
  - Account deletion

- Security Measures
  - Data encryption
  - API rate limiting
  - Request validation
  - SQL injection prevention
  - XSS protection
  - CSRF tokens

- Error Handling
  - Custom error classes
  - Error logging
  - User-friendly messages
  - Validation errors
  - API error responses

## Contributing

Contributions are always welcome! Here's how you can help:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your PR adheres to the following guidelines:
- Write clear commit messages
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Sandeep Kumar Nayak
- GitHub: [@SandeepKumarNayak](https://github.com/SandeepKumarNayak)
- LinkedIn: [Sandeep Kumar Nayak](https://linkedin.com/in/sandeepkumarnayak)

## Acknowledgments

- Thanks to all contributors who helped with the project
- Special thanks to the Node.js and Express.js communities
- Inspired by various authentication systems and best practices

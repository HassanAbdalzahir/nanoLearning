# nanoLearning

A full-stack learning platform built with Next.js 14+ and Node.js, implementing the MVVM (Model-View-ViewModel) pattern.

## 🚀 Features

- **Frontend**: Next.js 14+ with App Router, TypeScript, and TailwindCSS
- **Backend**: Node.js with Express.js, TypeScript, and MVVM architecture
- **Pattern**: MVVM (Model-View-ViewModel) implementation on both frontend and backend
- **API**: RESTful API with proper error handling and logging
- **Development**: ESLint, Prettier, and TypeScript configuration
- **Ready for**: Authentication, database integration, and future enhancements

## 📁 Project Structure

```
nanoLearning/
├── client/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # Reusable React components
│   │   ├── models/        # Data models and interfaces
│   │   ├── views/         # View components (MVVM)
│   │   ├── viewmodels/    # ViewModels (MVVM)
│   │   ├── services/      # API services and external integrations
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript type definitions
│   ├── .env.local         # Frontend environment variables
│   └── package.json
├── server/                # Node.js backend application
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # HTTP request handlers
│   │   ├── models/        # Data models and interfaces
│   │   ├── viewmodels/    # Business logic (MVVM)
│   │   ├── routes/        # API route definitions
│   │   ├── middleware/    # Express middleware
│   │   ├── utils/         # Utility functions
│   │   ├── services/      # External service integrations
│   │   ├── app.ts         # Express app configuration
│   │   └── server.ts      # Server entry point
│   ├── .env              # Backend environment variables
│   └── package.json
└── README.md
```

## 🛠️ Technology Stack

### Frontend (Client)

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Pattern**: MVVM (Model-View-ViewModel)
- **State Management**: React hooks with ViewModels
- **API Communication**: Fetch API with service layer

### Backend (Server)

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Pattern**: MVVM (Model-View-ViewModel)
- **Middleware**: CORS, Helmet, Morgan, Error handling
- **Logging**: Custom logger with configurable levels

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nanoLearning
   ```

2. **Install dependencies for both client and server**

   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Set up environment variables**

   **Client (.env.local)**

   ```bash
   cd client
   echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local
   ```

   **Server (.env)**

   ```bash
   cd server
   echo "NODE_ENV=development
   PORT=3001
   CORS_ORIGIN=http://localhost:3000
   LOG_LEVEL=info" > .env
   ```

4. **Start the development servers**

   **Start the backend server**

   ```bash
   cd server
   npm run dev
   ```

   The server will start on http://localhost:3001

   **Start the frontend application**

   ```bash
   cd client
   npm run dev
   ```

   The client will start on http://localhost:3000

## 📚 API Endpoints

### Health Check

- `GET /api/health` - Server health status

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🏗️ MVVM Pattern Implementation

### Frontend MVVM

- **Models**: TypeScript interfaces defining data structures
- **Views**: React components handling UI rendering
- **ViewModels**: Classes managing business logic and state

### Backend MVVM

- **Models**: TypeScript interfaces for data structures
- **Views**: HTTP responses (JSON)
- **ViewModels**: Classes containing business logic
- **Controllers**: Handle HTTP requests and delegate to ViewModels

## 🛠️ Development Scripts

### Client

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
```

### Server

```bash
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
```

## 🔧 Configuration

### TypeScript

Both client and server have comprehensive TypeScript configurations with:

- Strict type checking
- Path aliases (`@/` for src directory)
- Source maps for debugging
- Declaration files generation

### ESLint & Prettier

- Consistent code formatting
- TypeScript-aware linting
- Pre-configured rules for both frontend and backend

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build the application: `npm run build`
2. Deploy the `out` directory or use Vercel/Netlify integration

### Backend (Heroku/DigitalOcean)

1. Build the application: `npm run build`
2. Set environment variables
3. Deploy the `dist` directory

## 🔮 Future Enhancements

This project is designed to be easily extensible for:

- **Authentication**: JWT, OAuth, or session-based auth
- **Database**: PostgreSQL, MongoDB, or any database
- **Real-time**: WebSocket integration
- **File Upload**: Cloud storage integration
- **Testing**: Jest, React Testing Library
- **CI/CD**: GitHub Actions, automated testing

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or support, please open an issue in the repository.

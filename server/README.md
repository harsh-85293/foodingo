# Foodingo Backend API

## Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: foodingo-api
   - **Root Directory**: server
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   
5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `JWT_EXPIRE`: 24h
   - `CLIENT_URL`: https://foodingo-yp5a.onrender.com
   - `NODE_ENV`: production

6. Click "Create Web Service"

## Environment Variables

Make sure to set these in Render dashboard:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - Token expiration time (e.g., 24h)
- `CLIENT_URL` - Frontend URL for CORS
- `NODE_ENV` - Set to "production"

## API Endpoints

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/health` - Health check

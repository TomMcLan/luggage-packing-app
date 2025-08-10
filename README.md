# Luggage Packing Assistant

An AI-powered web application that helps users pack luggage efficiently by analyzing photos of their items and providing scientific packing method recommendations.

## Features

- **Smart Luggage Selection**: Choose from 4 standardized luggage sizes
- **AI Item Detection**: Upload photos to automatically detect and categorize items
- **Intelligent Recommendations**: Get 3-5 personalized packing methods based on your items
- **Step-by-Step Instructions**: Detailed packing guides for each recommended method
- **Mobile-First Design**: Optimized for mobile devices with responsive design

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks with localStorage
- **Image Handling**: Built-in Next.js Image optimization
- **HTTP Client**: Axios with interceptors

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: Google Sheets API (no traditional database needed)
- **AI Vision**: OpenAI GPT-4 Vision API for item detection
- **Image Storage**: Cloudinary for cloud image storage
- **Security**: Helmet, CORS, rate limiting

### Deployment
- **Frontend**: Vercel (recommended)
- **Backend**: Railway (recommended)

## Project Structure

```
luggage-packing-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LuggageSelector.jsx     # Screen 1: Luggage selection
│   │   │   ├── PhotoUpload.jsx         # Screen 2: Photo upload
│   │   │   ├── ItemConfirmation.jsx    # Screen 3: Item confirmation
│   │   │   ├── PackingResults.jsx      # Screen 4: Packing results
│   │   │   ├── LoadingSpinner.jsx      # Shared loading component
│   │   │   └── ErrorMessage.jsx        # Shared error component
│   │   ├── hooks/
│   │   │   ├── useApi.js              # API interaction hook
│   │   │   └── useLocalStorage.js     # LocalStorage management
│   │   ├── utils/
│   │   │   ├── api.js                 # API service layer
│   │   │   └── constants.js           # App constants
│   │   └── styles/
│   │       └── globals.css            # Global styles with Tailwind
│   ├── pages/
│   │   ├── index.js                   # Main app page
│   │   └── _app.js                    # Next.js app wrapper
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── database.js                # Google Sheets integration
│   │   ├── vision.js                  # OpenAI Vision API service
│   │   ├── recommendations.js         # Packing recommendation engine
│   │   └── cloudinary.js             # Image storage service
│   ├── server.js                      # Main Express server
│   └── package.json
│
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Google Cloud Service Account with Sheets API access
- OpenAI API key with GPT-4 Vision access
- Cloudinary account for image storage

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd luggage-packing-app

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Google Sheets Setup

1. Create a new Google Sheets document
2. Note the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
3. Create a Google Cloud Service Account:
   - Go to Google Cloud Console
   - Create a new project or select existing
   - Enable Google Sheets API
   - Create a Service Account
   - Download the JSON key file
   - Share your Google Sheet with the service account email (give Editor access)

### 3. Environment Configuration

**Backend Environment** (copy `.env.example` to `.env`):

```bash
cd backend
cp .env.example .env
```

Fill in your credentials:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google Sheets Configuration
GOOGLE_SHEETS_ID=your-google-sheet-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
```

**Frontend Environment** (copy `.env.local.example` to `.env.local`):

```bash
cd frontend
cp .env.local.example .env.local
```

```env
BACKEND_URL=http://localhost:3001
```

### 4. Run Development Servers

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

Visit `http://localhost:3000` to use the application.

## API Documentation

### Endpoints

#### `GET /api/luggage`
Get all available luggage sizes.

**Response:**
```json
{
  "success": true,
  "luggage_sizes": [
    {
      "id": "carryon",
      "name": "20\" Carry-on",
      "dimensions": "22\" × 14\" × 9\"",
      "volume_liters": 45,
      "description": "Standard overhead bin"
    }
  ]
}
```

#### `POST /api/items/detect`
Detect items in uploaded image using AI.

**Request:** Multipart form with image file

**Response:**
```json
{
  "success": true,
  "items": [
    {
      "name": "Blue T-shirt",
      "category": "clothing",
      "confidence": 0.95,
      "estimatedSize": "medium",
      "quantity": 1
    }
  ],
  "referenceFound": true,
  "referenceType": "credit card",
  "image_url": "https://res.cloudinary.com/...",
  "image_id": "luggage-packing/abc123"
}
```

#### `POST /api/recommendations`
Get packing recommendations based on confirmed items.

**Request:**
```json
{
  "items": [
    {
      "name": "Blue T-shirt",
      "category": "clothing",
      "estimatedSize": "medium",
      "quantity": 1
    }
  ],
  "luggage_size": "carryon",
  "session_id": "optional-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "recommended_methods": [
    {
      "id": 1,
      "name": "Rolling Method",
      "description": "Roll clothes tightly to save space",
      "efficiency_rating": 4.2,
      "difficulty": "Easy",
      "time_minutes": 15,
      "space_savings": 30,
      "applicable_items": ["Blue T-shirt"],
      "estimated_space_used": "35%",
      "instructions": [
        {
          "step": 1,
          "text": "Lay garment flat on surface"
        }
      ]
    }
  ],
  "session_id": "generated-or-provided-uuid"
}
```

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `BACKEND_URL`: Your deployed backend URL

### Backend (Railway)

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. The service will auto-deploy on pushes to main branch

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platforms. The app includes health checks and proper error handling for production use.

## Data Storage

The application uses Google Sheets as a database with three sheets:

1. **luggage_sizes**: Predefined luggage dimensions and capacities
2. **packing_methods**: Scientific packing methods with instructions
3. **user_sessions**: User activity logs for analytics

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please create an issue in the GitHub repository or contact the development team.
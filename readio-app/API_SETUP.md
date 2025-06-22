# API Setup Guide for Readio Frontend

This document explains how to configure the backend API for the Readio frontend application.

## Configuration

### Environment Variables

Create a `.env` file in the `readio-app` directory with the following variables:

```env
# Backend API Configuration
REACT_APP_API_BASE_URL=http://localhost:3001
```

### API Endpoints

The frontend expects the following API endpoints to be available on your backend:

#### 1. User Preferences
- **Endpoint**: `POST /api/user-preferences`
- **Purpose**: Save user reading preferences
- **Request Body**:
```json
{
  "email": "user@example.com",
  "preferences": {
    "genres": ["Fiction", "Mystery"],
    "moods": ["Inspired", "Focused"],
    "readingGoal": "expand-knowledge"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
- **Expected Response**: JSON with success status

#### 2. User Authentication (Future)
- **Endpoint**: `POST /api/auth/login`
- **Endpoint**: `POST /api/auth/signup`

#### 3. Book Recommendations (Future)
- **Endpoint**: `GET /api/recommendations`

#### 4. Story Creation (Future)
- **Endpoint**: `POST /api/story-creation`

## Backend Implementation Example

Here's a simple Express.js backend example:

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// User Preferences Endpoint
app.post('/api/user-preferences', (req, res) => {
  try {
    const { email, preferences, timestamp } = req.body;
    
    // Validate required fields
    if (!email || !preferences) {
      return res.status(400).json({ 
        error: 'Email and preferences are required' 
      });
    }
    
    // Save to database (example)
    console.log('Saving user preferences:', { email, preferences, timestamp });
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Preferences saved successfully',
      data: { email, preferences, timestamp }
    });
    
  } catch (error) {
    console.error('Error saving preferences:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
```

## Error Handling

The frontend includes fallback behavior:
- If the backend is unavailable, preferences are saved locally
- Network errors are logged to the console
- Users still see a success message for better UX

## Development vs Production

### Development
- Default backend URL: `http://localhost:3001`
- CORS should be enabled for local development

### Production
- Set `REACT_APP_API_BASE_URL` to your production backend URL
- Ensure HTTPS is used in production
- Configure proper CORS settings for your domain

## Testing the API

You can test the API endpoint using curl:

```bash
curl -X POST http://localhost:3001/api/user-preferences \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "preferences": {
      "genres": ["Fiction"],
      "moods": ["Inspired"],
      "readingGoal": "expand-knowledge"
    },
    "timestamp": "2024-01-01T00:00:00.000Z"
  }'
```

## Troubleshooting

1. **CORS Errors**: Ensure your backend has CORS enabled
2. **Connection Refused**: Check if your backend server is running
3. **404 Errors**: Verify the API endpoint path matches exactly
4. **Environment Variables**: Make sure `.env` file is in the correct location 
import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { 
  Logout, 
  PlayArrow, 
  Book, 
  Psychology, 
  TrendingUp,
  ArrowBack,
  MenuBook
} from '@mui/icons-material';

interface User {
  email: string;
  preferences?: {
    genres: string[];
    moods: string[];
    readingGoal: string;
  };
}

interface RecommendationPageProps {
  user: User | null;
  onLogout: () => void;
  onBackToPreferences: () => void;
}

const readingGoalTitles = {
  'expand-knowledge': 'Expand Knowledge',
  'improve-skills': 'Improve Skills',
  'relaxation': 'Read for Relaxation',
  'stay-informed': 'Stay Informed',
  'build-habit': 'Build a Reading Habit',
  'foster-imagination': 'Foster Imagination & Creativity'
};

const RecommendationPage: React.FC<RecommendationPageProps> = ({
  user,
  onLogout,
  onBackToPreferences
}) => {
  const readingGoal = user?.preferences?.readingGoal;
  const genres = user?.preferences?.genres || [];
  const moods = user?.preferences?.moods || [];

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f8f6ff', // Soft lavender background
      fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      borderRadius: '20px',
      margin: '10px',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
    }}>
      <AppBar position="static" sx={{ mb: 3, backgroundColor: '#e6e6fa' }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              color: '#4a4a4a',
              fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
              fontWeight: 500
            }}
          >
            Readio - Your Book Recommendations
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              mr: 2, 
              color: '#4a4a4a',
              fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif'
            }}
          >
            Welcome, {user?.email}
          </Typography>
          <IconButton color="inherit" onClick={onLogout} sx={{ color: '#4a4a4a' }}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              color: '#2c5aa0', // Comfortable blue
              fontFamily: '"Lora", Georgia, "Times New Roman", serif',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              '@import': 'url("https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap")'
            }}
          >
            Your Personalized Book Recommendations
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3,
              color: '#666666',
              fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
              fontWeight: 400
            }}
          >
            Based on your preferences, we've curated the perfect reading list for you
          </Typography>
          
          {/* User Preferences Summary */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
            <Chip 
              label={`Goal: ${readingGoalTitles[readingGoal as keyof typeof readingGoalTitles] || 'Reading'}`}
              sx={{
                backgroundColor: '#fff3cd', // Soft yellow
                color: '#6495ED', // Comfortable blue text
                border: '2px solid #ffeaa7',
                fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                fontWeight: 500,
                borderRadius: '20px',
                '&:hover': {
                  backgroundColor: '#ffeaa7'
                }
              }}
            />
            <Chip 
              label={`${genres.length} Genres`}
              sx={{
                backgroundColor: '#fff3cd', // Soft yellow
                color: '#FF5733', // Comfortable red text
                border: '2px solidrgb(250, 233, 179)',
                fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                fontWeight: 500,
                borderRadius: '20px',
                '&:hover': {
                  backgroundColor: '#ffeaa7'
                }
              }}
            />
            <Chip 
              label={`${moods.length} Moods`}
              sx={{
                backgroundColor: '#fff3cd', // Soft yellow
                color: '#71BC78', 
                border: '2px solid #ffeaa7',
                fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                fontWeight: 500,
                borderRadius: '20px',
                '&:hover': {
                  backgroundColor: '#ffeaa7'
                }
              }}
            />
          </Box>
        </Box>

        {/* Video Section */}
        <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden', borderRadius: 3 }}>
          <Box sx={{ position: 'relative', backgroundColor: '#000' }}>
            {/* Video Placeholder */}
            <Box
              sx={{
                width: '100%',
                height: { xs: 300, sm: 400, md: 500 },
                backgroundColor: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: 'pointer',
                '&:hover .play-button': {
                  transform: 'scale(1.1)',
                }
              }}
            >
              {/* Video Thumbnail */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography 
                  variant="h4" 
                  color="white" 
                  sx={{ 
                    textAlign: 'center', 
                    px: 2,
                    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 500
                  }}
                >
                  📖 Book Recommendations Video
                </Typography>
              </Box>
              
              {/* Play Button */}
              <Box
                className="play-button"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s ease-in-out',
                  zIndex: 2,
                }}
              >
                <PlayArrow sx={{ fontSize: 40, color: '#1976d2' }} />
              </Box>
            </Box>
            
            {/* Video Info */}
            <Box sx={{ p: 3 }}>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{
                  color: '#87CEEB', // Lighter/bright blue
                  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 500
                }}
              >
                "Must-Read Books for {readingGoalTitles[readingGoal as keyof typeof readingGoalTitles] || 'Your Reading Goal'}"
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 2,
                  color: '#f0f8ff', // Lighter white color
                  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                  lineHeight: 1.6
                }}
              >
                Discover amazing books tailored to your interests in {genres.slice(0, 3).join(', ')} 
                {genres.length > 3 ? ` and ${genres.length - 3} more genres` : ''}. 
                Perfect for when you're feeling {moods.slice(0, 2).join(' and ')}.
              </Typography>
              <Typography 
                variant="body2" 
                sx={{
                  color: '#e6f3ff', // Lighter white color
                  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif'
                }}
              >
                Duration: 8:45 • Updated: Today
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Book Recommendations Grid */}
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            mb: 3,
            color: '#2c5aa0', // Comfortable blue
            fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
            fontWeight: 600
          }}
        >
          🩵 Recommended Books
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 4 
        }}>
          {[1, 2, 3, 4, 5, 6].map((book) => (
            <Card key={book} sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}>
              <Box
                sx={{
                  height: 200,
                  background: `linear-gradient(45deg, #${Math.floor(Math.random()*16777215).toString(16)} 0%, #${Math.floor(Math.random()*16777215).toString(16)} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Book sx={{ fontSize: 60, color: 'white' }} />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    color: '#2c5aa0', // Comfortable blue
                    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 500
                  }}
                >
                  Sample Book {book}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 2,
                    color: '#666666',
                    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                    lineHeight: 1.5
                  }}
                >
                  A fascinating read that matches your interests in {genres[Math.floor(Math.random() * genres.length)]} 
                  and your {readingGoalTitles[readingGoal as keyof typeof readingGoalTitles] || 'reading'} goal.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {genres.slice(0, 2).map((genre) => (
                    <Chip 
                      key={genre} 
                      label={genre} 
                      size="small" 
                      variant="outlined" 
                      sx={{
                        fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                        borderRadius: '15px',
                        borderColor: '#ffeaa7',
                        color: '#666666'
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBack />}
            onClick={onBackToPreferences}
            sx={{ 
              px: 4, 
              py: 1.5,
              backgroundColor: '#ffffff', // White background
              color: '#2c5aa0', // Comfortable blue text
              borderColor: '#2c5aa0',
              fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
              fontWeight: 500,
              borderRadius: '25px',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                borderColor: '#1e3a8a'
              }
            }}
          >
            Back to Preferences
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<Book />}
            sx={{ 
              px: 4, 
              py: 1.5,
              backgroundColor: '#2c5aa0', // Comfortable blue
              fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
              fontWeight: 500,
              borderRadius: '25px',
              '&:hover': {
                backgroundColor: '#1e3a8a'
              }
            }}
          >
            View Full Reading List
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default RecommendationPage; 
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
  ArrowBack 
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
  'build-habit': 'Build a Reading Habit'
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
    <Box>
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Readio - Your Book Recommendations
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, {user?.email}
          </Typography>
          <IconButton color="inherit" onClick={onLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            📚 Your Personalized Book Recommendations
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Based on your preferences, we've curated the perfect reading list for you
          </Typography>
          
          {/* User Preferences Summary */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
            <Chip 
              label={`Goal: ${readingGoalTitles[readingGoal as keyof typeof readingGoalTitles] || 'Reading'}`}
              color="primary"
              variant="outlined"
            />
            <Chip 
              label={`${genres.length} Genres`}
              color="secondary"
              variant="outlined"
            />
            <Chip 
              label={`${moods.length} Moods`}
              color="success"
              variant="outlined"
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
                <Typography variant="h4" color="white" sx={{ textAlign: 'center', px: 2 }}>
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
              <Typography variant="h5" gutterBottom>
                "Must-Read Books for {readingGoalTitles[readingGoal as keyof typeof readingGoalTitles] || 'Your Reading Goal'}"
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Discover amazing books tailored to your interests in {genres.slice(0, 3).join(', ')} 
                {genres.length > 3 ? ` and ${genres.length - 3} more genres` : ''}. 
                Perfect for when you're feeling {moods.slice(0, 2).join(' and ')}.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Duration: 8:45 • Updated: Today
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Book Recommendations Grid */}
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          📚 Recommended Books
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 4 
        }}>
          {[1, 2, 3, 4, 5, 6].map((book) => (
            <Card key={book} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                <Typography variant="h6" gutterBottom>
                  Sample Book {book}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  A fascinating read that matches your interests in {genres[Math.floor(Math.random() * genres.length)]} 
                  and your {readingGoalTitles[readingGoal as keyof typeof readingGoalTitles] || 'reading'} goal.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {genres.slice(0, 2).map((genre) => (
                    <Chip key={genre} label={genre} size="small" variant="outlined" />
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
            sx={{ px: 4, py: 1.5 }}
          >
            Back to Preferences
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<Book />}
            sx={{ px: 4, py: 1.5 }}
          >
            View Full Reading List
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default RecommendationPage; 
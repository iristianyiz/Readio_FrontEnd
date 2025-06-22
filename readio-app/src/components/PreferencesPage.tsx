import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
} from '@mui/material';
import { Logout, Book, Psychology, TrendingUp, AutoAwesome } from '@mui/icons-material';

interface User {
  email: string;
  preferences?: {
    genres: string[];
    moods: string[];
    readingGoal: string;
  };
}

interface PreferencesPageProps {
  user: User | null;
  onPreferencesSubmit: (preferences: {
    genres: string[];
    moods: string[];
    readingGoal: string;
  }) => void;
  onLogout: () => void;
}

const genres = [
  'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction',
  'Fantasy', 'Biography', 'History', 'Self-Help', 'Business',
  'Technology', 'Philosophy', 'Poetry', 'Drama', 'Comedy',
  'Thriller', 'Horror', 'Adventure', 'Travel', 'Cooking',
  'Children\'s - picture books', 'Children\'s - science'
];

const moods = [
  'Inspired', 'Relaxed', 'Focused', 'Curious', 'Motivated',
  'Calm', 'Energetic', 'Thoughtful', 'Amused', 'Serious',
  'Optimistic', 'Reflective', 'Adventurous', 'Peaceful', 'Excited'
];

const readingGoals = [
  {
    id: 'expand-knowledge',
    title: 'Expand Knowledge',
    description: 'I want to learn new topics or deepen my understanding.',
    icon: <Book />
  },
  {
    id: 'improve-skills',
    title: 'Improve Skills',
    description: 'I\'m reading to enhance professional or personal abilities.',
    icon: <TrendingUp />
  },
  {
    id: 'relaxation',
    title: 'Read for Relaxation',
    description: 'I\'m looking for stories or content that help me unwind.',
    icon: <Psychology />
  },
  {
    id: 'stay-informed',
    title: 'Stay Informed',
    description: 'I want to keep up with current events, trends, or innovations.',
    icon: <TrendingUp />
  },
  {
    id: 'build-habit',
    title: 'Build a Reading Habit',
    description: 'I\'m working on making regular reading part of my routine.',
    icon: <Book />
  },
  {
    id: 'foster-imagination',
    title: 'Foster Imagination & Creativity',
    description: 'I want to explore creative worlds and spark my imagination.',
    icon: <AutoAwesome />
  }
];

const PreferencesPage: React.FC<PreferencesPageProps> = ({
  user,
  onPreferencesSubmit,
  onLogout
}) => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    user?.preferences?.genres || []
  );
  const [selectedMoods, setSelectedMoods] = useState<string[]>(
    user?.preferences?.moods || []
  );
  const [selectedReadingGoal, setSelectedReadingGoal] = useState<string>(
    user?.preferences?.readingGoal || ''
  );
  const [showSuccess, setShowSuccess] = useState(false);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleMoodToggle = (mood: string) => {
    setSelectedMoods(prev =>
      prev.includes(mood)
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  };

  const handleSubmit = () => {
    if (selectedGenres.length === 0 || selectedMoods.length === 0 || !selectedReadingGoal) {
      return;
    }

    onPreferencesSubmit({
      genres: selectedGenres,
      moods: selectedMoods,
      readingGoal: selectedReadingGoal,
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const isFormValid = selectedGenres.length > 0 && selectedMoods.length > 0 && selectedReadingGoal;

  return (
    <Box>
      <AppBar position="static" sx={{ 
        mb: 3, 
        backgroundColor: '#e6f3ff', // Lighter blue
        borderRadius: '15px',
        margin: '0 10px 24px 10px'
      }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              color: '#2c5aa0', // Darker blue text for contrast
              fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
              fontWeight: 500
            }}
          >
            Readio - Reading Preferences
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              mr: 2,
              color: '#2c5aa0', // Darker blue text for contrast
              fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif'
            }}
          >
            Welcome, {user?.email}
          </Typography>
          <IconButton color="inherit" onClick={onLogout} sx={{ color: '#2c5aa0' }}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Preferences saved successfully!
        </Alert>
      )}

      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        align="center"
        sx={{
          fontFamily: '"Lora", Georgia, "Times New Roman", serif',
          fontWeight: 600,
          color: 'rgb(46, 93, 163)',
          letterSpacing: '0.5px',
          mb: 2
        }}
      >
        ✨Customize Your Readio Experience✨
      </Typography>
      <Typography 
        variant="body1" 
        color="text.secondary" 
        align="center" 
        sx={{ 
          mb: 4,
          fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
          color: '#f0f8ff'
        }}
      >
        Help us recommend the perfect books for you by selecting your preferences
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Genres and Moods Section */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Genres Section */}
          <Box sx={{ flex: 1 }}>
            <Paper elevation={2} sx={{ 
              p: 3, 
              height: 'fit-content',
              backgroundColor: '#e6f3ff', 
              borderRadius: '20px'
            }}>
              <Typography variant="h6" gutterBottom>
                What genres interest you?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select all that apply (minimum 1)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {genres.map((genre) => {
                  const isSelected = selectedGenres.includes(genre);
                  const isChildrensGenre = genre.startsWith('Children\'s');
                  
                  return (
                    <Chip
                      key={genre}
                      label={genre}
                      onClick={() => handleGenreToggle(genre)}
                      color={isSelected ? 'primary' : 'default'}
                      variant={isSelected ? 'filled' : 'outlined'}
                      sx={{ 
                        mb: 1,
                        ...(isSelected && isChildrensGenre && {
                          backgroundColor: '#FFC0CB',
                          color: '#000',
                          '&:hover': {
                            backgroundColor: '#FFB6C1',
                          }
                        })
                      }}
                    />
                  );
                })}
              </Box>
              {selectedGenres.length > 0 && (
                <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                  Selected: {selectedGenres.length} genre(s)
                </Typography>
              )}
            </Paper>
          </Box>

          {/* Moods Section */}
          <Box sx={{ flex: 1 }}>
            <Paper elevation={2} sx={{ 
              p: 3, 
              height: 'fit-content',
              backgroundColor: '#e6f3ff', 
              borderRadius: '20px'
            }}>
              <Typography variant="h6" gutterBottom>
                What mood are you usually in when reading?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select all that apply (minimum 1)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {moods.map((mood) => (
                  <Chip
                    key={mood}
                    label={mood}
                    onClick={() => handleMoodToggle(mood)}
                    color={selectedMoods.includes(mood) ? 'primary' : 'default'}
                    variant={selectedMoods.includes(mood) ? 'filled' : 'outlined'}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Box>
              {selectedMoods.length > 0 && (
                <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                  Selected: {selectedMoods.length} mood(s)
                </Typography>
              )}
            </Paper>
          </Box>
        </Box>

        {/* Reading Goals Section */}
        <Box>
          <Paper elevation={2} sx={{ 
            p: 3,
            backgroundColor: '#e6f3ff', 
            borderRadius: '20px'
          }}>
            <Typography variant="h6" gutterBottom>
              What's your primary reading goal?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose the option that best describes why you read
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 2 
            }}>
              {readingGoals.map((goal) => (
                <Card
                  key={goal.id}
                  sx={{
                    cursor: 'pointer',
                    border: selectedReadingGoal === goal.id ? 2 : 1,
                    borderColor: selectedReadingGoal === goal.id ? 'primary.main' : 'divider',
                    backgroundColor: '#ffffff', // White background for cards
                    borderRadius: '15px',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: 2,
                    },
                  }}
                  onClick={() => setSelectedReadingGoal(goal.id)}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ color: 'primary.main', mb: 1 }}>
                      {goal.icon}
                    </Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {goal.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {goal.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Submit Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={!isFormValid}
            sx={{ px: 4, py: 1.5 }}
          >
            Save Preferences
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PreferencesPage; 
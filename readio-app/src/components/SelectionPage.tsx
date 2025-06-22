import React from 'react';
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import { Logout, Book, Create } from '@mui/icons-material';

interface User {
  email: string;
  preferences?: {
    genres: string[];
    moods: string[];
    readingGoal: string;
  };
}

interface SelectionPageProps {
  user: User | null;
  onLogout: () => void;
  onNavigateToPreferences: () => void;
  onNavigateToStoryCreation: () => void;
}

const SelectionPage: React.FC<SelectionPageProps> = ({
  user,
  onLogout,
  onNavigateToPreferences,
  onNavigateToStoryCreation
}) => {
  return (
    <Box>
      <AppBar position="static" sx={{ 
        mb: 3, 
        backgroundColor: '#e6f3ff', // Lighter blue
        borderRadius: '15px'
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
            Readio - Choose Your Experience
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

      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        align="center"
        sx={{
          fontFamily: '"Lora", Georgia, "Times New Roman", serif',
          fontWeight: 600,
          letterSpacing: '0.5px',
          mb: 2,
          background: 'linear-gradient(90deg, #87CEEB 0%, #6495ED 25%, rgb(46, 93, 163) 50%, #6495ED 75%, #87CEEB 100%)',
          backgroundSize: '200% 100%',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'colorFlow 8s ease-in-out infinite',
          '@keyframes colorFlow': {
            '0%': {
              backgroundPosition: '0% 50%'
            },
            '50%': {
              backgroundPosition: '100% 50%'
            },
            '100%': {
              backgroundPosition: '0% 50%'
            }
          }
        }}
      >
        <span>✨</span>Welcome to Readio<span>✨</span>
      </Typography>
      <Typography 
        variant="h6" 
        align="center" 
        sx={{ 
          mb: 5,
          fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive',
          color: 'rgb(250, 250, 163)',
          fontWeight: 500,
          fontSize: '1.2rem',
          letterSpacing: '0.3px'
        }}
      >
        Choose how you'd like to experience reading today
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 4,
        maxWidth: 800,
        mx: 'auto'
      }}>
        {/* Option 1: Customize Your Reading Experience */}
        <Card
          sx={{
            cursor: 'pointer',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#e6f3ff', // Light blue background
            borderRadius: '20px',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            },
          }}
          onClick={onNavigateToPreferences}
        >
          <CardContent sx={{ 
            textAlign: 'center', 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 4
          }}>
            <Box>
              <Box sx={{ color: '#2c5aa0', mb: 2 }}>
                <Book sx={{ fontSize: 60 }} />
              </Box>
              <Typography 
                variant="h5" 
                component="h2" 
                gutterBottom
                sx={{
                  color: '#2c5aa0',
                  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 600
                }}
              >
                1. Customize Your Reading Experience
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3,
                  color: '#666666',
                  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                  lineHeight: 1.5
                }}
              >
                Set your reading preferences and get personalized book recommendations tailored to your interests, moods, and goals.
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<Book />}
              sx={{ 
                mt: 2,
                borderRadius: '25px',
                backgroundColor: '#2c5aa0',
                fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#1e3a8a'
                }
              }}
            >
              Get Started
            </Button>
          </CardContent>
        </Card>

        {/* Option 2: Create Your Own Stories */}
        <Card
          sx={{
            cursor: 'pointer',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#e6f3ff', // Light blue background
            borderRadius: '20px',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            },
          }}
          onClick={onNavigateToStoryCreation}
        >
          <CardContent sx={{ 
            textAlign: 'center', 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 4
          }}>
            <Box>
              <Box sx={{ color: '#2c5aa0', mb: 2 }}>
                <Create sx={{ fontSize: 60 }} />
              </Box>
              <Typography 
                variant="h5" 
                component="h2" 
                gutterBottom
                sx={{
                  color: '#2c5aa0',
                  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 600
                }}
              >
                2. Create Your Own Stories
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3,
                  color: '#666666',
                  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                  lineHeight: 1.5
                }}
              >
                Unleash your creativity and craft your own stories. Write, edit, and share your literary creations with the community.
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<Create />}
              sx={{ 
                mt: 2,
                borderRadius: '25px',
                backgroundColor: '#2c5aa0',
                fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#1e3a8a'
                }
              }}
            >
              Start Creating
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default SelectionPage; 
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
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Readio - Choose Your Experience
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, {user?.email}
          </Typography>
          <IconButton color="inherit" onClick={onLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Typography variant="h4" component="h1" gutterBottom align="center">
        Welcome to Readio
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
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
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 4,
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
              <Box sx={{ color: 'primary.main', mb: 2 }}>
                <Book sx={{ fontSize: 60 }} />
              </Box>
              <Typography variant="h5" component="h2" gutterBottom>
                1. Customize Your Reading Experience
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Set your reading preferences and get personalized book recommendations tailored to your interests, moods, and goals.
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<Book />}
              sx={{ mt: 2 }}
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
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 4,
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
              <Box sx={{ color: 'secondary.main', mb: 2 }}>
                <Create sx={{ fontSize: 60 }} />
              </Box>
              <Typography variant="h5" component="h2" gutterBottom>
                2. Create Your Own Stories
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Unleash your creativity and craft your own stories. Write, edit, and share your literary creations with the community.
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<Create />}
              sx={{ mt: 2 }}
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
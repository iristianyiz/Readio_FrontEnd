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

// Sparkle component for fairy-tale effect
const Sparkle: React.FC<{ delay: number; left: string; top: string; size: number; color?: string }> = ({ delay, left, top, size, color = 'gold' }) => (
  <Box
    sx={{
      position: 'absolute',
      left,
      top,
      width: size,
      height: size,
      opacity: 0,
      animation: `sparkle 4s ease-in-out infinite ${delay}s`,
      '@keyframes sparkle': {
        '0%': {
          opacity: 0,
          transform: 'scale(0) rotate(0deg)',
        },
        '25%': {
          opacity: 1,
          transform: 'scale(1.2) rotate(90deg)',
        },
        '50%': {
          opacity: 0.9,
          transform: 'scale(1.5) rotate(180deg)',
        },
        '75%': {
          opacity: 0.7,
          transform: 'scale(1.2) rotate(270deg)',
        },
        '100%': {
          opacity: 0,
          transform: 'scale(0) rotate(360deg)',
        },
      },
      '&::before': {
        content: '"✨"',
        fontSize: `${size}px`,
        display: 'block',
        textAlign: 'center',
        lineHeight: 1,
        filter: `drop-shadow(0 0 8px ${color === 'silver' ? 'rgba(192, 192, 192, 0.8)' : color === 'blue' ? 'rgba(135, 206, 235, 0.8)' : 'rgba(255, 215, 0, 0.8)'}) drop-shadow(0 0 4px ${color === 'silver' ? 'rgba(255, 255, 255, 0.9)' : color === 'blue' ? 'rgba(173, 216, 230, 0.9)' : 'rgba(255, 255, 255, 0.9)'})`,
        textShadow: `0 0 10px ${color === 'silver' ? 'rgba(192, 192, 192, 0.6)' : color === 'blue' ? 'rgba(135, 206, 235, 0.6)' : 'rgba(255, 215, 0, 0.6)'}`,
      },
    }}
  />
);

// Glitter component for extra sparkle effect
const Glitter: React.FC<{ delay: number; left: string; top: string; size: number; color: string }> = ({ delay, left, top, size, color }) => (
  <Box
    sx={{
      position: 'absolute',
      left,
      top,
      width: size,
      height: size,
      opacity: 0,
      animation: `glitter 3s ease-in-out infinite ${delay}s`,
      '@keyframes glitter': {
        '0%': {
          opacity: 0,
          transform: 'scale(0) rotate(0deg)',
        },
        '30%': {
          opacity: 1,
          transform: 'scale(1.3) rotate(120deg)',
        },
        '60%': {
          opacity: 0.8,
          transform: 'scale(1.6) rotate(240deg)',
        },
        '100%': {
          opacity: 0,
          transform: 'scale(0) rotate(360deg)',
        },
      },
      '&::before': {
        content: '"🤍"',
        fontSize: `${size}px`,
        display: 'block',
        textAlign: 'center',
        lineHeight: 1,
        filter: `drop-shadow(0 0 6px ${color === 'silver' ? 'rgba(192, 192, 192, 0.9)' : 'rgba(135, 206, 235, 0.9)'}) drop-shadow(0 0 3px ${color === 'silver' ? 'rgba(255, 255, 255, 1)' : 'rgba(173, 216, 230, 1)'})`,
        textShadow: `0 0 8px ${color === 'silver' ? 'rgba(192, 192, 192, 0.7)' : 'rgba(135, 206, 235, 0.7)'}`,
      },
    }}
  />
);

const SelectionPage: React.FC<SelectionPageProps> = ({
  user,
  onLogout,
  onNavigateToPreferences,
  onNavigateToStoryCreation
}) => {
  return (
    <Box sx={{ 
      position: 'relative', 
      minHeight: '100vh', 
      overflow: 'hidden'
    }}>
      {/* Fairy-tale sparkle background */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 1 }}>
        {/* Enhanced golden sparkles */}
        <Sparkle delay={0} left="10%" top="15%" size={24} color="gold" />
        <Sparkle delay={0.5} left="85%" top="25%" size={20} color="gold" />
        <Sparkle delay={1} left="20%" top="45%" size={28} color="gold" />
        <Sparkle delay={1.5} left="75%" top="35%" size={22} color="gold" />
        <Sparkle delay={2} left="5%" top="65%" size={26} color="gold" />
        <Sparkle delay={2.5} left="90%" top="55%" size={18} color="gold" />
        <Sparkle delay={3} left="30%" top="75%" size={24} color="gold" />
        <Sparkle delay={3.5} left="70%" top="85%" size={20} color="gold" />
        
        {/* Silver sparkles */}
        <Sparkle delay={0.25} left="15%" top="25%" size={22} color="silver" />
        <Sparkle delay={0.75} left="80%" top="35%" size={26} color="silver" />
        <Sparkle delay={1.25} left="25%" top="55%" size={20} color="silver" />
        <Sparkle delay={1.75} left="70%" top="45%" size={24} color="silver" />
        <Sparkle delay={2.25} left="10%" top="75%" size={18} color="silver" />
        <Sparkle delay={2.75} left="85%" top="65%" size={22} color="silver" />
        <Sparkle delay={3.25} left="35%" top="85%" size={26} color="silver" />
        <Sparkle delay={3.75} left="65%" top="15%" size={20} color="silver" />
        
        {/* Blue sparkles */}
        <Sparkle delay={0.125} left="45%" top="20%" size={24} color="blue" />
        <Sparkle delay={0.625} left="60%" top="30%" size={20} color="blue" />
        <Sparkle delay={1.125} left="40%" top="50%" size={26} color="blue" />
        <Sparkle delay={1.625} left="55%" top="60%" size={22} color="blue" />
        <Sparkle delay={2.125} left="50%" top="80%" size={18} color="blue" />
        <Sparkle delay={2.625} left="35%" top="40%" size={24} color="blue" />
        <Sparkle delay={3.125} left="75%" top="70%" size={20} color="blue" />
        <Sparkle delay={3.625} left="20%" top="30%" size={26} color="blue" />
        
        {/* Silver glitters */}
        <Glitter delay={0.3} left="12%" top="18%" size={16} color="silver" />
        <Glitter delay={0.8} left="88%" top="28%" size={14} color="silver" />
        <Glitter delay={1.3} left="18%" top="48%" size={18} color="silver" />
        <Glitter delay={1.8} left="78%" top="38%" size={12} color="silver" />
        <Glitter delay={2.3} left="8%" top="68%" size={16} color="silver" />
        <Glitter delay={2.8} left="92%" top="58%" size={14} color="silver" />
        
        {/* Blue glitters */}
        <Glitter delay={0.4} left="42%" top="22%" size={15} color="blue" />
        <Glitter delay={0.9} left="58%" top="32%" size={13} color="blue" />
        <Glitter delay={1.4} left="38%" top="52%" size={17} color="blue" />
        <Glitter delay={1.9} left="62%" top="62%" size={11} color="blue" />
        <Glitter delay={2.4} left="48%" top="82%" size={15} color="blue" />
        <Glitter delay={2.9} left="32%" top="42%" size={13} color="blue" />
      </Box>

      {/* Content with higher z-index */}
      <Box sx={{ position: 'relative', zIndex: 2 }}>
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
          <span>✨ </span>Welcome to Readio<span>✨</span>
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
          {/* Option 1: Customize Your ReelReads Experience */}
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
                  1. Customize Your ReelReads Experience
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
    </Box>
  );
};

export default SelectionPage; 
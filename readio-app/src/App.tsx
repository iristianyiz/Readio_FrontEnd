import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import LoginPage from './components/LoginPage';
import PreferencesPage from './components/PreferencesPage';
import RecommendationPage from './components/RecommendationPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

interface User {
  email: string;
  preferences?: {
    genres: string[];
    moods: string[];
    readingGoal: string;
  };
}

type AppState = 'login' | 'preferences' | 'recommendations';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [appState, setAppState] = useState<AppState>('login');

  const handleLogin = (email: string, password: string) => {
    // In a real app, this would validate against a backend
    setUser({ email });
    setAppState('preferences');
  };

  const handleSignup = (email: string, password: string) => {
    // In a real app, this would create a new user account
    setUser({ email });
    setAppState('preferences');
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('login');
  };

  const handlePreferencesSubmit = (preferences: {
    genres: string[];
    moods: string[];
    readingGoal: string;
  }) => {
    setUser(prev => prev ? { ...prev, preferences } : null);
    setAppState('recommendations');
  };

  const handleBackToPreferences = () => {
    setAppState('preferences');
  };

  const renderCurrentPage = () => {
    switch (appState) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onSignup={handleSignup} />;
      case 'preferences':
        return (
          <PreferencesPage 
            user={user} 
            onPreferencesSubmit={handlePreferencesSubmit}
            onLogout={handleLogout}
          />
        );
      case 'recommendations':
        return (
          <RecommendationPage
            user={user}
            onLogout={handleLogout}
            onBackToPreferences={handleBackToPreferences}
          />
        );
      default:
        return <LoginPage onLogin={handleLogin} onSignup={handleSignup} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {renderCurrentPage()}
      </Container>
    </ThemeProvider>
  );
}

export default App;

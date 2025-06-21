import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import LoginPage from './components/LoginPage';
import PreferencesPage from './components/PreferencesPage';

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

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (email: string, password: string) => {
    // In a real app, this would validate against a backend
    setUser({ email });
    setIsAuthenticated(true);
  };

  const handleSignup = (email: string, password: string) => {
    // In a real app, this would create a new user account
    setUser({ email });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const handlePreferencesSubmit = (preferences: {
    genres: string[];
    moods: string[];
    readingGoal: string;
  }) => {
    setUser(prev => prev ? { ...prev, preferences } : null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {!isAuthenticated ? (
          <LoginPage onLogin={handleLogin} onSignup={handleSignup} />
        ) : (
          <PreferencesPage 
            user={user} 
            onPreferencesSubmit={handlePreferencesSubmit}
            onLogout={handleLogout}
          />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;

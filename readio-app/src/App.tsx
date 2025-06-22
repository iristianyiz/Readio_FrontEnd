import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import LoginPage from './components/LoginPage';
import SelectionPage from './components/SelectionPage';
import PreferencesPage from './components/PreferencesPage';
import StoryCreationPage from './components/StoryCreationPage';
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

type AppState = 'login' | 'selection' | 'preferences' | 'story-creation' | 'recommendations';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [appState, setAppState] = useState<AppState>('login');
  const [lastSaveMethod, setLastSaveMethod] = useState<'server' | 'local' | null>(null);

  const handleLogin = (email: string, password: string) => {
    // In a real app, this would validate against a backend
    setUser({ email });
    setAppState('selection');
  };

  const handleSignup = (email: string, password: string) => {
    // In a real app, this would create a new user account
    setUser({ email });
    setAppState('selection');
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('login');
  };

  const handlePreferencesSubmit = (preferences: {
    genres: string[];
    moods: string[];
    readingGoal: string;
  }, saveMethod: 'server' | 'local') => {
    setUser(prev => prev ? { ...prev, preferences } : null);
    setLastSaveMethod(saveMethod);
    setAppState('recommendations');
  };

  const handleBackToPreferences = () => {
    setAppState('preferences');
  };

  const handleNavigateToPreferences = () => {
    setAppState('preferences');
  };

  const handleNavigateToStoryCreation = () => {
    setAppState('story-creation');
  };

  const handleBackToSelection = () => {
    setAppState('selection');
  };

  const renderCurrentPage = () => {
    switch (appState) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onSignup={handleSignup} />;
      case 'selection':
        return (
          <SelectionPage
            user={user}
            onLogout={handleLogout}
            onNavigateToPreferences={handleNavigateToPreferences}
            onNavigateToStoryCreation={handleNavigateToStoryCreation}
          />
        );
      case 'preferences':
        return (
          <PreferencesPage 
            user={user} 
            onPreferencesSubmit={(preferences, saveMethod) => handlePreferencesSubmit(preferences, saveMethod)}
            onLogout={handleLogout}
            onBackToSelection={handleBackToSelection}
          />
        );
      case 'story-creation':
        return (
          <StoryCreationPage
            user={user}
            onLogout={handleLogout}
            onBackToSelection={handleBackToSelection}
          />
        );
      case 'recommendations':
        return (
          <RecommendationPage
            user={user}
            onLogout={handleLogout}
            onBackToPreferences={handleBackToPreferences}
            saveMethod={lastSaveMethod}
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

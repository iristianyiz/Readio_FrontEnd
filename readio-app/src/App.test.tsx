import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock the components
jest.mock('./components/LoginPage', () => {
  return function MockLoginPage({ onLogin, onSignup }: any) {
    return (
      <div data-testid="login-page">
        <button onClick={() => onLogin('test@example.com', 'password')}>Login</button>
        <button onClick={() => onSignup('test@example.com', 'password')}>Signup</button>
      </div>
    );
  };
});

jest.mock('./components/SelectionPage', () => {
  return function MockSelectionPage({ onNavigateToPreferences, onNavigateToStoryCreation }: any) {
    return (
      <div data-testid="selection-page">
        <button onClick={onNavigateToPreferences}>Go to Preferences</button>
        <button onClick={onNavigateToStoryCreation}>Go to Story Creation</button>
      </div>
    );
  };
});

jest.mock('./components/PreferencesPage', () => {
  return function MockPreferencesPage({ onPreferencesSubmit }: any) {
    return (
      <div data-testid="preferences-page">
        <button onClick={() => onPreferencesSubmit({
          genres: ['Fiction'],
          moods: ['Inspired'],
          readingGoal: 'expand-knowledge'
        })}>Save Preferences</button>
      </div>
    );
  };
});

jest.mock('./components/StoryCreationPage', () => {
  return function MockStoryCreationPage() {
    return <div data-testid="story-creation-page">Story Creation Page</div>;
  };
});

jest.mock('./components/RecommendationPage', () => {
  return function MockRecommendationPage() {
    return <div data-testid="recommendation-page">Recommendation Page</div>;
  };
});

describe('App', () => {
  test('renders login page by default', () => {
    render(<App />);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  test('navigates to selection page after login', () => {
    render(<App />);
    
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    
    expect(screen.getByTestId('selection-page')).toBeInTheDocument();
  });

  test('navigates to selection page after signup', () => {
    render(<App />);
    
    const signupButton = screen.getByText('Signup');
    fireEvent.click(signupButton);
    
    expect(screen.getByTestId('selection-page')).toBeInTheDocument();
  });

  test('navigates to preferences page from selection', () => {
    render(<App />);
    
    // First login to get to selection page
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    
    // Then navigate to preferences
    const preferencesButton = screen.getByText('Go to Preferences');
    fireEvent.click(preferencesButton);
    
    expect(screen.getByTestId('preferences-page')).toBeInTheDocument();
  });

  test('navigates to story creation page from selection', () => {
    render(<App />);
    
    // First login to get to selection page
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    
    // Then navigate to story creation
    const storyCreationButton = screen.getByText('Go to Story Creation');
    fireEvent.click(storyCreationButton);
    
    expect(screen.getByTestId('story-creation-page')).toBeInTheDocument();
  });

  test('navigates to recommendations page after saving preferences', () => {
    render(<App />);
    
    // Login
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    
    // Go to preferences
    const preferencesButton = screen.getByText('Go to Preferences');
    fireEvent.click(preferencesButton);
    
    // Save preferences
    const saveButton = screen.getByText('Save Preferences');
    fireEvent.click(saveButton);
    
    expect(screen.getByTestId('recommendation-page')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectionPage from './SelectionPage';

// Mock the Material-UI icons
jest.mock('@mui/icons-material', () => ({
  Logout: () => <div data-testid="logout-icon">Logout</div>,
  Book: () => <div data-testid="book-icon">Book</div>,
  Create: () => <div data-testid="create-icon">Create</div>,
}));

const mockUser = {
  email: 'test@example.com',
  preferences: {
    genres: ['Fiction'],
    moods: ['Inspired'],
    readingGoal: 'expand-knowledge'
  }
};

const mockProps = {
  user: mockUser,
  onLogout: jest.fn(),
  onNavigateToPreferences: jest.fn(),
  onNavigateToStoryCreation: jest.fn(),
};

describe('SelectionPage', () => {
  test('renders the selection page with two options', () => {
    render(<SelectionPage {...mockProps} />);
    
    expect(screen.getByText('Welcome to Readio')).toBeInTheDocument();
    expect(screen.getByText('1. Customize Your Reading Experience')).toBeInTheDocument();
    expect(screen.getByText('2. Create Your Own Stories')).toBeInTheDocument();
  });

  test('displays user email in the app bar', () => {
    render(<SelectionPage {...mockProps} />);
    
    expect(screen.getByText('Welcome, test@example.com')).toBeInTheDocument();
  });

  test('calls onNavigateToPreferences when first option is clicked', () => {
    render(<SelectionPage {...mockProps} />);
    
    const preferencesCard = screen.getByText('1. Customize Your Reading Experience').closest('div');
    fireEvent.click(preferencesCard!);
    
    expect(mockProps.onNavigateToPreferences).toHaveBeenCalledTimes(1);
  });

  test('calls onNavigateToStoryCreation when second option is clicked', () => {
    render(<SelectionPage {...mockProps} />);
    
    const storyCreationCard = screen.getByText('2. Create Your Own Stories').closest('div');
    fireEvent.click(storyCreationCard!);
    
    expect(mockProps.onNavigateToStoryCreation).toHaveBeenCalledTimes(1);
  });

  test('calls onLogout when logout button is clicked', () => {
    render(<SelectionPage {...mockProps} />);
    
    const logoutButton = screen.getByTestId('logout-icon').closest('button');
    fireEvent.click(logoutButton!);
    
    expect(mockProps.onLogout).toHaveBeenCalledTimes(1);
  });
}); 
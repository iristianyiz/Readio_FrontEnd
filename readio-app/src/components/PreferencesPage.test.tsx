import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PreferencesPage from './PreferencesPage';

// Mock the Material-UI icons
jest.mock('@mui/icons-material', () => ({
  Logout: () => <div data-testid="logout-icon">Logout</div>,
  Book: () => <div data-testid="book-icon">Book</div>,
  Psychology: () => <div data-testid="psychology-icon">Psychology</div>,
  TrendingUp: () => <div data-testid="trending-up-icon">TrendingUp</div>,
  AutoAwesome: () => <div data-testid="auto-awesome-icon">AutoAwesome</div>,
  ArrowBack: () => <div data-testid="arrow-back-icon">ArrowBack</div>,
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
  onPreferencesSubmit: jest.fn(),
  onLogout: jest.fn(),
  onBackToSelection: jest.fn(),
};

describe('PreferencesPage', () => {
  test('renders the preferences page with title', () => {
    render(<PreferencesPage {...mockProps} />);
    
    expect(screen.getByText('Customize Your Reading Experience')).toBeInTheDocument();
  });

  test('displays user email in the app bar', () => {
    render(<PreferencesPage {...mockProps} />);
    
    expect(screen.getByText('Welcome, test@example.com')).toBeInTheDocument();
  });

  test('renders genre selection chips', () => {
    render(<PreferencesPage {...mockProps} />);
    
    expect(screen.getByText('Fiction')).toBeInTheDocument();
    expect(screen.getByText('Non-Fiction')).toBeInTheDocument();
    expect(screen.getByText('Mystery')).toBeInTheDocument();
  });

  test('renders mood selection chips', () => {
    render(<PreferencesPage {...mockProps} />);
    
    expect(screen.getByText('Inspired')).toBeInTheDocument();
    expect(screen.getByText('Relaxed')).toBeInTheDocument();
    expect(screen.getByText('Focused')).toBeInTheDocument();
  });

  test('renders reading goal cards', () => {
    render(<PreferencesPage {...mockProps} />);
    
    expect(screen.getByText('Expand Knowledge')).toBeInTheDocument();
    expect(screen.getByText('Improve Skills')).toBeInTheDocument();
    expect(screen.getByText('Read for Relaxation')).toBeInTheDocument();
  });

  test('calls onBackToSelection when back button is clicked', () => {
    render(<PreferencesPage {...mockProps} />);
    
    const backButton = screen.getByText('Back to Selection');
    fireEvent.click(backButton);
    
    expect(mockProps.onBackToSelection).toHaveBeenCalledTimes(1);
  });

  test('calls onLogout when logout button is clicked', () => {
    render(<PreferencesPage {...mockProps} />);
    
    const logoutButton = screen.getByTestId('logout-icon').closest('button');
    fireEvent.click(logoutButton!);
    
    expect(mockProps.onLogout).toHaveBeenCalledTimes(1);
  });

  test('renders children genres', () => {
    render(<PreferencesPage {...mockProps} />);
    
    expect(screen.getByText('Children\'s - picture books')).toBeInTheDocument();
    expect(screen.getByText('Children\'s - science')).toBeInTheDocument();
  });
}); 
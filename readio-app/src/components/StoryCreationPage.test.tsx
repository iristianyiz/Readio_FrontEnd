import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StoryCreationPage from './StoryCreationPage';

// Mock the Material-UI icons
jest.mock('@mui/icons-material', () => ({
  Logout: () => <div data-testid="logout-icon">Logout</div>,
  Create: () => <div data-testid="create-icon">Create</div>,
  CloudUpload: () => <div data-testid="cloud-upload-icon">CloudUpload</div>,
  ArrowBack: () => <div data-testid="arrow-back-icon">ArrowBack</div>,
  VideoLibrary: () => <div data-testid="video-library-icon">VideoLibrary</div>,
  Description: () => <div data-testid="description-icon">Description</div>,
  Category: () => <div data-testid="category-icon">Category</div>,
  PlayArrow: () => <div data-testid="play-arrow-icon">PlayArrow</div>,
  Pause: () => <div data-testid="pause-icon">Pause</div>,
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
  onBackToSelection: jest.fn(),
};

describe('StoryCreationPage', () => {
  test('renders the story creation page with title', () => {
    render(<StoryCreationPage {...mockProps} />);
    
    expect(screen.getByText('Create Your Own Stories')).toBeInTheDocument();
  });

  test('displays user email in the app bar', () => {
    render(<StoryCreationPage {...mockProps} />);
    
    expect(screen.getByText('Welcome, test@example.com')).toBeInTheDocument();
  });

  test('renders story information form fields', () => {
    render(<StoryCreationPage {...mockProps} />);
    
    expect(screen.getByText('Story Information')).toBeInTheDocument();
    expect(screen.getByText('Story Type')).toBeInTheDocument();
  });

  test('renders video upload section', () => {
    render(<StoryCreationPage {...mockProps} />);
    
    expect(screen.getByText('Video Upload')).toBeInTheDocument();
    expect(screen.getByText('Click to Upload Video')).toBeInTheDocument();
  });

  test('renders genre selection chips', () => {
    render(<StoryCreationPage {...mockProps} />);
    
    expect(screen.getAllByText('Fiction').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Mystery').length).toBeGreaterThan(0);
  });

  test('renders theme selection chips', () => {
    render(<StoryCreationPage {...mockProps} />);
    
    expect(screen.getByText('Friendship')).toBeInTheDocument();
    expect(screen.getByText('Love')).toBeInTheDocument();
  });

  test('calls onBackToSelection when back button is clicked', () => {
    render(<StoryCreationPage {...mockProps} />);
    
    const backButton = screen.getByText('Back to Selection');
    fireEvent.click(backButton);
    
    expect(mockProps.onBackToSelection).toHaveBeenCalledTimes(1);
  });

  test('calls onLogout when logout button is clicked', () => {
    render(<StoryCreationPage {...mockProps} />);
    
    const logoutButton = screen.getByTestId('logout-icon').closest('button');
    fireEvent.click(logoutButton!);
    
    expect(mockProps.onLogout).toHaveBeenCalledTimes(1);
  });

  test('shows AI voiceover text', () => {
    render(<StoryCreationPage {...mockProps} />);
    
    expect(screen.getByText(/Use AI to automatically analyze your video/)).toBeInTheDocument();
  });
}); 
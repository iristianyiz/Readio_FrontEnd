import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PreferencesPage from './PreferencesPage';

const mockUser = {
  email: 'test@example.com',
  preferences: {
    genres: ['Fiction', 'Mystery'],
    moods: ['Focused', 'Curious'],
    readingGoal: 'expand-knowledge',
  },
};

const mockBackendContent = {
  videoUrl: 'https://example.com/video.mp4',
  audioUrl: 'https://example.com/audio.mp3',
  videoTitle: 'Test Video',
  audioTitle: 'Test Audio',
  isVideoAvailable: true,
  isAudioAvailable: true,
};

const defaultProps = {
  user: mockUser,
  onPreferencesSubmit: jest.fn(),
  onLogout: jest.fn(),
};

describe('PreferencesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders the main page title', () => {
      render(<PreferencesPage {...defaultProps} />);
      expect(screen.getByText('Customize Your Reading Experience')).toBeInTheDocument();
    });

    test('renders the user email in the header', () => {
      render(<PreferencesPage {...defaultProps} />);
      expect(screen.getByText('Welcome, test@example.com')).toBeInTheDocument();
    });

    test('renders section headers', () => {
      render(<PreferencesPage {...defaultProps} />);
      expect(screen.getByText('📚 Reading Preferences')).toBeInTheDocument();
    });
  });

  describe('Reading Preferences Section', () => {
    test('renders genres section', () => {
      render(<PreferencesPage {...defaultProps} />);
      expect(screen.getByText('What genres interest you?')).toBeInTheDocument();
      expect(screen.getByText('Fiction')).toBeInTheDocument();
      expect(screen.getByText('Mystery')).toBeInTheDocument();
    });

    test('renders moods section', () => {
      render(<PreferencesPage {...defaultProps} />);
      expect(screen.getByText('What mood are you usually in when reading?')).toBeInTheDocument();
      expect(screen.getByText('Focused')).toBeInTheDocument();
      expect(screen.getByText('Curious')).toBeInTheDocument();
    });

    test('renders reading goals section', () => {
      render(<PreferencesPage {...defaultProps} />);
      expect(screen.getByText("What's your primary reading goal?")).toBeInTheDocument();
      expect(screen.getByText('Expand Knowledge')).toBeInTheDocument();
      expect(screen.getByText('Improve Skills')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    test('submits preferences when form is valid', async () => {
      const onPreferencesSubmit = jest.fn();
      render(<PreferencesPage {...defaultProps} onPreferencesSubmit={onPreferencesSubmit} />);
      
      const submitButton = screen.getByText('Save Preferences');
      await userEvent.click(submitButton);
      
      expect(onPreferencesSubmit).toHaveBeenCalledWith({
        genres: ['Fiction', 'Mystery'],
        moods: ['Focused', 'Curious'],
        readingGoal: 'expand-knowledge',
      });
    });

    test('disables submit button when form is invalid', () => {
      render(<PreferencesPage {...defaultProps} user={{ email: 'test@example.com' }} />);
      
      const submitButton = screen.getByText('Save Preferences');
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Logout Functionality', () => {
    test('calls onLogout when logout button is clicked', async () => {
      const onLogout = jest.fn();
      render(<PreferencesPage {...defaultProps} onLogout={onLogout} />);
      
      const logoutButton = screen.getByTestId('LogoutIcon').closest('button');
      await userEvent.click(logoutButton!);
      
      expect(onLogout).toHaveBeenCalled();
    });
  });

  describe('Video and Audio Content Section', () => {
    test('shows placeholder message when backend content is available but preferences not submitted', () => {
      render(<PreferencesPage {...defaultProps} backendContent={mockBackendContent} />);
      
      expect(screen.getByText('Personalized Content Available')).toBeInTheDocument();
      expect(screen.getByText('Save your reading preferences above to unlock personalized video and audio content tailored just for you!')).toBeInTheDocument();
      expect(screen.getByText('Save Preferences to Continue')).toBeInTheDocument();
      
      // Should not show the actual video/audio content yet
      expect(screen.queryByText('🎬 Personalized Content')).not.toBeInTheDocument();
      expect(screen.queryByText('Recommended Content')).not.toBeInTheDocument();
    });

    test('renders video and audio section after preferences are submitted', async () => {
      const onPreferencesSubmit = jest.fn();
      render(<PreferencesPage {...defaultProps} backendContent={mockBackendContent} onPreferencesSubmit={onPreferencesSubmit} />);
      
      // Submit preferences first
      const submitButton = screen.getByText('Save Preferences to Continue');
      await userEvent.click(submitButton);
      
      // Now the video and audio content should appear
      expect(screen.getByText('🎬 Personalized Content')).toBeInTheDocument();
      expect(screen.getByText('Recommended Content')).toBeInTheDocument();
      expect(screen.getByText('Test Video')).toBeInTheDocument();
      expect(screen.getAllByText('Test Audio')).toHaveLength(2); // One in subtitle, one in player
    });

    test('does not render video and audio section when backend content is not available', () => {
      render(<PreferencesPage {...defaultProps} />);
      
      expect(screen.queryByText('🎬 Personalized Content')).not.toBeInTheDocument();
      expect(screen.queryByText('Recommended Content')).not.toBeInTheDocument();
      expect(screen.queryByText('Personalized Content Available')).not.toBeInTheDocument();
    });

    test('renders only video section when only video is available after submission', async () => {
      const videoOnlyContent = {
        ...mockBackendContent,
        isAudioAvailable: false,
        audioUrl: undefined,
      };
      
      const onPreferencesSubmit = jest.fn();
      render(<PreferencesPage {...defaultProps} backendContent={videoOnlyContent} onPreferencesSubmit={onPreferencesSubmit} />);
      
      // Submit preferences first
      const submitButton = screen.getByText('Save Preferences to Continue');
      await userEvent.click(submitButton);
      
      expect(screen.getByText('Test Video')).toBeInTheDocument();
      expect(screen.queryByText('Test Audio')).not.toBeInTheDocument();
    });

    test('renders only audio section when only audio is available after submission', async () => {
      const audioOnlyContent = {
        ...mockBackendContent,
        isVideoAvailable: false,
        videoUrl: undefined,
      };
      
      const onPreferencesSubmit = jest.fn();
      render(<PreferencesPage {...defaultProps} backendContent={audioOnlyContent} onPreferencesSubmit={onPreferencesSubmit} />);
      
      // Submit preferences first
      const submitButton = screen.getByText('Save Preferences to Continue');
      await userEvent.click(submitButton);
      
      expect(screen.queryByText('Test Video')).not.toBeInTheDocument();
      expect(screen.getAllByText('Test Audio')).toHaveLength(2); // One in subtitle, one in player
    });
  });

  describe('Video Controls', () => {
    test('renders video player with controls after preferences submitted', async () => {
      const onPreferencesSubmit = jest.fn();
      render(<PreferencesPage {...defaultProps} backendContent={mockBackendContent} onPreferencesSubmit={onPreferencesSubmit} />);
      
      // Submit preferences first
      const submitButton = screen.getByText('Save Preferences to Continue');
      await userEvent.click(submitButton);
      
      const videoElement = screen.getByTestId('video-player');
      expect(videoElement).toBeInTheDocument();
    });

    test('video has correct source URL after preferences submitted', async () => {
      const onPreferencesSubmit = jest.fn();
      render(<PreferencesPage {...defaultProps} backendContent={mockBackendContent} onPreferencesSubmit={onPreferencesSubmit} />);
      
      // Submit preferences first
      const submitButton = screen.getByText('Save Preferences to Continue');
      await userEvent.click(submitButton);
      
      const videoElement = screen.getByTestId('video-player');
      expect(videoElement).toHaveAttribute('src', 'https://example.com/video.mp4');
    });
  });

  describe('Audio Controls', () => {
    test('renders audio player with controls after preferences submitted', async () => {
      const onPreferencesSubmit = jest.fn();
      render(<PreferencesPage {...defaultProps} backendContent={mockBackendContent} onPreferencesSubmit={onPreferencesSubmit} />);
      
      // Submit preferences first
      const submitButton = screen.getByText('Save Preferences to Continue');
      await userEvent.click(submitButton);
      
      const audioElements = screen.getAllByText('Test Audio');
      expect(audioElements.length).toBeGreaterThan(0);
      expect(screen.getByText('Click to play')).toBeInTheDocument();
    });
  });

  describe('Volume Controls', () => {
    test('renders volume sliders for both video and audio after preferences submitted', async () => {
      const onPreferencesSubmit = jest.fn();
      render(<PreferencesPage {...defaultProps} backendContent={mockBackendContent} onPreferencesSubmit={onPreferencesSubmit} />);
      
      // Submit preferences first
      const submitButton = screen.getByText('Save Preferences to Continue');
      await userEvent.click(submitButton);
      
      const volumeSliders = screen.getAllByRole('slider');
      expect(volumeSliders.length).toBeGreaterThanOrEqual(2); // At least video and audio sliders
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels for video controls after preferences submitted', async () => {
      const onPreferencesSubmit = jest.fn();
      render(<PreferencesPage {...defaultProps} backendContent={mockBackendContent} onPreferencesSubmit={onPreferencesSubmit} />);
      
      // Submit preferences first
      const submitButton = screen.getByText('Save Preferences to Continue');
      await userEvent.click(submitButton);
      
      expect(screen.getByLabelText('Video volume')).toBeInTheDocument();
    });

    test('has proper ARIA labels for audio controls after preferences submitted', async () => {
      const onPreferencesSubmit = jest.fn();
      render(<PreferencesPage {...defaultProps} backendContent={mockBackendContent} onPreferencesSubmit={onPreferencesSubmit} />);
      
      // Submit preferences first
      const submitButton = screen.getByText('Save Preferences to Continue');
      await userEvent.click(submitButton);
      
      expect(screen.getByLabelText('Audio volume')).toBeInTheDocument();
    });

    test('video element has proper attributes after preferences submitted', async () => {
      const onPreferencesSubmit = jest.fn();
      render(<PreferencesPage {...defaultProps} backendContent={mockBackendContent} onPreferencesSubmit={onPreferencesSubmit} />);
      
      // Submit preferences first
      const submitButton = screen.getByText('Save Preferences to Continue');
      await userEvent.click(submitButton);
      
      const videoElement = screen.getByTestId('video-player');
      expect(videoElement).toHaveAttribute('src');
    });
  });

  describe('Responsive Design', () => {
    test('renders correctly on different screen sizes', () => {
      render(<PreferencesPage {...defaultProps} backendContent={mockBackendContent} />);
      
      // Check that the layout containers are present
      const mainContainer = screen.getByText('Customize Your Reading Experience').closest('div');
      expect(mainContainer).toBeInTheDocument();
      
      // Check that sections are properly structured
      expect(screen.getByText('📚 Reading Preferences')).toBeInTheDocument();
      expect(screen.getByText('Personalized Content Available')).toBeInTheDocument();
    });
  });
}); 
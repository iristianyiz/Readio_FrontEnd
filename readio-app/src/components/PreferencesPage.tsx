import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
  Slider,
  IconButton as MuiIconButton,
  Divider,
} from '@mui/material';
import { 
  Logout, 
  Book, 
  Psychology, 
  TrendingUp, 
  PlayArrow, 
  Pause, 
  VolumeUp, 
  VolumeOff,
  VideoLibrary,
  Headphones
} from '@mui/icons-material';

interface User {
  email: string;
  preferences?: {
    genres: string[];
    moods: string[];
    readingGoal: string;
  };
}

interface BackendContent {
  videoUrl?: string;
  audioUrl?: string;
  videoTitle?: string;
  audioTitle?: string;
  isVideoAvailable: boolean;
  isAudioAvailable: boolean;
}

interface PreferencesPageProps {
  user: User | null;
  onPreferencesSubmit: (preferences: {
    genres: string[];
    moods: string[];
    readingGoal: string;
  }) => void;
  onLogout: () => void;
  backendContent?: BackendContent;
}

const genres = [
  'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction',
  'Fantasy', 'Biography', 'History', 'Self-Help', 'Business',
  'Technology', 'Philosophy', 'Poetry', 'Drama', 'Comedy',
  'Thriller', 'Horror', 'Adventure', 'Travel', 'Cooking'
];

const moods = [
  'Inspired', 'Relaxed', 'Focused', 'Curious', 'Motivated',
  'Calm', 'Energetic', 'Thoughtful', 'Amused', 'Serious',
  'Optimistic', 'Reflective', 'Adventurous', 'Peaceful', 'Excited'
];

const readingGoals = [
  {
    id: 'expand-knowledge',
    title: 'Expand Knowledge',
    description: 'I want to learn new topics or deepen my understanding.',
    icon: <Book />
  },
  {
    id: 'improve-skills',
    title: 'Improve Skills',
    description: 'I\'m reading to enhance professional or personal abilities.',
    icon: <TrendingUp />
  },
  {
    id: 'relaxation',
    title: 'Read for Relaxation',
    description: 'I\'m looking for stories or content that help me unwind.',
    icon: <Psychology />
  },
  {
    id: 'stay-informed',
    title: 'Stay Informed',
    description: 'I want to keep up with current events, trends, or innovations.',
    icon: <TrendingUp />
  },
  {
    id: 'build-habit',
    title: 'Build a Reading Habit',
    description: 'I\'m working on making regular reading part of my routine.',
    icon: <Book />
  }
];

const PreferencesPage: React.FC<PreferencesPageProps> = ({
  user,
  onPreferencesSubmit,
  onLogout,
  backendContent
}) => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    user?.preferences?.genres || []
  );
  const [selectedMoods, setSelectedMoods] = useState<string[]>(
    user?.preferences?.moods || []
  );
  const [selectedReadingGoal, setSelectedReadingGoal] = useState<string>(
    user?.preferences?.readingGoal || ''
  );
  const [showSuccess, setShowSuccess] = useState(false);

  // Video and Audio state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [videoVolume, setVideoVolume] = useState(50);
  const [audioVolume, setAudioVolume] = useState(50);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  
  // Track whether preferences have been submitted
  const [preferencesSubmitted, setPreferencesSubmitted] = useState(false);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleMoodToggle = (mood: string) => {
    setSelectedMoods(prev =>
      prev.includes(mood)
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  };

  const handleSubmit = () => {
    if (selectedGenres.length === 0 || selectedMoods.length === 0 || !selectedReadingGoal) {
      return;
    }

    onPreferencesSubmit({
      genres: selectedGenres,
      moods: selectedMoods,
      readingGoal: selectedReadingGoal,
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setPreferencesSubmitted(true);
  };

  const isFormValid = selectedGenres.length > 0 && selectedMoods.length > 0 && selectedReadingGoal;

  // Video and Audio handlers
  const handleVideoPlayPause = () => {
    if (videoRef) {
      if (isVideoPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const handleAudioPlayPause = () => {
    if (audioRef) {
      if (isAudioPlaying) {
        audioRef.pause();
      } else {
        audioRef.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  const handleVideoVolumeChange = (event: Event, newValue: number | number[]) => {
    const volume = newValue as number;
    setVideoVolume(volume);
    if (videoRef) {
      videoRef.volume = volume / 100;
    }
  };

  const handleAudioVolumeChange = (event: Event, newValue: number | number[]) => {
    const volume = newValue as number;
    setAudioVolume(volume);
    if (audioRef) {
      audioRef.volume = volume / 100;
    }
  };

  const handleVideoMute = () => {
    if (videoRef) {
      videoRef.muted = !isVideoMuted;
      setIsVideoMuted(!isVideoMuted);
    }
  };

  const handleAudioMute = () => {
    if (audioRef) {
      audioRef.muted = !isAudioMuted;
      setIsAudioMuted(!isAudioMuted);
    }
  };

  // Set up video and audio refs when backend content changes
  useEffect(() => {
    if (backendContent?.videoUrl && videoRef) {
      videoRef.src = backendContent.videoUrl;
      videoRef.volume = videoVolume / 100;
    }
    if (backendContent?.audioUrl && audioRef) {
      audioRef.src = backendContent.audioUrl;
      audioRef.volume = audioVolume / 100;
    }
  }, [backendContent, videoRef, audioRef, videoVolume, audioVolume]);

  return (
    <Box>
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Readio - Reading Preferences
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, {user?.email}
          </Typography>
          <IconButton color="inherit" onClick={onLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Preferences saved successfully!
        </Alert>
      )}

      <Typography variant="h4" component="h1" gutterBottom align="center">
        Customize Your Reading Experience
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Help us recommend the perfect books for you by selecting your preferences
      </Typography>

      {/* Section 1: Reading Preferences */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 3 }}>
          📚 Reading Preferences
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Genres and Moods Section */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            {/* Genres Section */}
            <Box sx={{ flex: 1 }}>
              <Paper elevation={2} sx={{ p: 3, height: 'fit-content' }}>
                <Typography variant="h6" gutterBottom>
                  What genres interest you?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Select all that apply (minimum 1)
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {genres.map((genre) => (
                    <Chip
                      key={genre}
                      label={genre}
                      onClick={() => handleGenreToggle(genre)}
                      color={selectedGenres.includes(genre) ? 'primary' : 'default'}
                      variant={selectedGenres.includes(genre) ? 'filled' : 'outlined'}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Box>
                {selectedGenres.length > 0 && (
                  <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                    Selected: {selectedGenres.length} genre(s)
                  </Typography>
                )}
              </Paper>
            </Box>

            {/* Moods Section */}
            <Box sx={{ flex: 1 }}>
              <Paper elevation={2} sx={{ p: 3, height: 'fit-content' }}>
                <Typography variant="h6" gutterBottom>
                  What mood are you usually in when reading?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Select all that apply (minimum 1)
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {moods.map((mood) => (
                    <Chip
                      key={mood}
                      label={mood}
                      onClick={() => handleMoodToggle(mood)}
                      color={selectedMoods.includes(mood) ? 'primary' : 'default'}
                      variant={selectedMoods.includes(mood) ? 'filled' : 'outlined'}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Box>
                {selectedMoods.length > 0 && (
                  <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                    Selected: {selectedMoods.length} mood(s)
                  </Typography>
                )}
              </Paper>
            </Box>
          </Box>

          {/* Reading Goals Section */}
          <Box>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                What's your primary reading goal?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Choose the option that best describes why you read
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 2 
              }}>
                {readingGoals.map((goal) => (
                  <Card
                    key={goal.id}
                    sx={{
                      cursor: 'pointer',
                      border: selectedReadingGoal === goal.id ? 2 : 1,
                      borderColor: selectedReadingGoal === goal.id ? 'primary.main' : 'divider',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: 2,
                      },
                    }}
                    onClick={() => setSelectedReadingGoal(goal.id)}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Box sx={{ color: 'primary.main', mb: 1 }}>
                        {goal.icon}
                      </Box>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {goal.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {goal.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>
          </Box>

          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={!isFormValid}
              sx={{ px: 4, py: 1.5 }}
            >
              Save Preferences
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Section Separator */}
      {preferencesSubmitted && backendContent && (backendContent.isVideoAvailable || backendContent.isAudioAvailable) && (
        <>
          <Divider sx={{ my: 4, borderWidth: 2, borderColor: 'primary.main' }} />
          <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 3 }}>
            🎬 Personalized Content
          </Typography>
        </>
      )}

      {/* Section 2: Video and Audio Content */}
      {preferencesSubmitted && backendContent && (backendContent.isVideoAvailable || backendContent.isAudioAvailable) && (
        <Box sx={{ mb: 6 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <VideoLibrary sx={{ mr: 1, verticalAlign: 'middle' }} />
              Recommended Content
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enjoy personalized video and audio content based on your preferences
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
              {/* Video Section */}
              {backendContent.isVideoAvailable && backendContent.videoUrl && (
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {backendContent.videoTitle || 'Recommended Video'}
                  </Typography>
                  <Box sx={{ position: 'relative', mb: 2 }}>
                    <video
                      ref={setVideoRef}
                      data-testid="video-player"
                      style={{
                        width: '100%',
                        maxHeight: '300px',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                      onClick={handleVideoPlayPause}
                      onPlay={() => setIsVideoPlaying(true)}
                      onPause={() => setIsVideoPlaying(false)}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        }
                      }}
                      onClick={handleVideoPlayPause}
                    >
                      {isVideoPlaying ? (
                        <Pause sx={{ color: 'white', fontSize: 30 }} />
                      ) : (
                        <PlayArrow sx={{ color: 'white', fontSize: 30 }} />
                      )}
                    </Box>
                  </Box>
                  
                  {/* Video Controls */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MuiIconButton onClick={handleVideoPlayPause} color="primary">
                      {isVideoPlaying ? <Pause /> : <PlayArrow />}
                    </MuiIconButton>
                    <MuiIconButton onClick={handleVideoMute} color="primary">
                      {isVideoMuted ? <VolumeOff /> : <VolumeUp />}
                    </MuiIconButton>
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VolumeUp sx={{ fontSize: 20 }} />
                      <Slider
                        value={videoVolume}
                        onChange={handleVideoVolumeChange}
                        aria-label="Video volume"
                        size="small"
                        sx={{ width: 100 }}
                      />
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Audio Section */}
              {backendContent.isAudioAvailable && backendContent.audioUrl && (
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {backendContent.audioTitle || 'Recommended Audio'}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 3, 
                    border: '2px dashed',
                    borderColor: 'primary.main',
                    borderRadius: 2,
                    mb: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      backgroundColor: 'action.hover'
                    }
                  }} onClick={handleAudioPlayPause}>
                    <Headphones sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {backendContent.audioTitle || 'Audio Content'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Click to {isAudioPlaying ? 'pause' : 'play'}
                      </Typography>
                    </Box>
                    <MuiIconButton color="primary" size="large">
                      {isAudioPlaying ? <Pause /> : <PlayArrow />}
                    </MuiIconButton>
                  </Box>
                  
                  {/* Hidden audio element for actual playback */}
                  <audio
                    ref={setAudioRef}
                    data-testid="audio-player"
                    style={{ display: 'none' }}
                  />

                  {/* Audio Controls */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MuiIconButton onClick={handleAudioPlayPause} color="primary">
                      {isAudioPlaying ? <Pause /> : <PlayArrow />}
                    </MuiIconButton>
                    <MuiIconButton onClick={handleAudioMute} color="primary">
                      {isAudioMuted ? <VolumeOff /> : <VolumeUp />}
                    </MuiIconButton>
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VolumeUp sx={{ fontSize: 20 }} />
                      <Slider
                        value={audioVolume}
                        onChange={handleAudioVolumeChange}
                        aria-label="Audio volume"
                        size="small"
                        sx={{ width: 100 }}
                      />
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      )}

      {/* Placeholder for personalized content when not yet submitted */}
      {!preferencesSubmitted && backendContent && (backendContent.isVideoAvailable || backendContent.isAudioAvailable) && (
        <Box sx={{ mb: 6 }}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <VideoLibrary sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Personalized Content Available
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Save your reading preferences above to unlock personalized video and audio content tailored just for you!
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSubmit}
              disabled={!isFormValid}
              sx={{ px: 4, py: 1.5 }}
            >
              Save Preferences to Continue
            </Button>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default PreferencesPage; 
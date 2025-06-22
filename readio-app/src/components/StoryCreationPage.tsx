import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
} from '@mui/material';
import { 
  Logout, 
  Create, 
  CloudUpload, 
  ArrowBack,
  VideoLibrary,
  Description,
  Category,
  PlayArrow,
  Pause
} from '@mui/icons-material';

interface User {
  email: string;
  preferences?: {
    genres: string[];
    moods: string[];
    readingGoal: string;
  };
}

interface StoryCreationPageProps {
  user: User | null;
  onLogout: () => void;
  onBackToSelection: () => void;
}

const storyGenres = [
  'Fiction', 'Fantasy', 'Mystery', 'Romance', 'Science Fiction',
  'Adventure', 'Horror', 'Comedy', 'Drama', 'Historical Fiction',
  'Children\'s Story', 'Poetry', 'Short Story', 'Novel', 'Script'
];

const storyThemes = [
  'Adventure', 'Friendship', 'Love', 'Mystery', 'Fantasy',
  'Science', 'Nature', 'Family', 'Courage', 'Discovery',
  'Magic', 'Technology', 'Animals', 'Space', 'Time Travel'
];

const StoryCreationPage: React.FC<StoryCreationPageProps> = ({
  user,
  onLogout,
  onBackToSelection
}) => {
  const [storyTitle, setStoryTitle] = useState('');
  const [storyDescription, setStoryDescription] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [storyType, setStoryType] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleThemeToggle = (theme: string) => {
    setSelectedThemes(prev =>
      prev.includes(theme)
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    );
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Video uploaded:', file.name);
      setVideoFile(file);
      // Start processing simulation
      setIsProcessing(true);
      setProcessingProgress(0);
      console.log('Processing started');
      
      // Simulate processing progress
      const interval = setInterval(() => {
        setProcessingProgress((prev) => {
          const newProgress = prev + 10;
          console.log('Progress:', newProgress);
          if (newProgress >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            console.log('Processing completed');
            // Generate mock audio URL and set duration
            // For testing, using a real audio sample (in real app, this would be the actual AI-generated audio)
            setAudioUrl('https://www.soundjay.com/misc/sounds/bell-ringing-05.wav');
            setDuration(180); // 3 minutes in seconds
            console.log('Audio URL set:', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav');
            console.log('Duration set:', 180);
            console.log('isProcessing set to false');
            return 100;
          }
          return newProgress;
        });
      }, 500);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (!storyTitle || !storyDescription || selectedGenres.length === 0 || !storyType) {
      return;
    }

    // In a real app, this would submit the story data to a backend
    console.log('Story submission:', {
      title: storyTitle,
      description: storyDescription,
      genres: selectedGenres,
      themes: selectedThemes,
      type: storyType,
      videoFile: videoFile?.name
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const isFormValid = storyTitle && storyDescription && selectedGenres.length > 0 && storyType;

  // Handle audio time updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  return (
    <Box>
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

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Story created successfully! Your story is now being processed.
        </Alert>
      )}

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
        <span>✨</span>Create Your Own Stories<span>✨</span>
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
        Unleash your creativity and bring your stories to life
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Story Details Section */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Basic Story Information */}
          <Box sx={{ flex: 1 }}>
            <Paper elevation={2} sx={{ 
              p: 3, 
              height: 'fit-content',
              backgroundColor: '#e6f3ff', // Light blue background
              borderRadius: '20px'
            }}>
              <Typography variant="h6" gutterBottom>
                <Description sx={{ mr: 1, verticalAlign: 'middle' }} />
                Story Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Tell us about your story
              </Typography>
              
              <TextField
                fullWidth
                label="Story Title"
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                sx={{ mb: 3 }}
                required
              />
              
              <TextField
                fullWidth
                label="Story Description"
                value={storyDescription}
                onChange={(e) => setStoryDescription(e.target.value)}
                multiline
                rows={4}
                sx={{ mb: 3 }}
                required
              />

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Story Type</InputLabel>
                <Select
                  value={storyType}
                  label="Story Type"
                  onChange={(e) => setStoryType(e.target.value)}
                  required
                >
                  <MenuItem value="short-story">Short Story</MenuItem>
                  <MenuItem value="novel">Novel</MenuItem>
                  <MenuItem value="poem">Poem</MenuItem>
                  <MenuItem value="script">Script</MenuItem>
                  <MenuItem value="childrens-book">Children's Book</MenuItem>
                  <MenuItem value="fan-fiction">Fan Fiction</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Box>

          {/* Video Upload Section */}
          <Box sx={{ flex: 1 }}>
            <Paper elevation={2} sx={{ 
              p: 3, 
              height: 'fit-content',
              backgroundColor: '#e6f3ff', // Light blue background
              borderRadius: '20px'
            }}>
              <Typography variant="h6" gutterBottom>
                <VideoLibrary sx={{ mr: 1, verticalAlign: 'middle' }} />
                Video Upload
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upload a video to accompany your story (optional)
              </Typography>
              
              <Card
                sx={{
                  border: '2px dashed',
                  borderColor: videoFile ? 'success.main' : 'grey.300',
                  backgroundColor: videoFile ? 'success.50' : 'grey.50',
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderRadius: '15px',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.50',
                  },
                }}
                onClick={() => document.getElementById('video-upload')?.click()}
              >
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  style={{ display: 'none' }}
                />
                <CloudUpload sx={{ fontSize: 48, color: videoFile ? 'success.main' : 'grey.400', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {videoFile ? 'Video Uploaded!' : 'Click to Upload Video'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {videoFile 
                    ? `Selected: ${videoFile.name}` 
                    : 'MP4, MOV, AVI up to 100MB'
                  }
                </Typography>
              </Card>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center', fontStyle: 'italic' }}>
                Use AI to automatically analyze your video and generate a professional voiceover for a polished, engaging result.
              </Typography>
              
              {isProcessing && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Processing video & generating AI voiceover...
                    </Typography>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      {processingProgress}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={processingProgress} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      backgroundColor: 'grey.300',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        backgroundColor: 'primary.main',
                      }
                    }}
                  />
                </Box>
              )}

              {/* AI Voiceover Audio Player */}
              {audioUrl && !isProcessing && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
                    🎤 AI Voiceover Narration
                  </Typography>
                  
                  {/* Hidden audio element */}
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    preload="metadata"
                    style={{ display: 'none' }}
                  />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Play/Pause Button */}
                    <IconButton 
                      onClick={handlePlayPause}
                      sx={{ 
                        backgroundColor: 'primary.main', 
                        color: 'white',
                        '&:hover': { backgroundColor: 'primary.dark' }
                      }}
                    >
                      {isPlaying ? <Pause /> : <PlayArrow />}
                    </IconButton>
                    
                    {/* Time Display */}
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 45 }}>
                      {formatTime(currentTime)}
                    </Typography>
                    
                    {/* Progress Bar */}
                    <Box sx={{ flex: 1, mx: 2 }}>
                      <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={handleSeek}
                        style={{
                          width: '100%',
                          height: '6px',
                          borderRadius: '3px',
                          background: 'linear-gradient(to right, #1976d2 0%, #1976d2 ' + (currentTime / duration * 100) + '%, #e0e0e0 ' + (currentTime / duration * 100) + '%, #e0e0e0 100%)',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      />
                    </Box>
                    
                    {/* Duration */}
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 45 }}>
                      {formatTime(duration)}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>

        {/* Genres and Themes Section */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Genres Section */}
          <Box sx={{ flex: 1 }}>
            <Paper elevation={2} sx={{ 
              p: 3, 
              height: 'fit-content',
              backgroundColor: '#e6f3ff', // Light blue background
              borderRadius: '20px'
            }}>
              <Typography variant="h6" gutterBottom>
                <Category sx={{ mr: 1, verticalAlign: 'middle' }} />
                What genre is your story?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select all that apply (minimum 1)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {storyGenres.map((genre) => (
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

          {/* Themes Section */}
          <Box sx={{ flex: 1 }}>
            <Paper elevation={2} sx={{ 
              p: 3, 
              height: 'fit-content',
              backgroundColor: '#e6f3ff', // Light blue background
              borderRadius: '20px'
            }}>
              <Typography variant="h6" gutterBottom>
                <Create sx={{ mr: 1, verticalAlign: 'middle' }} />
                What themes does your story explore?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select all that apply (optional)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {storyThemes.map((theme) => (
                  <Chip
                    key={theme}
                    label={theme}
                    onClick={() => handleThemeToggle(theme)}
                    color={selectedThemes.includes(theme) ? 'secondary' : 'default'}
                    variant={selectedThemes.includes(theme) ? 'filled' : 'outlined'}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Box>
              {selectedThemes.length > 0 && (
                <Typography variant="caption" color="secondary" sx={{ mt: 1, display: 'block' }}>
                  Selected: {selectedThemes.length} theme(s)
                </Typography>
              )}
            </Paper>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBack />}
            onClick={onBackToSelection}
            sx={{ 
              px: 4, 
              py: 1.5,
              borderRadius: '25px',
              fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
              fontWeight: 500
            }}
          >
            Back to Selection
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<Create />}
            onClick={handleSubmit}
            disabled={!isFormValid}
            sx={{ 
              px: 4, 
              py: 1.5,
              borderRadius: '25px',
              fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
              fontWeight: 500
            }}
          >
            Create Story
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default StoryCreationPage; 
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
  LinearProgress,
  MenuItem,
  Chip,
} from '@mui/material';
import { 
  Logout, 
  CloudUpload, 
  PlayArrow, 
  Pause, 
  VolumeUp, 
  VolumeOff,
  Close,
  AutoAwesome,
  ArrowBack
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
  const [showDubPopup, setShowDubPopup] = useState(false);
  const [isDubPlaying, setIsDubPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
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
            setAudioUrl('https://www.soundjay.com/misc/sounds/bell-ringing-05.wav');
            setDuration(180); // 3 minutes in seconds
            return 100;
          }
          return newProgress;
        });
      }, 500);
    }
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

  const handleDubPlayPause = () => {
    if (videoRef.current && audioRef.current) {
      if (isDubPlaying) {
        videoRef.current.pause();
        audioRef.current.pause();
      } else {
        videoRef.current.play();
        audioRef.current.play();
      }
      setIsDubPlaying(!isDubPlaying);
    }
  };

  const handleDubSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value);
    if (videoRef.current && audioRef.current) {
      videoRef.current.currentTime = newTime;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleOpenDubPopup = () => {
    setShowDubPopup(true);
    setIsDubPlaying(false);
    setCurrentTime(0);
  };

  const handleCloseDubPopup = () => {
    setShowDubPopup(false);
    setIsDubPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // Handle audio time updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleAudioTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleAudioLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleAudioEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleAudioTimeUpdate);
    audio.addEventListener('loadedmetadata', handleAudioLoadedMetadata);
    audio.addEventListener('ended', handleAudioEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleAudioTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleAudioLoadedMetadata);
      audio.removeEventListener('ended', handleAudioEnded);
    };
  }, [audioUrl]);

  // Handle video time updates
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsDubPlaying(false);
      setCurrentTime(0);
    };

    const handleCanPlay = () => {
      console.log('Video can play, duration:', video.duration);
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [showDubPopup]);

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

  const handleAudioMuteToggle = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isAudioMuted;
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
                <AutoAwesome sx={{ mr: 1, verticalAlign: 'middle' }} />
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

              <TextField
                fullWidth
                label="Story Type"
                value={storyType}
                onChange={(e) => setStoryType(e.target.value)}
                select
                required
              >
                <MenuItem value="short-story">Short Story</MenuItem>
                <MenuItem value="novel">Novel</MenuItem>
                <MenuItem value="poem">Poem</MenuItem>
                <MenuItem value="script">Script</MenuItem>
                <MenuItem value="childrens-book">Children's Book</MenuItem>
                <MenuItem value="fan-fiction">Fan Fiction</MenuItem>
              </TextField>
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
                <AutoAwesome sx={{ mr: 1, verticalAlign: 'middle' }} />
                Video Upload
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upload a video to accompany your story (optional)
              </Typography>
              
              <Paper
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
              </Paper>
              
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
                    <Box>
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        style={{
                          width: '100%',
                          height: '8px',
                          borderRadius: '4px',
                          background: `linear-gradient(to right, #2c5aa0 0%, #2c5aa0 ${(currentTime / (duration || 1)) * 100}%, #ddd ${(currentTime / (duration || 1)) * 100}%, #ddd 100%)`,
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(currentTime)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(duration)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Duration */}
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 45 }}>
                      {formatTime(duration)}
                    </Typography>

                    {/* Audio Mute Button */}
                    <IconButton
                      onClick={handleAudioMuteToggle}
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': { backgroundColor: 'primary.dark' }
                      }}
                    >
                      {isAudioMuted ? <VolumeOff /> : <VolumeUp />}
                    </IconButton>
                  </Box>

                  {/* Dub Video Button */}
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleOpenDubPopup}
                    sx={{ 
                      mt: 2,
                      backgroundColor: '#2c5aa0',
                      borderRadius: '15px',
                      '&:hover': { backgroundColor: '#1e3a8a' }
                    }}
                  >
                    🎬 Watch Dubbed Video
                  </Button>
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
                <AutoAwesome sx={{ mr: 1, verticalAlign: 'middle' }} />
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
                <AutoAwesome sx={{ mr: 1, verticalAlign: 'middle' }} />
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
            startIcon={<AutoAwesome />}
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

      {/* Dubbed Video Popup */}
      <Dialog
        open={showDubPopup}
        onClose={handleCloseDubPopup}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            backgroundColor: '#e6f3ff',
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center',
          fontFamily: '"Lora", Georgia, "Times New Roman", serif',
          color: '#2c5aa0'
        }}>
          🎬 Dubbed Video with AI Voiceover
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ position: 'relative', mb: 2 }}>
            <video
              ref={videoRef}
              controls={false}
              style={{
                width: '100%',
                borderRadius: '15px',
                backgroundColor: '#000'
              }}
              onTimeUpdate={() => {
                if (videoRef.current) {
                  setCurrentTime(videoRef.current.currentTime);
                }
              }}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  setDuration(videoRef.current.duration);
                }
              }}
              onCanPlay={() => {
                if (videoRef.current) {
                  setDuration(videoRef.current.duration);
                }
              }}
            >
              <source src={videoFile ? URL.createObjectURL(videoFile) : ''} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Hidden audio element for AI voiceover */}
            <audio
              ref={audioRef}
              src={audioUrl || ''}
              style={{ display: 'none' }}
              onTimeUpdate={() => {
                if (audioRef.current) {
                  setCurrentTime(audioRef.current.currentTime);
                }
              }}
              onLoadedMetadata={() => {
                if (audioRef.current) {
                  setDuration(audioRef.current.duration);
                }
              }}
            />
          </Box>

          {/* Simple Controls */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Progress Bar */}
            <Box>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleDubSeek}
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '4px',
                  background: `linear-gradient(to right, #2c5aa0 0%, #2c5aa0 ${(currentTime / (duration || 1)) * 100}%, #ddd ${(currentTime / (duration || 1)) * 100}%, #ddd 100%)`,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {formatTime(currentTime)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatTime(duration)}
                </Typography>
              </Box>
            </Box>

            {/* Play/Pause Button */}
            <Button
              variant="contained"
              onClick={handleDubPlayPause}
              sx={{
                borderRadius: '25px',
                py: 1.5,
                fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                fontWeight: 500
              }}
            >
              {isDubPlaying ? '⏸️ Pause' : '▶️ Play'}
            </Button>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCloseDubPopup}
            sx={{
              borderRadius: '20px',
              px: 3,
              py: 1
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StoryCreationPage; 
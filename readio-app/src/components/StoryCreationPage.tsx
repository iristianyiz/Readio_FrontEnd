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
  ArrowBack,
  Facebook,
  Instagram
} from '@mui/icons-material';
import { API_CONFIG, apiRequest } from '../config/api';

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

  // Backend audio generation state
  const [audioGenerationError, setAudioGenerationError] = useState<string>('');
  const [isBackendProcessing, setIsBackendProcessing] = useState(false);
  const [backendAudioUrl, setBackendAudioUrl] = useState<string | null>(null);
  const [downloadedAudioBlob, setDownloadedAudioBlob] = useState<Blob | null>(null);

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
      
      // Start real backend processing
      generateAudioFromBackend(file);
    }
  };

  const generateAudioFromBackend = async (videoFile: File) => {
    setIsBackendProcessing(true);
    setProcessingProgress(0);
    setAudioGenerationError('');
    console.log('Starting backend audio generation...');

    try {
      // Create FormData to send video file
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('timestamp', new Date().toISOString());

      // Simulate progress updates while backend processes
      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => {
          const newProgress = prev + 10;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return 90; // Stop at 90% until backend responds
          }
          return newProgress;
        });
      }, 1000);

      // Make API call to backend for audio generation
      const response = await apiRequest(API_CONFIG.ENDPOINTS.AUDIO_GENERATION, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type for FormData, let browser set it
        }
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Backend audio generation response:', data);

      // Download audio from S3 and convert to blob URL
      if (data.audioUrl) {
        try {
          const blobUrl = await downloadAndPlayAudio(data.audioUrl);
          
          // Set progress to 100% and use downloaded audio
          setProcessingProgress(100);
          setBackendAudioUrl(data.audioUrl);
          setAudioUrl(blobUrl); // Use blob URL for playback
          setDuration(data.duration || 180);
          
          console.log('Audio downloaded and ready for playback');
        } catch (downloadError) {
          console.error('Error downloading audio from S3:', downloadError);
          setAudioGenerationError(`Audio download failed: ${downloadError instanceof Error ? downloadError.message : 'Unknown error'}`);
          
          // Fallback to demo audio
          setAudioUrl('/function2.wav');
          setDuration(180);
          setProcessingProgress(100);
        }
      } else {
        throw new Error('No audio URL received from backend');
      }

    } catch (error) {
      console.error('Error generating audio from backend:', error);
      
      // Set error message
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setAudioGenerationError('Request timed out. Please try again.');
        } else if (error.message.includes('Failed to fetch')) {
          setAudioGenerationError('Unable to connect to server. Please check your connection.');
        } else {
          setAudioGenerationError(`Audio generation failed: ${error.message}`);
        }
      } else {
        setAudioGenerationError('An unexpected error occurred during audio generation.');
      }

      // Fallback to demo audio
      console.log('Falling back to demo audio');
      setAudioUrl('/function2.wav');
      setDuration(180);
      setProcessingProgress(100);

    } finally {
      setIsBackendProcessing(false);
      setIsProcessing(false);
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

  // Social sharing functions
  const handleShareOnFacebook = () => {
    const shareUrl = 'https://www.facebook.com/sharer/sharer.php';
    const shareText = `Check out my AI-dubbed video created with Readio! 🎬✨`;
    const url = `${shareUrl}?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleShareOnInstagram = () => {
    // Instagram doesn't have a direct share URL, so we'll copy to clipboard
    const shareText = `Check out my AI-dubbed video created with Readio! 🎬✨\n\n#Readio #AIVideo #DubbedVideo #Creative`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Share text copied to clipboard! You can now paste it on Instagram.');
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Share text copied to clipboard! You can now paste it on Instagram.');
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Share text copied to clipboard! You can now paste it on Instagram.');
    }
  };

  // Function to download audio from S3 and convert to blob URL
  const downloadAndPlayAudio = async (downloadUrl: string): Promise<string> => {
    try {
      console.log('Downloading audio from S3:', downloadUrl);
      
      // Clean up previous blob URL if it exists
      if (audioUrl && audioUrl.startsWith('blob:')) {
        cleanupBlobUrl(audioUrl);
      }
      
      // Download the audio file
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }
      
      // Convert to blob
      const audioBlob = await response.blob();
      setDownloadedAudioBlob(audioBlob);
      
      // Create blob URL for playback
      const blobUrl = URL.createObjectURL(audioBlob);
      console.log('Audio downloaded and converted to blob URL:', blobUrl);
      
      return blobUrl;
    } catch (error) {
      console.error('Error downloading audio:', error);
      throw error;
    }
  };

  // Cleanup blob URLs when component unmounts or audio changes
  useEffect(() => {
    return () => {
      // Cleanup blob URLs to prevent memory leaks
      if (audioUrl && audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Cleanup function for blob URLs
  const cleanupBlobUrl = (url: string) => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
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
                      {isBackendProcessing 
                        ? processingProgress >= 90 
                          ? 'Downloading audio from S3...' 
                          : 'Processing video & generating AI voiceover with backend...' 
                        : 'Processing video & generating AI voiceover...'
                      }
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
                        backgroundColor: isBackendProcessing ? 'success.main' : 'primary.main',
                      }
                    }}
                  />
                  {isBackendProcessing && (
                    <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                      {processingProgress >= 90 
                        ? '📥 Downloading audio file...' 
                        : '🔗 Connected to backend server'
                      }
                    </Typography>
                  )}
                </Box>
              )}

              {audioGenerationError && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    {audioGenerationError}
                  </Typography>
                  <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                    Using demo audio for now. Your video will still be processed.
                  </Typography>
                </Alert>
              )}

              {/* AI Voiceover Audio Player */}
              {audioUrl && !isProcessing && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
                      🎤 AI Voiceover Narration
                    </Typography>
                    {backendAudioUrl ? (
                      <Chip 
                        label="✅ Downloaded Audio" 
                        size="small" 
                        color="success" 
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    ) : (
                      <Chip 
                        label="Demo Audio" 
                        size="small" 
                        color="warning" 
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    )}
                  </Box>
                  
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
                          background: `linear-gradient(to right,rgb(86, 131, 198) 0%,rgb(64, 111, 180) ${(currentTime / (duration || 1)) * 100}%, #ddd ${(currentTime / (duration || 1)) * 100}%, #ddd 100%)`,
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
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    width: '100%', 
                    mt: 3 
                  }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleOpenDubPopup}
                      sx={{ 
                        px: 4,
                        py: 2,
                        fontSize: '1.1rem',
                        backgroundColor: 'rgb(100, 149, 237)',
                        borderRadius: '25px',
                        fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                        fontWeight: 500,
                        boxShadow: '0 4px 12px rgba(44, 90, 160, 0.3)',
                        '&:hover': { 
                          backgroundColor: 'rgb(137, 207, 240)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 16px rgba(90, 132, 196, 0.4)',
                          transition: 'all 0.3s ease'
                        }
                      }}
                    >
                      🎬 Watch Your AI Dubbed Video!
                    </Button>
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
                py: 2.5,
                px: 4,
                fontSize: '1.1rem',
                fontFamily: '"Segoe UI", "TT Neoris", "Helvetica Neue", Arial, sans-serif',
                fontWeight: 500,
                background: 'linear-gradient(45deg, #FF6B6B 0%,rgb(83, 221, 212) 25%,rgb(75, 198, 226) 50%,rgb(157, 218, 189) 75%,rgb(255, 236, 172) 100%)',
                backgroundSize: '200% 200%',
                animation: 'gradientShift 3s ease infinite',
                boxShadow: '0 6px 20px rgba(255, 107, 107, 0.4)',
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.05)',
                  boxShadow: '0 8px 25px rgba(255, 107, 107, 0.6)',
                  transition: 'all 0.3s ease',
                  animation: 'gradientShift 1s ease infinite'
                },
                '@keyframes gradientShift': {
                  '0%': { backgroundPosition: '0% 50%' },
                  '50%': { backgroundPosition: '100% 50%' },
                  '100%': { backgroundPosition: '0% 50%' }
                }
              }}
            >
              {isDubPlaying ? '⏸️ Pause' : '▶️ Play'}
            </Button>

            {/* Social Sharing Buttons */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2, 
              mt: 2,
              pt: 5,
              borderTop: '1px solid rgba(173, 227, 86, 0.2)'
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#2c5aa0',
                  fontWeight: 600,
                  mb: 1,
                  textAlign: 'center',
                  fontSize: '1.3rem',
                  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                  textShadow: '0 2px 4px rgba(44, 90, 160, 0.1)'
                }}
              >
                ⭐ Share Your AI Dubbed Video: ⭐
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 2,
                flexWrap: 'wrap'
              }}>
                <Button
                  variant="contained"
                  startIcon={<Facebook />}
                  onClick={handleShareOnFacebook}
                  sx={{
                    backgroundColor: '#1877f2',
                    borderRadius: '20px',
                    px: 5,
                    py: 2.5,
                    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: '#166fe5',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(24, 119, 242, 0.4)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  Share on Facebook
                </Button>
                
                <Button
                  variant="contained"
                  startIcon={<Instagram />}
                  onClick={handleShareOnInstagram}
                  sx={{
                    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                    borderRadius: '20px',
                    px: 5,
                    py: 2.5,
                    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 500,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #e0852e 0%, #d55f37 25%, #c6223e 50%, #b71f5b 75%, #a7157a 100%)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(220, 39, 67, 0.4)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  Share on Instagram
                </Button>
              </Box>
            </Box>
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
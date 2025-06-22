import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { 
  Logout, 
  PlayArrow, 
  Pause,
  VolumeUp,
  VolumeOff,
  Book, 
  Psychology, 
  TrendingUp,
  ArrowBack,
  MenuBook
} from '@mui/icons-material';

interface User {
  email: string;
  preferences?: {
    genres: string[];
    moods: string[];
    readingGoal: string;
  };
}

interface RecommendationPageProps {
  user: User | null;
  onLogout: () => void;
  onBackToPreferences: () => void;
  saveMethod: 'server' | 'local' | null;
}

const readingGoalTitles = {
  'expand-knowledge': 'Expand Knowledge',
  'improve-skills': 'Improve Skills',
  'relaxation': 'Read for Relaxation',
  'stay-informed': 'Stay Informed',
  'build-habit': 'Build a Reading Habit',
  'foster-imagination': 'Foster Imagination & Creativity'
};

const RecommendationPage: React.FC<RecommendationPageProps> = ({
  user,
  onLogout,
  onBackToPreferences,
  saveMethod
}) => {
  const readingGoal = user?.preferences?.readingGoal;
  const genres = user?.preferences?.genres || [];
  const moods = user?.preferences?.moods || [];

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock audio URL - in real app this would come from backend
  const audioUrl = saveMethod === 'server' 
    ? 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' // Real audio from server
    : 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'; // Demo audio

  // Mock video URL - in real app this would come from backend
  const videoUrl = saveMethod === 'server'
    ? 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' // Real video from server
    : 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'; // Demo video

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Determine video content based on save method
  const getVideoContent = () => {
    if (saveMethod === 'server') {
      return {
        title: "📖 Personalized Book Recommendations Video",
        description: "Your AI-generated video based on your preferences",
        isRealVideo: true,
        videoUrl: "https://example.com/personalized-video.mp4", // This would be the real video URL from backend
        status: "✅ Real video from server"
      };
    } else {
      return {
        title: "📖 Book Recommendations Video (Demo)",
        description: "Sample video - preferences saved locally",
        isRealVideo: false,
        videoUrl: null,
        status: "⚠️ Demo video - server unavailable"
      };
    }
  };

  const videoContent = getVideoContent();

  // Audio player functions
  const handlePlayPause = () => {
    if (videoRef.current && audioRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        audioRef.current.pause();
      } else {
        // Ensure both video and audio start from the same time
        const currentTime = videoRef.current.currentTime;
        audioRef.current.currentTime = currentTime;
        
        // Start both simultaneously
        const playPromises = [
          videoRef.current.play(),
          audioRef.current.play()
        ];
        
        Promise.all(playPromises)
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('Error playing video/audio:', error);
            setIsPlaying(false);
          });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value);
    if (videoRef.current && audioRef.current) {
      videoRef.current.currentTime = newTime;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      
      // If currently playing, ensure both continue playing
      if (isPlaying) {
        const playPromises = [
          videoRef.current.play(),
          audioRef.current.play()
        ];
        
        Promise.all(playPromises).catch((error) => {
          console.error('Error resuming after seek:', error);
        });
      }
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

  // Handle video time updates and synchronization
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleVideoLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleVideoEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      // Reset video and audio to beginning
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    };

    const handleVideoCanPlay = () => {
      console.log('Video can play, duration:', video.duration);
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleVideoTimeUpdate);
    video.addEventListener('loadedmetadata', handleVideoLoadedMetadata);
    video.addEventListener('ended', handleVideoEnded);
    video.addEventListener('canplay', handleVideoCanPlay);

    return () => {
      video.removeEventListener('timeupdate', handleVideoTimeUpdate);
      video.removeEventListener('loadedmetadata', handleVideoLoadedMetadata);
      video.removeEventListener('ended', handleVideoEnded);
      video.removeEventListener('canplay', handleVideoCanPlay);
    };
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f8f6ff', // Soft lavender background
      fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      borderRadius: '20px',
      margin: '10px',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
    }}>
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
            Readio - Your Book Recommendations
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

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              color: '#2c5aa0', // Comfortable blue
              fontFamily: '"Lora", Georgia, "Times New Roman", serif',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
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
            <span>🩵</span>Your Personalized Book Recommendations<span>🩵</span>
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3,
              color: '#666666',
              fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive',
              fontWeight: 400,
              fontSize: '1.2rem',
              letterSpacing: '0.3px'
            }}
          >
            Based on your preferences, we've curated the perfect reading list for you
          </Typography>
          
          {/* User Preferences Summary */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Chip 
              label={`Goal: ${readingGoalTitles[readingGoal as keyof typeof readingGoalTitles] || 'Reading'}`}
              sx={{
                backgroundColor: '#fff3cd', // Soft yellow
                color: '#6495ED', // Comfortable blue text
                border: '2px solid #ffeaa7',
                fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                fontWeight: 500,
                borderRadius: '20px',
                '&:hover': {
                  backgroundColor: '#ffeaa7'
                }
              }}
            />
            <Chip 
              label={`${genres.length} Genres`}
              sx={{
                backgroundColor: '#fff3cd', // Soft yellow
                color: '#FF5733', // Comfortable red text
                border: '2px solidrgb(250, 233, 179)',
                fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                fontWeight: 500,
                borderRadius: '20px',
                '&:hover': {
                  backgroundColor: '#ffeaa7'
                }
              }}
            />
            <Chip 
              label={`${moods.length} Moods`}
              sx={{
                backgroundColor: '#fff3cd', // Soft yellow
                color: '#71BC78', 
                border: '2px solid #ffeaa7',
                fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                fontWeight: 500,
                borderRadius: '20px',
                '&:hover': {
                  backgroundColor: '#ffeaa7'
                }
              }}
            />
            <Chip 
              label={saveMethod === 'server' ? '✅ Server Saved' : '⚠️ Local Save'}
              sx={{
                backgroundColor: saveMethod === 'server' ? '#e8f5e8' : '#fff3e0',
                color: saveMethod === 'server' ? '#2e7d32' : '#f57c00',
                border: `2px solid ${saveMethod === 'server' ? '#4caf50' : '#ff9800'}`,
                fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                fontWeight: 500,
                borderRadius: '20px',
                '&:hover': {
                  backgroundColor: saveMethod === 'server' ? '#c8e6c9' : '#ffe0b2'
                }
              }}
            />
          </Box>
        </Box>

        {/* Video Section */}
        <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden', borderRadius: 3 }}>
          <Box sx={{ position: 'relative', backgroundColor: '#000' }}>
            {/* Video Placeholder */}
            <Box
              sx={{
                width: '100%',
                height: { xs: 300, sm: 400, md: 500 },
                backgroundColor: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: 'pointer',
                '&:hover .play-button': {
                  transform: 'scale(1.1)',
                }
              }}
            >
              {/* Real Video Element */}
              <video
                ref={videoRef}
                controls={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '15px'
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
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Video Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '15px',
                  pointerEvents: 'none'
                }}
              >
                <Typography 
                  variant="h4" 
                  color="white" 
                  sx={{ 
                    textAlign: 'center', 
                    px: 2,
                    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 500,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
                  }}
                >
                  {videoContent.title}
                </Typography>
              </Box>
              
              {/* Status Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  backgroundColor: saveMethod === 'server' ? '#4caf50' : '#ff9800',
                  color: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  zIndex: 3,
                }}
              >
                {saveMethod === 'server' ? '✅ LIVE' : '⚠️ DEMO'}
              </Box>
              
              {/* Synchronized Play Button */}
              <Box
                className="play-button"
                onClick={handlePlayPause}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s ease-in-out',
                  zIndex: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    transform: 'translate(-50%, -50%) scale(1.1)',
                  }
                }}
              >
                {isPlaying ? <Pause sx={{ fontSize: 40, color: '#1976d2' }} /> : <PlayArrow sx={{ fontSize: 40, color: '#1976d2' }} />}
              </Box>
            </Box>
            
            {/* Video Info */}
            <Box sx={{ p: 3 }}>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{
                  color: saveMethod === 'server' ? '#4caf50' : '#ff9800',
                  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 500
                }}
              >
                {videoContent.description}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 2,
                  color: '#f0f8ff',
                  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                  lineHeight: 1.6
                }}
              >
                {saveMethod === 'server' 
                  ? `Discover amazing books tailored to your interests in ${genres.slice(0, 3).join(', ')} 
                     ${genres.length > 3 ? ` and ${genres.length - 3} more genres` : ''}. 
                     Perfect for when you're feeling ${moods.slice(0, 2).join(' and ')}.`
                  : `This is a demo video. When the server is available, you'll see personalized content based on your preferences.`
                }
              </Typography>
              <Typography 
                variant="body2" 
                sx={{
                  color: saveMethod === 'server' ? '#4caf50' : '#ff9800',
                  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 500
                }}
              >
                {videoContent.status}
              </Typography>

              {/* Audio Player */}
              <Box sx={{ 
                mt: 3, 
                p: 2, 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: 2, 
                border: '1px solid rgba(255, 255, 255, 0.2)' 
              }}>
                <Typography variant="subtitle2" color="white" sx={{ mb: 1, fontWeight: 'bold' }}>
                  🎤 Synchronized Audio Narration
                </Typography>
                
                {/* Hidden audio element */}
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  preload="metadata"
                  style={{ display: 'none' }}
                />
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {/* Synchronized Status */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    px: 2,
                    py: 1,
                    borderRadius: '15px',
                    border: '1px solid rgba(76, 175, 80, 0.5)'
                  }}>
                    <Typography variant="body2" color="#4caf50" sx={{ fontWeight: 'bold' }}>
                      🔗 SYNCED
                    </Typography>
                  </Box>
                  
                  {/* Time Display */}
                  <Typography variant="body2" color="white" sx={{ minWidth: 45 }}>
                    {formatTime(currentTime)}
                  </Typography>
                  
                  {/* Progress Bar */}
                  <Box sx={{ flex: 1 }}>
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
                        background: `linear-gradient(to right, #2c5aa0 0%, #2c5aa0 ${(currentTime / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.3) ${(currentTime / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.3) 100%)`,
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
                        {formatTime(currentTime)}
                      </Typography>
                      <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
                        {formatTime(duration)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Duration */}
                  <Typography variant="body2" color="white" sx={{ minWidth: 45 }}>
                    {formatTime(duration)}
                  </Typography>

                  {/* Audio Mute Button */}
                  <IconButton
                    onClick={handleAudioMuteToggle}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#2c5aa0',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }
                    }}
                  >
                    {isAudioMuted ? <VolumeOff /> : <VolumeUp />}
                  </IconButton>
                </Box>
                
                <Typography variant="caption" color="rgba(255, 255, 255, 0.7)" sx={{ mt: 1, display: 'block' }}>
                  Use the play button above to control both video and audio together
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Book Recommendations Grid */}
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            mb: 3,
            color: '#2c5aa0', // Comfortable blue
            fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
            fontWeight: 600
          }}
        >
          🩵 Recommended Books
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 4 
        }}>
          {[1, 2, 3, 4, 5, 6].map((book) => (
            <Card key={book} sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}>
              <Box
                sx={{
                  height: 200,
                  background: `linear-gradient(45deg, #${Math.floor(Math.random()*16777215).toString(16)} 0%, #${Math.floor(Math.random()*16777215).toString(16)} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Book sx={{ fontSize: 60, color: 'white' }} />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    color: '#2c5aa0', // Comfortable blue
                    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 500
                  }}
                >
                  Sample Book {book}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 2,
                    color: '#666666',
                    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                    lineHeight: 1.5
                  }}
                >
                  A fascinating read that matches your interests in {genres[Math.floor(Math.random() * genres.length)]} 
                  and your {readingGoalTitles[readingGoal as keyof typeof readingGoalTitles] || 'reading'} goal.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {genres.slice(0, 2).map((genre) => (
                    <Chip 
                      key={genre} 
                      label={genre} 
                      size="small" 
                      variant="outlined" 
                      sx={{
                        fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                        borderRadius: '15px',
                        borderColor: '#ffeaa7',
                        color: '#666666'
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBack />}
            onClick={onBackToPreferences}
            sx={{ 
              px: 4, 
              py: 1.5,
              backgroundColor: '#ffffff', // White background
              color: '#2c5aa0', // Comfortable blue text
              borderColor: '#2c5aa0',
              fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
              fontWeight: 500,
              borderRadius: '25px',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                borderColor: '#1e3a8a'
              }
            }}
          >
            Back to Preferences
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<Book />}
            sx={{ 
              px: 4, 
              py: 1.5,
              backgroundColor: '#2c5aa0', // Comfortable blue
              fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
              fontWeight: 500,
              borderRadius: '25px',
              '&:hover': {
                backgroundColor: '#1e3a8a'
              }
            }}
          >
            View Full Reading List
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default RecommendationPage; 
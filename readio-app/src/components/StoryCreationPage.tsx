import React, { useState } from 'react';
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
} from '@mui/material';
import { 
  Logout, 
  Create, 
  CloudUpload, 
  ArrowBack,
  VideoLibrary,
  Description,
  Category
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
      setVideoFile(file);
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

  return (
    <Box>
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Readio - Create Your Own Stories
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
          Story created successfully! Your story is now being processed.
        </Alert>
      )}

      <Typography variant="h4" component="h1" gutterBottom align="center">
        Create Your Own Stories
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Unleash your creativity and bring your stories to life
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Story Details Section */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Basic Story Information */}
          <Box sx={{ flex: 1 }}>
            <Paper elevation={2} sx={{ p: 3, height: 'fit-content' }}>
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
            <Paper elevation={2} sx={{ p: 3, height: 'fit-content' }}>
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
            </Paper>
          </Box>
        </Box>

        {/* Genres and Themes Section */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Genres Section */}
          <Box sx={{ flex: 1 }}>
            <Paper elevation={2} sx={{ p: 3, height: 'fit-content' }}>
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
            <Paper elevation={2} sx={{ p: 3, height: 'fit-content' }}>
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
            sx={{ px: 4, py: 1.5 }}
          >
            Back to Selection
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<Create />}
            onClick={handleSubmit}
            disabled={!isFormValid}
            sx={{ px: 4, py: 1.5 }}
          >
            Create Story
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default StoryCreationPage; 
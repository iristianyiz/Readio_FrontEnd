# Readio - Reading Preferences App

A modern React.js web application built with Material UI that helps users customize their reading experience by selecting genres, moods, and reading goals.

## Features

### 🔐 Authentication
- **Sign In/Sign Up**: Toggle between sign-in and sign-up modes
- **Email & Password**: Secure authentication with email and password
- **Form Validation**: Real-time validation with error messages
- **Password Visibility**: Toggle password visibility for better UX

### 📚 Reading Preferences
- **Genre Selection**: Choose from 20 different genres including Fiction, Non-Fiction, Mystery, Romance, Science Fiction, and more
- **Mood Selection**: Select reading moods like Inspired, Relaxed, Focused, Curious, and others
- **Reading Goals**: Choose from 5 specific reading goals:
  - **Expand Knowledge**: Learn new topics or deepen understanding
  - **Improve Skills**: Enhance professional or personal abilities
  - **Read for Relaxation**: Find stories that help unwind
  - **Stay Informed**: Keep up with current events and trends
  - **Build a Reading Habit**: Make regular reading part of your routine

### 🎨 User Interface
- **Material UI Design**: Modern, responsive design using Material UI components
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive Elements**: Chips for multi-selection, cards for reading goals
- **Success Feedback**: Visual confirmation when preferences are saved
- **Navigation**: App bar with user info and logout functionality

## Technology Stack

- **React.js**: Frontend framework
- **TypeScript**: Type-safe JavaScript
- **Material UI**: UI component library
- **Emotion**: CSS-in-JS styling solution

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd readio-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/
│   ├── LoginPage.tsx      # Authentication component
│   └── PreferencesPage.tsx # Reading preferences component
├── App.tsx                # Main application component
├── index.tsx             # Application entry point
└── index.css             # Global styles
```

## Usage

1. **Authentication**: 
   - Use the tabs to switch between Sign In and Sign Up
   - Enter your email and password
   - For sign-up, confirm your password
   - Click the respective button to proceed

2. **Setting Preferences**:
   - Select genres that interest you (minimum 1)
   - Choose your reading moods (minimum 1)
   - Pick your primary reading goal
   - Click "Save Preferences" to confirm

3. **Navigation**:
   - Use the logout button in the top-right corner to sign out
   - Your preferences are saved and will persist during the session

## Customization

### Adding New Genres
Edit the `genres` array in `PreferencesPage.tsx`:
```typescript
const genres = [
  'Fiction', 'Non-Fiction', 'Mystery', 
  // Add your new genres here
];
```

### Adding New Moods
Edit the `moods` array in `PreferencesPage.tsx`:
```typescript
const moods = [
  'Inspired', 'Relaxed', 'Focused',
  // Add your new moods here
];
```

### Modifying Reading Goals
Edit the `readingGoals` array in `PreferencesPage.tsx`:
```typescript
const readingGoals = [
  {
    id: 'your-goal-id',
    title: 'Your Goal Title',
    description: 'Your goal description.',
    icon: <YourIcon />
  },
  // Add more goals here
];
```

## Future Enhancements

- Backend integration for persistent user data
- Book recommendations based on preferences
- Reading progress tracking
- Social features (sharing reading lists)
- Dark mode toggle
- Advanced preference settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.

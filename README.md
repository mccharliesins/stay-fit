# StayFit

A fitness tracking and workout management mobile application built with React Native and Expo.

## Features

- Home screen with quick access to workouts and profile
- Workout listing with sample workout data
- User profile management with editable fields
- BMI calculation based on user's height and weight
- Modern and clean UI design

## Technical Details

- Built with Expo SDK 52
- Uses React Navigation for screen navigation
- Implements a structured project organization

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
2. Install dependencies:

   ```
   npm install
   ```

   or

   ```
   yarn install
   ```

3. Start the development server:

   ```
   npm start
   ```

   or

   ```
   yarn start
   ```

4. Use the Expo Go app on your mobile device to scan the QR code, or run on an emulator.

## Project Structure

```
stayfit/
├── assets/            # Images, fonts, and other static assets
├── src/
│   ├── components/    # Reusable UI components
│   ├── screens/       # Screen components
│   ├── navigation/    # Navigation configuration
│   ├── utils/         # Utility functions and helpers
│   └── assets/        # App-specific assets
├── App.js             # Main application component
└── package.json       # Project dependencies and scripts
```

## Future Enhancements

- Add workout details screen
- Implement workout tracking functionality
- Add exercise library
- Integrate with health APIs
- Add user authentication
- Implement data persistence

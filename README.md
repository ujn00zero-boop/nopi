# SavingsTracker - Savings Monitoring App

A modern React application for tracking savings goals with Firebase integration.

## Features

- **User Authentication**: Secure login and registration with Firebase Auth
- **Multiple Savings Goals**: Create and manage various savings targets
- **Real-time Updates**: Live progress tracking with Firebase Firestore
- **Transaction Management**: Add deposits and withdrawals with detailed history
- **Visual Analytics**: Charts and progress indicators for better insights
- **Responsive Design**: Optimized for mobile and desktop devices

## Setup Instructions

1. **Firebase Configuration**:
   - Create a new Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Get your Firebase config and update `src/lib/firebase.ts`

2. **Firestore Security Rules**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /savingsGoals/{document} {
         allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
       }
       match /transactions/{document} {
         allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
       }
     }
   }
   ```

3. **Environment Setup**:
   - Install dependencies: `npm install`
   - Start development server: `npm run dev`

## Technologies Used

- React 18 with TypeScript
- Firebase (Auth & Firestore)
- Tailwind CSS for styling
- Recharts for data visualization
- Lucide React for icons
- React Router for navigation

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth)
├── hooks/             # Custom hooks for data management
├── lib/               # Firebase configuration
├── pages/             # Main application pages
├── types/             # TypeScript type definitions
└── main.tsx          # Application entry point
```
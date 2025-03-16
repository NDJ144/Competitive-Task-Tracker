# Task Level Up

A gamified task management application built with React, TypeScript, and Firebase. Complete daily tasks to gain experience points and level up your character!

## Features

- User authentication (signup/login)
- Daily task system with 4 tasks per day
- Experience points (EXP) system
- Level progression
- Character evolution based on level
- Progress tracking with visual progress bar

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Firebase account and project

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Create a new Firebase project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Copy your Firebase configuration from the Firebase Console
   - Update the configuration in `src/config/firebase.ts`

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Sign up for a new account or log in with existing credentials
2. Complete daily tasks to earn experience points
3. Level up your character by gaining enough experience points
4. Tasks reset daily, allowing for continuous progression

## Tech Stack

- React
- TypeScript
- Vite
- Firebase (Authentication & Firestore)
- Chakra UI
- React Router

## Contributing

Feel free to submit issues and enhancement requests!

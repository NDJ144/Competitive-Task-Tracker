# Task Level Up

A gamified task management application built with React, TypeScript, and Firebase. Complete daily tasks to gain experience points and level up your character!

### In order to access app, you can use the link below and create an account
 https://ziontasks.netlify.app/login
 <img width="965" alt="image" src="https://github.com/user-attachments/assets/fa8fa21a-7a47-4bf0-97be-953ee732c92f" />

### Then you will access the main page with a task view
<img width="1167" alt="image" src="https://github.com/user-attachments/assets/155f8c82-9938-4939-a4a8-6443f376a7ab" />

### If you sign in with a specific type of email, you get access to an admin dashboard to view specific users and assign tasks
<img width="1176" alt="image" src="https://github.com/user-attachments/assets/0d135c02-ee1d-4d53-b93b-077bd29ca53e" />


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



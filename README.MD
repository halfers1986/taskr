# Task Management Web App

## Project Overview
This is a full-stack task management web application that allows users to create, categorise, and manage tasks efficiently. The app provides different task types, including lists, notes, and to-dos, along with filtering and sorting, plus some visualisation of data.

## Tech Stack
- **Frontend:** HTML, CSS, Handlebars.js
- **Backend:** Node.js, Express
- **Database:** mySQL
- **Session Management:** express-session, Redis

## Installation & Setup

### Prerequisites
- Node.js installed

### Steps to Run Locally
1. Clone the repository:
   ```sh
   git clone `https://github.com/halfers1986/taskr`
   cd <repository-folder>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file with the required variables (e.g., session secret, database connection)
4. Run the application:
   ```sh
   npm start
   ```
5. Clone, install, and run the API node server (...)
6. Open the app in your browser (default: `http://localhost:3000`).

## Usage Instructions
- **Login/Register**
- **Create Tasks:** Choose task type (list, note, to-do) and add details.
- **Manage Tasks:** Edit, delete, or categorize tasks.
- **View Data** See visualisations and numbers on the status and makeup of your tasks

## Project Structure
```
├── public/        # Static files (CSS, JS, images)
│   ├── css/       # Stylesheets
│   ├── js/        # Client-side scripts
│   └── images/    # Icons and logos
├── routes/        # Express route handlers
├── views/         # Handlebars templates
│   └── partials/  # Reusable components
├── app.js         # Main server file
├── package.json   # Dependencies and scripts
└── README.md      # Documentation
```

## Known Issues & Future Improvements
- Enhance user authentication (OAuth)
- Optimize performance and UI responsiveness


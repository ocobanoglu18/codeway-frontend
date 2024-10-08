
![Ekran Resmi 2024-10-08 15 51 57](https://github.com/user-attachments/assets/0434ac92-87fa-4c93-836d-2939c9e8ee10)
![Ekran Resmi 2024-10-08 15 52 07](https://github.com/user-attachments/assets/8e9389e0-fa2d-4aad-a5fc-d657018b8356)
![Ekran Resmi 2024-10-08 15 52 17](https://github.com/user-attachments/assets/34e53968-df1f-497f-96d4-76c00c2811eb)


Codeway Frontend
This is the frontend repository for the Codeway project. It provides the user interface for managing application configurations, authentication, and user-related features. This frontend application is built with Vue 3 and integrates with Firebase for authentication and Axios for making API requests.

Table of Contents
Features
Installation
Environment Variables
Usage
Project Structure
Technologies Used
Contributing
License

Features
🔑 Firebase Authentication: Handles user sign-up, sign-in, and logout.
⚙️ Configuration Management: Add, update, and delete configurations from the dashboard.
📱 Responsive Design: Optimized for mobile and desktop views.
👤 User Profile Management: Display the logged-in user's email and a logout button.
📅 Sorting Configurations: Sort configurations by creation date.
🎉 Welcome Popup: Shows a welcome message when the page loads.

Installation
Clone the repository:

git clone https://github.com/ocobanoglu18/codeway-frontend.git
cd codeway-frontend
Install dependencies:

bash
npm install


Here’s the GitHub-friendly README written with the correct GitHub Markdown styling, including headings (#), lists (*), inline code, and other formatting.

Codeway Frontend
This repository contains the frontend of the Codeway project. It handles user authentication, configuration management, and user interface rendering. Built with Vue 3, it integrates Firebase for authentication and uses Axios to make API calls to the backend.

Table of Contents
Features
Installation
Environment Variables
Usage
Project Structure
Technologies Used
Contributing
License
Features
🔑 Firebase Authentication: Handles user sign-up, sign-in, and logout.
⚙️ Configuration Management: Add, update, and delete configurations from the dashboard.
📱 Responsive Design: Optimized for mobile and desktop views.
👤 User Profile Management: Display the logged-in user's email and a logout button.
📅 Sorting Configurations: Sort configurations by creation date.
🎉 Welcome Popup: Shows a welcome message when the page loads.
Installation
Clone the repository:

bash
Kodu kopyala
git clone https://github.com/ocobanoglu18/codeway-frontend.git
cd codeway-frontend
Install dependencies:

bash
Kodu kopyala
npm install


Environment Variables
You will need to create a .env file in the root of your project to configure Firebase and other environment variables. Below is an example of what your .env file should contain:

VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
VITE_FIREBASE_APP_ID=your-firebase-app-id

Usage
Run the development server:
npm run dev

Build for production:
npm run build

Preview the production build:
npm run preview

Project Structure
codeway-frontend/
│
├── public/                         # Static assets (icons, images, etc.)
├── src/                            # Source files
│   ├── assets/                     # CSS, images, and other assets
│   ├── components/                 # Reusable Vue components
│   ├── pages/                      # Vue page components (Home, SignIn, SignUp)
│   ├── router/                     # Vue router setup
│   ├── App.vue                     # Root Vue component
│   ├── main.js                     # Entry point for the application
│   └── firebase.js                 # Firebase configuration
│
├── .env                            # Environment variables (not committed)
├── package.json                    # Project dependencies and scripts
└── vite.config.js                  # Vite configuration

Technologies Used
Vue 3 - JavaScript framework for building user interfaces
Firebase - Authentication and backend services
Axios - HTTP client for making API requests
Vite - Development build tool
Tailwind CSS (Optional) - Utility-first CSS framework for styling
Vue Router - Official router for Vue.js to manage page navigation
Contributing
We welcome contributions! Here’s how you can help:

Fork the repository.
Create a new branch (git checkout -b feature-branch).
Make your changes.
Commit your changes (git commit -m 'Add new feature').
Push to the branch (git push origin feature-branch).
Create a Pull Request.
License
This project is licensed under the MIT License. See the LICENSE file for details.




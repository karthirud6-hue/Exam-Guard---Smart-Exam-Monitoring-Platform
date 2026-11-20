Exam Guard – Smart Exam Monitoring Platform

📌 Project Overview

Exam Guard is a web-based Smart Exam Monitoring Platform designed to make online examinations more secure, organized, and efficient.

The system provides separate interfaces for Admins, Examiners, and Students to manage examinations, monitor exam activities, and track student performance.

It uses webcam-based face detection and approximate head movement monitoring to help identify potentially suspicious activities during online examinations.

🎯 Objectives

- Provide a secure and user-friendly online examination environment.
- Simplify examination creation and management.
- Monitor students during online examinations using webcam-based technology.
- Improve examination management and result tracking.

✨ Key Features

👨‍💼 Admin

- Admin dashboard for overall platform monitoring.
- View total students, examiners, and examinations.
- Manage student accounts.
- Manage examiner accounts.
- View reports and analytics.
- Monitor overall platform activities.
- Review examination performance.

👨‍🏫 Examiner

- Dedicated examiner dashboard.
- View total examinations.
- View the number of registered students.
- Track completed examinations.
- Create and manage examinations.
- Add and manage examination questions.
- View and review examination results.
- Manage examination activities and invitations.

👨‍🎓 Student

- Student registration and login.
- View available examinations.
- Read examination instructions.
- Attend online examinations.
- Navigate between questions.
- Mark questions for review.
- View examination results.

📷 Smart Exam Monitoring

- Webcam-based face detection.
- Face presence monitoring.
- Approximate head movement detection.
- Warning alerts for potentially suspicious movements.

⏱️ Examination Features

- Countdown timer.
- Automatic submission when time expires.
- Question navigation palette.
- Mark for review functionality.
- Result and score tracking.

🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- Face-api.js
- Browser Webcam API
- Git and GitHub
- LocalStorage (for frontend demo data)

📂 Project Structure

Exam-Guard---Smart-Exam-Monitoring-Platform/
│
├── frontend/
│   ├── Admin.html
│   ├── Examiner.html
│   ├── dashboard.html
│   ├── exam.html
│   ├── create-exam.html
│   ├── manage-exams.html
│   ├── manage-questions.html
│   ├── manage-users.html
│   ├── instructions.html
│   ├── register.html
│   ├── index.html
│   ├── webcam.html
│   ├── script.js
│   ├── style.css
│   └── models/
│
└── README.md

🚀 How to Run the Project

1. Clone the repository:
   
   git clone https://github.com/karthirud6-hue/Exam-Guard---Smart-Exam-Monitoring-Platform.git

2. Open the project folder in Visual Studio Code.

3. Open the "frontend" folder.

4. Run "index.html" using the VS Code Live Server extension.

5. Allow webcam access when prompted to test the face detection and monitoring features.

🔐 Important Notes

- Webcam access requires user permission.
- Face detection and head movement monitoring are intended to assist exam supervision.
- Head movement detection is approximate and should not be treated as definitive proof of malpractice.
- LocalStorage is currently used for frontend demonstration data.
- Some project functionality, including authentication and backend data management, may depend on backend services and configuration.

👥 Project Team

Developed as an academic project.

📄 License

This project is developed for educational purposes.

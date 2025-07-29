# CSIT128 Project - Internship Management System

A web-based internship management platform that connects students with companies for internship opportunities.

## Video Demonstration

Watch the project demo: [https://youtu.be/UMjRHRJV3no?si=W6-2pzPxWaOCTzSy](https://youtu.be/UMjRHRJV3no?si=W6-2pzPxWaOCTzSy)

## Features

### For Students
- User registration and authentication
- Create and manage student profiles
- Search for available internships
- Apply for internships
- Track application status

### For Companies
- Company registration and profile management
- Post and manage internship opportunities
- View and manage student applications
- Update application status

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL (using mysql2 driver)
- **Authentication**: Express Sessions

## Project Structure

```
├── client/                 # Frontend assets
│   ├── assets/
│   │   ├── css/           # Stylesheets
│   │   └── js/            # Client-side JavaScript
│   └── pages/             # HTML pages
├── server/                # Backend code
│   ├── database/          # Database configuration and queries
│   ├── middleware/        # Authentication middleware
│   ├── routes/           # API routes
│   └── utils/            # Utility functions
└── package.json          # Project dependencies
```

## Installation

1. Clone the repository
```bash
git clone https://github.com/CrazyFFester/Internship-Management-Website.git
```

2. Install dependencies
```bash
npm install
```
3. Start the server
```bash
node server/server.js
```

The server will start on port 8080 by default.

## Usage

1. Open your browser and navigate to `http://localhost:8080`
2. Register as either a student or company
3. Complete your profile setup
4. Students can search and apply for internships
5. Companies can post internships and manage applications

## Database Schema

The system uses the following main tables:
- `users` - User authentication
- `students` - Student profiles
- `companies` - Company profiles
- `internships` - Available internships
- `applications` - Student applications

## Contributing

This is a university project for CSIT128. Please follow the coding standards and submit pull requests for any improvements.

## License

This project is for educational purposes only.

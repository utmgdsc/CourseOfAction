# CourseOfAction



https://user-images.githubusercontent.com/48028572/195462790-aca666e9-45c5-49bd-b219-a034390a41b8.mp4

## Link to the deployed website: 

https://mcsapps.utm.utoronto.ca/coa/app/dashboard

## Purpose:

This application can be accessed via any browser on mobile and PC for UofT students to easily track courses, assessments and grades throughout their semester.

## Usage & Current Functionality:

You need to have a valid UofT account to use this application as we use SSO for authentication.

## API Documentation

If testing on deployed website then:

```
Base URL = https://mcsapps.utm.utoronto.ca/
```

Otherwise, if testing on localhost then:

```
Base URL = http://localhost:8989/
```

Note: All request headers must contain the Utorid(default behaviour for all MCS apps). The base URL will precede all the routes listed below.

### Routes

```
GET /coa/app/*
Purpose: Serve static files for the frontend app
Expected Data: None
Returns: HTML, CSS and JS files as requested
```

```
GET /coa/api/application-start
Purpose: Fetch courses for current user
Expected Data: None
Returns: Courses and User's notification preference
```

```
POST /coa/api/update-user-notification
Purpose: Setting notification preference for user
Expected Data: { "notification": 0/1 }
Returns: User data with updated values
```

```
POST /coa/api/add-course
Purpose: Creating a new course and add it for current user
Expected Data: Course data as a json object
Returns: {"message": "success/error message"}
```

```
POST /coa/api/delete-course
Purpose: Deletes the provided course if it exists for current user
Expected Data: Course code as a json object
Returns: {"message": "success/error message"}
```

```
POST /coa/api/update-course
Purpose: Updates data if course exists for current user (ex: familiarity, notification)
Expected Data: Course data as a json object
Returns: {"message": "success/error message"}
```

```
POST /coa/api/update-assessments
Purpose: Updates assessments for provided course if it exists for current user
Expected Data: Course data as a json object
Returns: {"message": "success/error message"}
```

```
POST /coa/api/parse-syllabus
Purpose: Allows syllabus upload for extracting assessment info
Expected Data: file upload as pdf
Returns: Parsed assessments as json or error message
```

## Install dependencies and run on your local machine

Nodejs and Python should be installed on your machine.
Clone the project onto your local machine.

```bash=1
git clone https://github.com/milindvishnoi/CourseOfAction
```

Install all the python packages and start backend server in development mode. Go into the backend folder and install all pip packages:

```bash=2
cd backend
pip install -r requirements.txt
FLASK_APP=app FLASK_ENV=development flask run -p 8989
```

For backend deployment
```bash=3
cd backend
pip install -r requirements.txt
flask run -p 8989
```

To install all the frontend dependencies and run the react application:

```bash=4
cd frontend
npm install
npm start
```

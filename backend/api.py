import datetime
import json
import pyrebase
from flask import Flask, jsonify, make_response, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
# Connect to Firebase Realtime DB
firebase = pyrebase.initialize_app(json.load(open('secrets.json')))
auth = firebase.auth()
# Authenticate Firebase tables
db = firebase.database()

@app.route("/")
def hello():
    return "Hello, welcome to api endpoint for CourseOfAction!"

@app.route('/api/get_courses', methods=["GET", "POST"])
def get_courses():
    """
    Function to retrieve all courses for the student
    """
    user = "UuT5Mb7uJKO8N6mTTv9LuyCexgl1"
    return make_response(jsonify(db.child('users').child(user).child("courses").get().val()), 200)


@app.route('/api/add_course', methods=["POST"])
@cross_origin()
def add_course():
    """
    Function to create a new course and add it for that specific user 
    """
    user = "UuT5Mb7uJKO8N6mTTv9LuyCexgl1"
    print(request.form)
    data = {
        "courseName": request.form.get('courseName'),
        "offering": request.form.get('offering'),
        "familarity": request.form.get('familarity'),
        "credit": request.form.get('credit'),
    }
    data["assessments"] = parse_assessments(request.form.get('assessments', []))
    if not (request.form.get('courseCode') and data['courseName']):
        return make_response(jsonify(message='Error missing required course information'), 400)
    try:
        db.child('users').child(user).child("courses").child(request.form['courseCode']).set(data)
        db.child('Courses').child(request.form['courseCode']).set(data)
        # auth.send_email_verification(user['idToken'])
        return jsonify(data)
    except:
        return make_response(jsonify(message='Error creating course'), 401)

def parse_assessments(assessments):
    """ This helper function parses the assessment received from frontend to firebase acceptable format
    """
    parsed = {}
    for i, assessment in enumerate(assessments, 1):
        cur = {}
        cur["deadline"] = assessment.get(deadline, datetime.date.today())
        cur["weight"] = assessment.get(weight, 0)
        cur["isCompleted"] = assessment.get(isCompleted, False)
        cur["mark"] = assessment.get(mark, 0)
        cur["reminder"] = assessment.get(reminder, None)
        cur["customReminder"] = assessment.get(customReminder, None)

        # Firebase keys cannot contain period '.'
        parsed[assessment.get(name, f"assessment{i}").replace(".", "").strip(',?!')] = cur
    return parsed

def generate_reminders(familiarity, assessments):
    """TODO: create this function to handle add and update course api
    Use the familiarity scale to set reminder dates for each assessment
    """
    return assessments


if __name__ == "__main__":
    app.run()

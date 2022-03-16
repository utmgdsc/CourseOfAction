import datetime
import json
import os
import uuid
import parser
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


def bad_request(mess: str):
    return make_response(jsonify(message=mess), 400)


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
    if not (request.json) or not(request.json.get('code', None) and request.json.get('name', None)):
        return make_response(jsonify(message='Error missing required course information'), 400)

    #make sure the course code is unique
    existing_course = db.child('users').child(user).child("courses").order_by_child("code").equal_to(request.json['code']).get().val()
    if existing_course:
        print(existing_course)
        return make_response(jsonify(message='Error course already exists'), 403)

    try:
        db.child('users').child(user).child("courses").child(request.json['code']).set(request.json)
        # TOOD: add this later
        # db.child('Courses').child(request.form['courseCode']).set(request.json)
        # auth.send_email_verification(user['idToken'])
        return jsonify(messge="success")
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


@app.route('/api/parse-assessments', methods=["POST"])
def parse_assessment():
    # get and save the file
    if 'file' not in request.files:
        return bad_request("Bad Request")
    file = request.files['file']
    if file.filename == '':
        return bad_request("File not attached")
    # create unique name for the file
    filename = uuid.uuid4()
    url = '/tmp' + os.sep + str(filename)
    # save file
    file.save(url)
    # parse assessments
    parsed_assessments = parser.extract_info(url)
    os.remove(url)
    # check if parsed correctly
    if isinstance(parsed_assessments, int):
        return bad_request("The syllabus format is not supported. Please enter your assessments manually.")
    return { "assessments": parsed_assessments}


if __name__ == "__main__":
    app.run() #debug=True for hot reload

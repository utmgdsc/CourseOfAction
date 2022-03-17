import datetime
import json
import pyrebase
import hashlib
from flask import Flask, jsonify, make_response, request, abort, send_from_directory
from flask_cors import CORS, cross_origin
import os
app = Flask(__name__, static_folder='build')
cors = CORS(app)

# Connect to Firebase Realtime DB
firebase = pyrebase.initialize_app(json.load(open('secrets.json')))
auth = firebase.auth()
# Authenticate Firebase tables
db = firebase.database()

def get_user(utorid):
    user = hashlib.sha256(utorid.encode("utf-8")).hexdigest()
    # check existing users
    user_exists = db.child("users").child(user).get()
    if not user_exists.val():
        # register user in firebase
        try:
            db.child("users").child(user).set({"name": request.headers["Http-Cn"], "email": request.headers["Http-Mail"], "courses": []})
        except:
            abort(401, description="Unable to create user") # redirect page since app is not accessible
    return user

@app.route("/coa/")
def index():
    # format_headers = lambda d: '\n'.join(k + ": " +v for k, v in d.items())
    # data = jsonify(data=(request.method, request.url, "\n\n"+format_headers(request.headers)))
    user = get_user(request.headers["Utorid"])
    # redirect user to the app 
    response = make_response()
    response.headers['location'] = "/coa/app/" 
    return response, 302

@app.route('/coa/app/', defaults={'path': ''})
@app.route("/coa/app/<path:path>")
def send_app(path):
    """
    Serve static files for the frontend app
    """
    user = get_user(request.headers["Utorid"])
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/coa/api/get-courses', methods=["GET", "POST"])
def get_courses():
    """
    Function to retrieve all courses for the student
    """
    user = get_user(request.headers["Utorid"])
    return make_response(jsonify(db.child('users').child(user).child("courses").get().val()), 200)

@app.route('/coa/api/add-course', methods=["POST"])
@cross_origin()
def add_course():
    """
    Function to create a new course and add it for that specific user 
    """
    user = get_user(request.headers["Utorid"])
    if not (request.json) or not(request.json.get('code', None)):
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

@app.errorhandler(500)
def app_error(e):
    return make_response("Application error! Please try again later!"), 500


if __name__ == "__main__":
    app.run(debug=True, port=8989)# for hot reload

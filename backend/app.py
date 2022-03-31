import json
import pyrebase
import uuid
import parser
import reminder
import hashlib
from flask import Flask, jsonify, make_response, request, abort, send_from_directory
from flask_cors import CORS, cross_origin
from flask_apscheduler import APScheduler
import os
app = Flask(__name__) #, static_folder="build" for prod
cors = CORS(app)

# schedule process to send notifications 
scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()


# Connect to Firebase Realtime DB
firebase = pyrebase.initialize_app(json.load(open('secrets.json')))
# Authenticate Firebase tables
db = firebase.database()


@scheduler.task('cron', id='send_notif', hour='8')
def send_notification():
    """Schedule notifications to be sent out at 8 am for all users"""
    users = db.child("users").get().val()
    for _,info in users.items():
        if "courses" in info and info["courses"]:
            reminder.send_email(info.get("name"), info.get("email", "courseofactoin@gmail.com"), info["courses"])

def get_user(utorid):
    """
    Check the HTTP headers for user's utorid and return the hash for each user
    This will create a user profile in Firebase for first time use
    """
    if not utorid and app.debug: # for local dev we set it to a defined test user
        user = "UuT5Mb7uJKO8N6mTTv9LuyCexgl1"
    elif not utorid:
        abort(401, description="User not authenticated") 
    else:
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
    # code above will print all request header for future additions + security 
    
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
    user = get_user(request.headers.get("Utorid"))
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/coa/api/get-courses', methods=["GET", "POST"])
def get_courses():
    """
    Function to retrieve all courses for the student
    """
    user = get_user(request.headers.get("Utorid"))
    return make_response(jsonify(db.child('users').child(user).child("courses").get().val()), 200)

@app.route('/coa/api/add-course', methods=["POST"])
@cross_origin()
def add_course():
    """
    Function to create a new course and add it for that specific user 
    """
    user = get_user(request.headers.get("Utorid"))
    if not (request.json) or not(request.json.get('code', None)):
        return make_response(jsonify(message='Error missing required course information'), 400)

    #make sure the course code is unique
    existing_course = db.child('users').child(user).child("courses").order_by_child("code").equal_to(request.json['code']).get().val()
    if existing_course:
        return make_response(jsonify(message='Error course already exists'), 403)

    try:
        db.child('users').child(user).child("courses").child(request.json['code']).set(request.json)
        # TOOD: add this later
        # db.child('Courses').child(request.form['courseCode']).set(request.json)
        return jsonify(messge="success")
    except:
        return make_response(jsonify(message='Error creating course'), 401)

@app.route('/coa/api/update-assessments', methods=["POST"])
def update_assessment():
    """
    This function updates the assessments for each a specific user
    """
    # getting user from request
    user = get_user(request.headers.get("Utorid"))
    # checking request has everything needed
    if not(request.json.get('code', None)) or not (request.json.get('assessments', None)) or not (request.json.get('currMark', None)):
        return make_response(jsonify(message='Error missing required course information'), 400)
    
    req_code = request.json['code']
    req_assessments = request.json['assessments']
    req_currMark = request.json['currMark']
    existing_course = db.child('users').child(user).child("courses").order_by_child("code").equal_to(req_code).get().val()
    # checking if the course exists
    if not existing_course:
        return make_response(jsonify(message="Course you are trying to update doesn't exist"), 401)

    try: 
        # setting assessment info in the database
        db.child('users').child(user).child("courses").child(req_code).update({"assessments": req_assessments, "currMark": req_currMark})
        return jsonify(message="success")
    except:
        return make_response(jsonify(message='Error updating assessments'), 401)

@app.route('/coa/api/update-course', methods=["PATCH"])
def update_course():
    """
    This function updates the course's expected mark and familiarity
    """
    # getting user from request
    user = get_user(request.headers.get("Utorid"))
    # checking request has everything needed
    if not request.json.get('expectedMark', None) or not request.json.get('familiarity', None) or not request.json.get('code', None):
        return make_response(jsonify(message='Error missing required course information'), 400)
    
    req_code = request.json['code']
    req_expectedMark = request.json['expectedMark']
    req_familiarity = request.json['familiarity']
    existing_course = db.child('users').child(user).child("courses").order_by_child("code").equal_to(req_code).get().val()
    # checking if the course exists
    if not existing_course:
        return make_response(jsonify(message="Course you are trying to update doesn't exist"), 401)
    
    try: 
        # setting assessment info in the database
        db.child('users').child(user).child("courses").child(req_code).update({"familiarity": req_familiarity, "expectedMark": req_expectedMark})
        return jsonify(message="success")
    except:
        return make_response(jsonify(message='Error updating assessments'), 401)


@app.route('/coa/api/parse-syllabus', methods=["POST"])
@cross_origin()
def parse_syllabus():
    # get and save the file
    if 'file' not in request.files:
        return bad_request("Bad Request")
    file = request.files['file']
    if file.filename == '':
        return bad_request("File not attached")
    # create unique name for the file
    filename = uuid.uuid4()
    file_path = '/tmp' + os.sep + str(filename)
    # save file
    file.save(file_path)
    # parse assessments
    parsed_assessments = parser.extract_info(file_path)
    os.remove(file_path)
    # check if parsed correctly
    if isinstance(parsed_assessments, int):
        return bad_request("The syllabus format is not supported. Please enter your assessments manually.")
    return { "assessments": parsed_assessments }

@app.errorhandler(500)
def app_error(e):
    return make_response("Application error! Please try again later!"), 500

def bad_request(mess: str):
    return make_response(jsonify(message=mess), 400)

if __name__ == "__main__":
    app.run(debug=True, port=8989) # for hot reload
    
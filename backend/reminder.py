import json
import re
import pandas as pd
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# Compute the days which reminder column should match up to
todays_date = pd.to_datetime('today').floor('D')
next_xdays = [(str(todays_date + pd.offsets.Day(i-1)), str(todays_date + pd.offsets.Day(i+1))) for i in [0,2,4,6,8]]

def reminder_today(reminder, familiarity):
    """
    Use the familiarity scale as index to set reminder date(s)  
    """
    return any(day[0] < str(reminder)< day[1] for day in next_xdays[:6-familiarity])

def generate_content(courses):
    """ Generate reminders for each course to be included in the email
    """
    data = []
    for name, info in courses.items():
        familiarity = info.get('familiarity', 5)
        notification = info.get('notification', 1)
        if not notification: # Customize per course
            continue

        for assessment in info.get("assessments", []):
            if not assessment.get('reminder'):
                continue
            assessment["Course"] = name
            assessment["familiarity"] = familiarity 
            data.append(assessment)
    
    if not data:
        return
    
    df = pd.DataFrame(data)
    df["reminder"] = pd.to_datetime(df['reminder'], dayfirst=True).dt.date
    df["deadline"] = pd.to_datetime(df['deadline'], dayfirst=True)
    
    #logic to filter assessments
    res = df.loc[df.apply(lambda x: reminder_today(x["reminder"], x["familiarity"]), axis=1)].sort_values('deadline')
    if res.empty:
        return
    # format date string and rename columns for easier readability
    res['deadline'] = res['deadline'].dt.strftime('%d/%m/%Y')
    res.rename(columns={"deadline": "Due Date", "weight": "Weight (%)", "name": "Assessment Name"}, inplace=True)
    return res.to_html(index=False, na_rep="-", columns=["Course", "Assessment Name", "Weight (%)", "Due Date"]) 

def send_email(name, email, courses):
    """ Sends an email to user with a list of upcoming deadlines
    """
    html_df = generate_content(courses)
    print(html_df)
    if not html_df:
        return
    header = f"""
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN""http://www.w3.org/TR/html4/loose.dtd">
    <title>CourseOfAction Deadline Reminder</title>
    <body style="font-family: Roboto; margin: 0; padding: 0; background-color: #F2F2F2;">
    <table align="center" valign="top" bgcolor="#25477B"  width="100%" style="font-family: Roboto; color: #ffffff;">
        <tr><td><h2 align="center" style="font-family: Roboto;">COA Deadline Reminder</h2></tr></td>
    </table>
    <table bgcolor="#F2F2F2" border="0" width="100%" style="font-family: Roboto;padding-left: 5px">
        <tr style="font-family: Roboto;">
        <td valign="top" style="font-family: Roboto;">
                <h3 style="font-family: Roboto;">Hello {name},</h3>
                <p style="font-family: Roboto;">There are some upcoming deadlines for your current courses. Please make sure to set aside enough time to complete each assessment listed below:</p>
        </td></tr>"""

    message = Mail(
        from_email='courseofactoin@gmail.com',
        to_emails=email,
        subject='CourseOfAction Assessment Deadline Reminder',
        html_content= f'{header}'+ f"<tr>{pretty_df(html_df)}</tr></table></body>")
    try:
        sg = SendGridAPIClient(json.load(open("secret_sendgrid.json")).get("SENDGRID_API_KEY"))
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e)

def pretty_df(html_df=None):
        """
        Helper function for send_email that takes a simple html table and formats it adding inline css
        """
        if not (isinstance(html_df, str) and '<table' in html_df and '<th' in html_df):
            print("Invalid parameter html_df, does not contain correct tags for html table")
            return None
        
        th_style = '<th style="text-align: center; border: 2px solid #000000; padding: 8px 8px; font-size: 17px; color: #FFFFFF;">'
        td_style = '<td style="text-align: center; border: 2px solid #000000; padding: 8px 8px;">'
        str_out = '<table align="left" style="font-family: Roboto; border: 2px solid #000000; border-collapse: collapse;' \
                  'width: 500px;"><thead align="left" style="background: #0B6FA4;">'
        header_start = html_df.index('<', html_df.index('thead'))
        header_end = html_df.index('</thead>') + len('</thead>')
        str_out += re.sub(r'<th.*?>', th_style, html_df[header_start:header_end])
        html_df = re.sub(r'<td.*?>', td_style, html_df[header_end:])[1:]
        count = 0
        ind = html_df.index('<tr')
        while ind < html_df.index('</tbody>'):
            str_out += html_df[:ind]
            rest = html_df[html_df.index('>', ind):]
            if count:
                str_out += '<tr style="background: #D0E4F5; ">'
            else:
                str_out += '<tr>'
            html_df = rest[1:]
            if '<tr' not in rest:
                break
            ind = html_df.index('<tr')
            count = (count + 1) % 2

        return str_out + html_df


# # Simulate manually for testing
# import pyrebase
# # Connect to Firebase Realtime DB
# firebase = pyrebase.initialize_app(json.load(open('secrets.json')))
# # Authenticate Firebase tables
# db = firebase.database()
# users = db.child("users").get().val()
# for uid,info in users.items():
#     if "courses" in info and info["courses"] and "notification" in info and info["notification"]:
#         print(uid)
#         send_email(info.get("name"), "courseofactoin+test@gmail.com", info["courses"])
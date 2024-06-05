from flask import Flask, render_template, request, send_from_directory
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'files'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/thankyou')
def thank_you():
    return render_template('thankyou.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'audio' not in request.files:
        return 'No file part', 400
    file = request.files['audio']
    if file.filename == '':
        return 'No selected file', 400
    if file:
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)
        return 'File uploaded successfully', 200

@app.route('/questions.csv')
def questions_csv():
    return send_from_directory('static', 'questions.csv')

@app.route('/timer.json')
def timer_json():
    return send_from_directory('static', 'timer.json')

if __name__ == '__main__':
    app.run(debug=True)

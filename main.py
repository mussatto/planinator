# [START gae_python37_app]
from flask import Flask, send_from_directory, request
import requests
import urllib.parse

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 120

@app.route('/', methods = ['GET'])
def home():
    return send_from_directory('./', 'index.html')

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)

@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('css', path)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python37_app]
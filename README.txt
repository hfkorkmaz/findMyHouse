The application consists of two parts: frontend and backend. Each have to be separately started up.

To start up backend 
1-)Open command prompt inside the folder. Then cd into 'env/Scripts'. In here, type activate.bat. This will activate 
the python virtual environment. You can verify it by looking at the command line. It should look like this -> (env) C:\Dev\flasktutorial>

2-) Then cd back 2 levels. When you're at the same directory as start.py, run this command: set FLASK_APP=start.py
3-) Run this command: flask run
If you see this: Running on http://127.0.0.1:5000/ (Press CTRL+C to quit), that means that the server is on.
Note: if the server is running in another port than 5000, you'll have to change the url inside the Config.js file located in reacts/src

If these steps don't work, install python3.8 globally and use pip to install these packages: 
certifi==2019.11.28
chardet==3.0.4
Click==7.0
Flask==1.1.1
Flask-Cors==3.0.8
idna==2.8
itsdangerous==1.1.0
Jinja2==2.10.3
MarkupSafe==1.1.1
numpy==1.17.4
pandas==0.25.3
python-dateutil==2.8.1
pytz==2019.3
requests==2.22.0
six==1.13.0
urllib3==1.25.7
Werkzeug==0.16.0
xlrd==1.2.0

To start up the frontend
1-) Install Nodejs: https://nodejs.org/en/download/
2-) Open command prompt inside reactjs folder.
3-) Run: npm start
If there are issues with dependencies you can install them manually by running npm install packageName.
4-) localhost:3000 will open in the default browser.


Note: If any of the api keys are depreciated, you can change them in reactjs/src/Config.js (for google maps api key), 
and app/data.txt (Breezometer and foursquare api keys)




Hakkı Furkan Korkmaz
Reyhan Tosun
Ahmet Sait Küçük
Şevval Genç

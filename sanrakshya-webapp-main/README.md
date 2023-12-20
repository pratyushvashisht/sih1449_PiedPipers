# sanrakshya-webapp
Enterprise version of sanrakshya CLI


## Installation Steps
1. Git clone this repository
2. `cd` into the repository and open VS Code
3. Open terminal and split into 2

### Backend
1. Run `cd backend` in the 1st terminal to move to the backend directory
2. Make sure python is installed by running `python3 -V`
3. [Switch to a virtual env if you want] (optional, recommended)
5. Run `pip install -r requirements.txt` to install all the dependencies
6. Run `python manage.py migrate` to apply the models to database
7. Run `python manage.py createsuperuser` to create login credentials for the admin panel.
   You will be asked to enter username, email & password. These will be user for login at the admin panel. Remember it.
8. Finally, run `python manage.py runserver` to start the server

### Frontend
1. Run `cd frontend` in the 2nd terminal to move to the frontend directory
2. Make sure npm is installed by running `npm -v`
4. Run `npm install` to install all the dependencies
5. Run `npm start` to start the server


## Test SBOM Data
1. TargetName: `/sanrakshya-webapp`
2. PkgName: `setuptools`
3. PkgVersion: `44.0.0`
4. CPE: `cpe:2.3:a:python:setuptools:44.0.0:*:*:*:*:*:*`
5. Type: `python`

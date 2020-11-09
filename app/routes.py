from app import app

from flask import url_for, jsonify, request, session, redirect, render_template 
from sqlalchemy import or_
import sys
import json
from markupsafe import escape 
import random

from app.models import Test, Result


@app.route('/')
def hello_world():
		return render_template('start.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
	if request.method == 'POST':
		username = request.form.get('userName')
		password = request.form.get('password')
		authenticating = auth_login(username, password)
		if not authenticating['success']:
			return render_template('login.html', userMsg=authenticating['wrong_user'], 
				passwordMsg=authenticating['wrong_password'], enterMsg=authenticating['please_enter'], 
				something=authenticating['something'])
		else:
			return redirect(url_for('chess'))

	return render_template('login.html')

@app.route('/register', methods=['POST'])
def register():
	username = request.form.get('userName')
	password2 = request.form.get('repeatPassword')
	password = request.form.get('password')
	registering = auth_register(username, password, password2)
	if not registering['success']:
		return render_template('login.html', passwordMsgRe=registering['wrong_password'], enterMsgRe=registering['please_enter'], something=registering['something'], userExists=registering['user_exists'])
	else:
		return redirect(url_for('chess'))


@app.route('/start', methods=['POST'])
def start():
  req = request.form
  return redirect(url_for('test', name = req['name'], number = req['number'], operator = 'x'))

@app.route('/test/<name><int:number><operator>')
def test(name, number, operator):
  equations = {}
  prev = 0
  i = 1
  while i < 61:
    num = random.randint(0,12)
    if num == prev:
      continue
    direction = random.randint(0,2)
    if direction == 1:
      equations[i] = [number, operator, num]
    else:
      equations[i] = [num, operator, number]
    prev = num
    i += 1
  return render_template('math.html', number=number, equations=json.dumps(equations))


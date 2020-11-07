
from app import db #, app

import os

import json
from datetime import datetime

class Test(db.Model):
  __tablename__ = 'tests'
  id = db.Column(db.Integer, primary_key=True)
  test_type = db.Column(db.String(50))
  date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
  participant = db.Column(db.String('25'))
  score = db.Column(db.Integer, default=0)
  time_limit = db.Column(db.Integer, default=6000)
  length = db.Column(db.Integer)
  final_time = db.Column(db.Integer)

  def insert(self):
    db.session.add(self)
    db.session.commit()
  
  def update(self):
    db.session.commit()

  def delete(self):
    db.session.delete(self)
    db.session.commit()

  def format(self):
    return {
      'id': self.id,
      'date': str(self.date),
      'participant': self.participant,
      'score': self.score,
      'time_limit': self.time_limit,
      'length': self.length,
      'final_time': self.final_time
    }

class Result(db.Model):
  __tablename__ = 'results'
  id = db.Column(db.Integer, primary_key=True)
  attempt = db.Column(db.String(50))
  status = db.Column(db.Boolean)
  test_id = db.Column(db.Integer, db.ForeignKey('tests.id',  onupdate="CASCADE", ondelete="CASCADE"))
  tests = db.relationship('Test', backref=db.backref('tests', lazy=True))

  def insert(self):
    db.session.add(self)
    db.session.commit()
  
  def update(self):
    db.session.commit()

  def delete(self):
    db.session.delete(self)
    db.session.commit()

  def format(self):
    return {
      'id': self.id,
      'attempt': self.attempt,
      'status': self.status,
      'test_id': self.test_id
    }





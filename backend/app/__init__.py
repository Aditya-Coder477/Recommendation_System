from flask import Flask
from flask_cors import CORS
from app.student.routes import student_bp

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for frontend
    
    # Register blueprints
    app.register_blueprint(student_bp, url_prefix='/api/student')
    
    return app
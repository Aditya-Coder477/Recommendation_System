from flask import Blueprint, request, jsonify
from app.student.model import student_engine

student_bp = Blueprint('student', __name__)

@student_bp.route('/recommend', methods=['POST'])
def get_recommendations():
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['degreeLevel', 'fieldOfStudy', 'gpa', 'budget']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Process student data
        student_profile = {
            'degree_level': data.get('degreeLevel'),
            'field_of_study': data.get('fieldOfStudy'),
            'gpa': float(data.get('gpa')),
            'budget': data.get('budget'),
            'program_type': data.get('programType', 'any'),
            'destination_preference': data.get('destinationPreference', 'any'),
            'climate_preference': data.get('climatePreference', 'any'),
            'scholarship_interest': data.get('scholarshipInterest', False),
            'work_importance': data.get('workImportance', 'moderate'),
            'visa_importance': data.get('visaImportance', 'moderate')
        }
        
        # Get recommendations from ML model
        recommendations = student_engine.get_recommendations(student_profile)
        
        return jsonify({
            'success': True,
            'recommendations': recommendations,
            'count': len(recommendations)
        })
        
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

@student_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'student_recommendation'})
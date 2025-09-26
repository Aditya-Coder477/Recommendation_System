import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib
import os

class StudentRecommendationEngine:
    def __init__(self):
        self.model = None
        self.label_encoders = {}
        self.universities_df = self.load_universities_data()
        self.load_or_train_model()
    
    def load_universities_data(self):
        """Load university data from CSV (will be replaced with real database)"""
        # Sample data structure
        data = {
            'name': [
                'Stanford University', 'University of Toronto', 'Imperial College London',
                'University of Melbourne', 'Technical University of Munich',
                'Harvard University', 'MIT', 'University of Cambridge', 
                'National University of Singapore', 'University of Tokyo'
            ],
            'country': ['USA', 'Canada', 'UK', 'Australia', 'Germany', 
                       'USA', 'USA', 'UK', 'Singapore', 'Japan'],
            'ranking': [3, 18, 10, 33, 55, 1, 2, 5, 11, 25],
            'tuition_fee': [52000, 42000, 38000, 35000, 18000, 
                          55000, 53000, 39000, 32000, 15000],
            'programs': [
                'Computer Science,Data Science,Engineering',
                'Business Administration,Economics,Computer Science',
                'Engineering,Computer Science,Data Science',
                'Business Administration,Economics,Computer Science',
                'Engineering,Computer Science',
                'Computer Science,Medicine,Law',
                'Engineering,Computer Science,Physics',
                'Engineering,Computer Science,Economics',
                'Computer Science,Business,Engineering',
                'Engineering,Computer Science,Robotics'
            ],
            'acceptance_rate': [4.3, 43.0, 14.3, 70.0, 8.0, 4.7, 6.7, 21.0, 5.0, 34.0],
            'climate': ['temperate', 'cold', 'temperate', 'tropical', 'temperate',
                       'temperate', 'temperate', 'temperate', 'tropical', 'temperate'],
            'scholarship_availability': ['High', 'Medium', 'Medium', 'High', 'High',
                                        'High', 'High', 'Medium', 'Medium', 'Medium']
        }
        return pd.DataFrame(data)
    
    def load_or_train_model(self):
        """Load trained model or train a new one"""
        model_path = 'app/student/models/student_recommendation_model.pkl'
        
        if os.path.exists(model_path):
            self.model = joblib.load(model_path)
            print("✅ Loaded trained student recommendation model")
        else:
            self.train_model()
    
    def train_model(self):
        """Train the recommendation model with sample data"""
        # Create training data (in real scenario, this would be historical user data)
        X, y = self.create_training_data()
        
        # Train Random Forest model
        self.model = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=10)
        self.model.fit(X, y)
        
        # Save the model
        os.makedirs('app/student/models', exist_ok=True)
        joblib.dump(self.model, 'app/student/models/student_recommendation_model.pkl')
        print("✅ Trained and saved student recommendation model")
    
    def create_training_data(self):
        """Create synthetic training data (replace with real data later)"""
        # This is simplified - real implementation would use historical user preferences
        features = []
        targets = []
        
        for _, uni in self.universities_df.iterrows():
            # Simulate different student profiles and their preferences
            for gpa in [3.0, 3.5, 3.8, 4.0]:
                for budget in ['low', 'medium', 'high']:
                    feature_vector = self.create_feature_vector({
                        'gpa': gpa,
                        'budget': budget,
                        'field_of_study': 'Computer Science',
                        'destination_preference': 'any'
                    }, uni)
                    features.append(feature_vector)
                    
                    # Target: match score based on GPA, budget compatibility, etc.
                    match_score = self.calculate_match_score({
                        'gpa': gpa,
                        'budget': budget
                    }, uni)
                    targets.append(match_score)
        
        return np.array(features), np.array(targets)
    
    def create_feature_vector(self, student_data, university):
        """Convert student preferences and university data to feature vector"""
        features = []
        
        # GPA feature (normalized)
        features.append(student_data['gpa'] / 4.0)
        
        # Budget compatibility
        budget_map = {'low': 0, 'medium': 1, 'high': 2}
        student_budget = budget_map.get(student_data['budget'], 1)
        
        # University cost category (simplified)
        uni_cost = 0 if university['tuition_fee'] < 25000 else 1 if university['tuition_fee'] < 40000 else 2
        features.append(1.0 if student_budget >= uni_cost else 0.5)
        
        # Ranking preference (higher ranking better)
        features.append(1.0 - (university['ranking'] / 100))
        
        # Field of study match (simplified)
        field_match = 1.0 if student_data['field_of_study'].lower() in university['programs'].lower() else 0.3
        features.append(field_match)
        
        return features
    
    def calculate_match_score(self, student_data, university):
        """Calculate match score between student and university"""
        score = 50  # Base score
        
        # GPA adjustment
        gpa_score = (student_data['gpa'] / 4.0) * 30
        score += gpa_score
        
        # Budget compatibility
        budget_map = {'low': 0, 'medium': 1, 'high': 2}
        student_budget = budget_map.get(student_data['budget'], 1)
        uni_cost = 0 if university['tuition_fee'] < 25000 else 1 if university['tuition_fee'] < 40000 else 2
        
        if student_budget >= uni_cost:
            score += 15
        else:
            score -= 10
        
        # Ranking bonus
        if university['ranking'] <= 20:
            score += 10
        elif university['ranking'] <= 50:
            score += 5
        
        return min(score, 95)
    
    def get_recommendations(self, student_data):
        """Get university recommendations based on student profile"""
        recommendations = []
        
        for _, university in self.universities_df.iterrows():
            # Create feature vector for prediction
            features = self.create_feature_vector(student_data, university)
            predicted_score = self.model.predict([features])[0]
            
            # Ensure score is within reasonable bounds
            final_score = max(10, min(98, predicted_score))
            
            recommendation = {
                'name': university['name'],
                'country': university['country'],
                'match_score': round(final_score, 1),
                'ranking': university['ranking'],
                'tuition_fee': university['tuition_fee'],
                'programs': university['programs'].split(','),
                'acceptance_rate': university['acceptance_rate'],
                'climate': university['climate'],
                'scholarship_availability': university['scholarship_availability'],
                'image': f"https://images.unsplash.com/photo-15{hash(university['name']) % 100000000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            }
            recommendations.append(recommendation)
        
        # Sort by match score and return top 6
        recommendations.sort(key=lambda x: x['match_score'], reverse=True)
        return recommendations[:6]

# Global instance
student_engine = StudentRecommendationEngine()
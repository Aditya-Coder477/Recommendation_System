// Student Dashboard Specific JavaScript

// DOM Elements
let form, degreeLevel, fieldOfStudy, gpa, testType, testScoreContainer, testScore;
let englishTestType, englishTestContainer, englishTestScore, programType, budget;
let loadingSpinner, resultSection, resultsContainer;
let useRealAPI = false;


// Error message elements
let degreeLevelError, fieldOfStudyError, gpaError, testScoreError;
let englishTestError, programTypeError, budgetError;

document.addEventListener('DOMContentLoaded', async function() {
    initializeElements();
    setupEventListeners();
    
    // Check if backend API is available
    try {
        useRealAPI = await StudentAPI.healthCheck();
        console.log('Backend API available:', useRealAPI);
        
        if (useRealAPI) {
            console.log('✅ Using real ML-powered recommendations');
        } else {
            console.log('⚠️ Using mock data (backend not available)');
        }
    } catch (error) {
        console.log('❌ Backend API not available, using mock data');
        useRealAPI = false;
    }
});


function initializeElements() {
    // Form elements
    form = document.getElementById('recommendation-form');
    degreeLevel = document.getElementById('degree-level');
    fieldOfStudy = document.getElementById('field-of-study');
    gpa = document.getElementById('gpa');
    testType = document.getElementById('test-type');
    testScoreContainer = document.getElementById('test-score-container');
    testScore = document.getElementById('test-score');
    englishTestType = document.getElementById('english-test-type');
    englishTestContainer = document.getElementById('english-test-container');
    englishTestScore = document.getElementById('english-test-score');
    programType = document.getElementById('program-type');
    budget = document.getElementById('budget');
    
    // UI elements
    loadingSpinner = document.getElementById('loading-spinner');
    resultSection = document.getElementById('result-section');
    resultsContainer = document.getElementById('results-container');
    
    // Error elements
    degreeLevelError = document.getElementById('degree-level-error');
    fieldOfStudyError = document.getElementById('field-of-study-error');
    gpaError = document.getElementById('gpa-error');
    testScoreError = document.getElementById('test-score-error');
    englishTestError = document.getElementById('english-test-error');
    programTypeError = document.getElementById('program-type-error');
    budgetError = document.getElementById('budget-error');
}

function setupEventListeners() {
    // Handle test type selection
    if (testType) {
        testType.addEventListener('change', handleTestTypeChange);
    }
    
    // Handle English test type selection
    if (englishTestType) {
        englishTestType.addEventListener('change', handleEnglishTestTypeChange);
    }
    
    // Handle form submission
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

// Handle test type change
function handleTestTypeChange() {
    if (this.value === 'none') {
        testScoreContainer.style.display = 'none';
        testScore.removeAttribute('required');
    } else {
        testScoreContainer.style.display = 'block';
        testScore.setAttribute('required', 'true');
        
        // Update label and input constraints based on test type
        if (this.value === 'gre') {
            document.getElementById('test-score-label').textContent = 'GRE Score (260-340)';
            testScore.min = 260;
            testScore.max = 340;
            testScore.placeholder = '260-340';
        } else if (this.value === 'gmat') {
            document.getElementById('test-score-label').textContent = 'GMAT Score (200-800)';
            testScore.min = 200;
            testScore.max = 800;
            testScore.placeholder = '200-800';
        } else if (this.value === 'sat') {
            document.getElementById('test-score-label').textContent = 'SAT Score (400-1600)';
            testScore.min = 400;
            testScore.max = 1600;
            testScore.placeholder = '400-1600';
        }
    }
}

// Handle English test type change
function handleEnglishTestTypeChange() {
    if (this.value === 'none') {
        englishTestContainer.style.display = 'none';
        englishTestScore.removeAttribute('required');
    } else {
        englishTestContainer.style.display = 'block';
        englishTestScore.setAttribute('required', 'true');
        
        // Update label and input constraints based on test type
        if (this.value === 'toefl') {
            document.getElementById('english-test-label').textContent = 'TOEFL Score (0-120)';
            englishTestScore.min = 0;
            englishTestScore.max = 120;
            englishTestScore.step = 1;
            englishTestScore.placeholder = '0-120';
        } else if (this.value === 'ielts') {
            document.getElementById('english-test-label').textContent = 'IELTS Score (0-9)';
            englishTestScore.min = 0;
            englishTestScore.max = 9;
            englishTestScore.step = 0.5;
            englishTestScore.placeholder = '0-9';
        }
    }
}

// Handle form submission
// Replace the existing handleFormSubmit function
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (validateForm()) {
        // Show loading spinner, hide results
        loadingSpinner.style.display = 'block';
        resultSection.style.display = 'none';
        
        try {
            if (useRealAPI) {
                console.log('🔄 Fetching real recommendations from ML backend...');
                await generateRealResults();
            } else {
                console.log('🔄 Using mock data (simulating API call)...');
                // Simulate API delay for consistency
                await new Promise(resolve => setTimeout(resolve, 1500));
                generateMockResults();
            }
        } catch (error) {
            console.error('❌ Error generating results:', error);
            // Fallback to mock data
            generateMockResults();
            
            // Show error message but continue with mock data
            resultsContainer.innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Backend temporarily unavailable. Showing sample recommendations.
                </div>
                ${resultsContainer.innerHTML}
            `;
        } finally {
            // Hide loading spinner, show results
            loadingSpinner.style.display = 'none';
            resultSection.style.display = 'block';
        }
    }
}

// Form validation
function validateForm() {
    let isValid = true;
    
    // Reset error states
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
    
    // Validate degree level
    if (!validateRequiredField(degreeLevel, degreeLevelError)) {
        isValid = false;
    }
    
    // Validate field of study
    if (!validateRequiredField(fieldOfStudy, fieldOfStudyError)) {
        isValid = false;
    }
    
    // Validate GPA
    if (!validateNumberField(gpa, gpaError, 0, 4.0)) {
        isValid = false;
    }
    
    // Validate test score if test type is selected and not "none"
    if (testType.value && testType.value !== 'none') {
        if (!validateNumberField(testScore, testScoreError, testScore.min, testScore.max)) {
            isValid = false;
        }
    }
    
    // Validate English test score if test type is selected and not "none"
    if (englishTestType.value && englishTestType.value !== 'none') {
        if (!validateNumberField(englishTestScore, englishTestError, englishTestScore.min, englishTestScore.max)) {
            isValid = false;
        }
    }
    
    // Validate program type
    if (!validateRequiredField(programType, programTypeError)) {
        isValid = false;
    }
    
    // Validate budget
    if (!validateRequiredField(budget, budgetError)) {
        isValid = false;
    }
    
    return isValid;
}

// Function to generate mock results
function generateMockResults() {
    const formData = getFormData();
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // Sample university data
    const universities = [
        {
            name: 'Stanford University',
            location: 'United States',
            programs: ['Computer Science', 'Data Science', 'Engineering'],
            match: calculateMatchScore(formData, 'United States'),
            tuition: 52000,
            image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            ranking: 3,
            classSize: 'medium',
            weather: 'warm',
            workOpportunities: true
        },
        {
            name: 'University of Toronto',
            location: 'Canada',
            programs: ['Business Administration', 'Economics', 'Computer Science'],
            match: calculateMatchScore(formData, 'Canada'),
            tuition: 42000,
            image: 'https://images.unsplash.com/photo-1528901166007-3784c7dd3653?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            ranking: 18,
            classSize: 'large',
            weather: 'cold',
            workOpportunities: true
        },
        {
            name: 'Imperial College London',
            location: 'United Kingdom',
            programs: ['Engineering', 'Computer Science', 'Data Science'],
            match: calculateMatchScore(formData, 'United Kingdom'),
            tuition: 38000,
            image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            ranking: 10,
            classSize: 'medium',
            weather: 'moderate',
            workOpportunities: true
        },
        {
            name: 'University of Melbourne',
            location: 'Australia',
            programs: ['Business Administration', 'Economics', 'Computer Science'],
            match: calculateMatchScore(formData, 'Australia'),
            tuition: 35000,
            image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            ranking: 33,
            classSize: 'large',
            weather: 'warm',
            workOpportunities: true
        },
        {
            name: 'Technical University of Munich',
            location: 'Germany',
            programs: ['Engineering', 'Computer Science'],
            match: calculateMatchScore(formData, 'Germany'),
            tuition: 18000,
            image: 'https://images.unsplash.com/photo-1596726895343-5b2f2b1b5ee5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            ranking: 55,
            classSize: 'small',
            weather: 'moderate',
            workOpportunities: true
        }
    ];
    
    // Filter and sort universities
    const filteredUniversities = filterUniversities(universities, formData);
    
    // Render results
    if (filteredUniversities.length === 0) {
        resultsContainer.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                No universities match your current criteria. Try adjusting your preferences.
            </div>
        `;
    } else {
        filteredUniversities.forEach(university => {
            const card = createResultCard(university, 'university');
            resultsContainer.appendChild(card);
        });
    }
}

function getFormData() {
    return {
        degreeLevel: degreeLevel.value,
        fieldOfStudy: fieldOfStudy.value,
        gpa: parseFloat(gpa.value),
        programType: programType.value,
        budget: budget.value,
        scholarshipInterest: document.getElementById('scholarship-interest').checked,
        languageProficiency: document.getElementById('language-proficiency').value,
        destinationPreference: document.getElementById('destination-preference').value,
        climatePreference: document.getElementById('climate-preference').value,
        workImportance: document.getElementById('work-importance').value,
        visaImportance: document.getElementById('visa-importance').value
    };
}

function calculateMatchScore(formData, country) {
    let score = 75; // Base score
    
    // Adjust based on destination preference
    if (formData.destinationPreference !== 'any') {
        const regionMatches = {
            'north-america': ['United States', 'Canada'],
            'europe': ['United Kingdom', 'Germany'],
            'australia': ['Australia'],
            'asia': ['Japan', 'Singapore'],
            'latin-america': ['Brazil', 'Mexico']
        };
        
        if (regionMatches[formData.destinationPreference]?.includes(country)) {
            score += 15;
        }
    }
    
    // Adjust based on budget
    if (formData.budget === 'low' && country === 'Germany') score += 10;
    if (formData.budget === 'high' && (country === 'United States' || country === 'United Kingdom')) score += 10;
    
    // Adjust based on language proficiency
    if (formData.languageProficiency === 'german' && country === 'Germany') score += 10;
    if (formData.languageProficiency === 'french' && country === 'Canada') score += 5;
    
    return Math.min(score, 98); // Cap at 98%
}

function filterUniversities(universities, formData) {
    let filtered = [...universities];
    
    // Filter by destination preference
    if (formData.destinationPreference && formData.destinationPreference !== 'any') {
        const regionMap = {
            'north-america': ['United States', 'Canada'],
            'europe': ['United Kingdom', 'Germany'],
            'australia': ['Australia'],
            'asia': ['Japan', 'Singapore'],
            'latin-america': ['Brazil', 'Mexico']
        };
        
        const allowedCountries = regionMap[formData.destinationPreference] || [];
        filtered = filtered.filter(uni => allowedCountries.includes(uni.location));
    }
    
    // Sort by match score
    return filtered.sort((a, b) => b.match - a.match);
}

// New function for real API calls
async function generateRealResults() {
    const formData = getFormData();
    
    try {
        const recommendations = await StudentAPI.getRecommendations(formData);
        displayRealResults(recommendations);
    } catch (error) {
        throw error; // Let the caller handle the error
    }
}

// Updated function to display real API results
function displayRealResults(recommendations) {
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    if (!recommendations || recommendations.length === 0) {
        resultsContainer.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                No universities match your current criteria. Try adjusting your preferences.
            </div>
        `;
        return;
    }
    
    recommendations.forEach(university => {
        const card = createUniversityCard(university);
        resultsContainer.appendChild(card);
    });
}

// Updated card creation function
function createUniversityCard(university) {
    const card = document.createElement('div');
    card.className = 'result-card';
    
    card.innerHTML = `
        <div class="row g-0">
            <div class="col-md-4">
                <img src="${university.image}" class="university-img" alt="${university.name}">
                <div class="match-score">${Math.round(university.match_score)}%</div>
            </div>
            <div class="col-md-8">
                <div class="p-3">
                    <h5>${university.name}</h5>
                    <p class="text-muted">
                        <i class="fas fa-map-marker-alt feature-icon"></i>${university.country}
                        <span class="ms-3"><i class="fas fa-trophy feature-icon"></i>Ranked #${university.ranking} globally</span>
                    </p>
                    
                    <div class="mb-2">
                        ${university.programs.map(program => `<span class="program-tag">${program.trim()}</span>`).join('')}
                    </div>
                    
                    <div class="d-flex justify-content-between mt-3">
                        <div>
                            <i class="fas fa-money-bill-wave feature-icon"></i>
                            <strong>Tuition:</strong> $${university.tuition_fee.toLocaleString()}/year
                        </div>
                        <button class="btn btn-outline-primary btn-sm">View Details</button>
                    </div>
                    
                    <div class="mt-2">
                        <small class="text-muted">
                            <i class="fas fa-chart-bar feature-icon"></i>
                            Acceptance: ${university.acceptance_rate}% • 
                            <i class="fas fa-graduation-cap feature-icon"></i>
                            ${university.scholarship_availability} Scholarships
                        </small>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return card;
}
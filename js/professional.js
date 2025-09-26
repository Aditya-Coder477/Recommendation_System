// Professional Dashboard Specific JavaScript

// DOM Elements
let professionalForm, loadingSpinner, resultSection, resultsContainer;

// Initialize the professional dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeProfessionalElements();
    setupProfessionalEventListeners();
});

function initializeProfessionalElements() {
    professionalForm = document.getElementById('professional-preferences-form');
    loadingSpinner = document.getElementById('loading-spinner');
    resultSection = document.getElementById('result-section');
    resultsContainer = document.getElementById('results-container');
}

function setupProfessionalEventListeners() {
    if (professionalForm) {
        professionalForm.addEventListener('submit', handleProfessionalFormSubmit);
    }
}

// Handle form submission
function handleProfessionalFormSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (validateProfessionalForm()) {
        showLoading(loadingSpinner, resultSection);
        
        // Simulate API call
        simulateAPICall(2000).then(() => {
            hideLoading(loadingSpinner, resultSection);
            generateProfessionalRecommendations();
        },2000);
    }
}

// Form validation
function validateProfessionalForm() {
    let isValid = true;
    
    // Reset error states
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
    
    // Validate required fields
    const requiredFields = [
        { field: document.getElementById('industry'), name: 'Industry' },
        { field: document.getElementById('job-role'), name: 'Job Role' },
        { field: document.getElementById('experience'), name: 'Experience' },
        { field: document.getElementById('skills'), name: 'Skills' },
        { field: document.getElementById('expected-salary'), name: 'Expected Salary' },
        { field: document.getElementById('cost-tolerance'), name: 'Cost Tolerance' },
        { field: document.getElementById('visa-preference'), name: 'Visa Preference' },
        { field: document.getElementById('work-life-balance'), name: 'Work-Life Balance' }
    ];
    
    requiredFields.forEach(({ field, name }) => {
        if (!field.value) {
            field.classList.add('is-invalid');
            isValid = false;
        }
    });
    
    return isValid;
}

// Function to generate professional recommendations
function generateProfessionalRecommendations() {
    const formData = getProfessionalFormData();
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // Sample country data for professionals
    const countries = [
        {
            name: 'United States',
            match: calculateProfessionalMatchScore(formData, 'United States'),
            image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            description: 'Global tech hub with highest salaries but competitive visa process.',
            industryDemand: {
                'tech': 'Very High',
                'healthcare': 'High',
                'finance': 'Very High',
                'engineering': 'High'
            },
            salaryRange: '$80,000 - $180,000',
            skills: ['JavaScript', 'Python', 'Machine Learning','Project management','Data Analysis'],
            averageSalary: 120000,
            costOfLiving: 'High',
            visaDifficulty: 'Hard',
            visaOptions: ['H-1B', 'L-1', 'O-1', 'EB-2/EB-3'],
            processingTime: '6-18 months',
            healthcare: 'Private (Employer-sponsored)',
            workLifeBalance: 'Medium',
            jobMarket: 'Very Competitive',
            culturalAdaptation: 'Moderate',
            prPath: '5+ years (Complex)',
            highlights: ['Highest salaries', 'Tech innovation hub', 'Diverse opportunities'],
            jobOpenings: [
                'Senior Software Engineer - Silicon Valley',
                'Data Scientist - New York',
                'Product Manager - Seattle'
            ],
            benefits: ['High earning potential', 'Career growth', 'Innovation ecosystem'],
            challenges: ['Visa competition', 'High cost of living', 'Work culture intensity']
        },
        {
            name: 'Germany',
            match: calculateProfessionalMatchScore(formData, 'Germany'),
            image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            description: 'Strong engineering and manufacturing base with excellent work-life balance.',
            industryDemand: {
                'tech': 'High',
                'engineering': 'Very High',
                'manufacturing': 'Very High',
                'healthcare': 'High'
            },
            salaryRange: '€45,000 - €85,000',
            skills: ['JavaScript', 'Python', 'Machine Learning','Project management','Data Analysis'],
            averageSalary: 65000,
            costOfLiving: 'Medium',
            visaDifficulty: 'Medium',
            visaOptions: ['Blue Card', 'Job Seeker Visa', 'Work Visa'],
            processingTime: '3-6 months',
            healthcare: 'Public (Excellent)',
            workLifeBalance: 'High',
            jobMarket: 'Stable',
            culturalAdaptation: 'Moderate',
            prPath: '21-33 months (Straightforward)',
            highlights: ['Strong engineering sector', 'Excellent work-life balance', 'Social benefits'],
            jobOpenings: [
                'Automotive Engineer - Munich',
                'Software Developer - Berlin',
                'Mechanical Engineer - Stuttgart'
            ],
            benefits: ['Work-life balance', 'Social security', 'PR pathway'],
            challenges: ['Language barrier', 'Bureaucracy', 'Tax rates']
        },
        {
            name: 'Canada',
            match: calculateProfessionalMatchScore(formData, 'Canada'),
            image: 'https://images.unsplash.com/photo-1519832979-6fa011b87667?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            description: 'Immigrant-friendly with straightforward PR process and good work-life balance.',
            industryDemand: {
                'tech': 'Very High',
                'healthcare': 'High',
                'finance': 'High',
                'education': 'Medium'
            },
            salaryRange: 'CAD$60,000 - CAD$120,000',
            averageSalary: 85000,
            skills: ['JavaScript', 'Python', 'Project Management', 'Data Analysis'],
            costOfLiving: 'Medium-High',
            visaDifficulty: 'Easy-Medium',
            visaOptions: ['Express Entry', 'PNP', 'Startup Visa', 'Work Permit'],
            processingTime: '6-12 months',
            healthcare: 'Public (Excellent)',
            workLifeBalance: 'High',
            jobMarket: 'Growing',
            culturalAdaptation: 'Easy',
            prPath: '6-18 months (Straightforward)',
            highlights: ['Immigrant-friendly', 'High quality of life', 'Tech growth'],
            jobOpenings: [
                'AI Researcher - Toronto',
                'Healthcare Professional - Vancouver',
                'FinTech Analyst - Montreal'
            ],
            benefits: ['PR pathway', 'Multicultural society', 'Work-life balance'],
            challenges: ['Cold winters', 'High housing costs', 'Competitive job market']
        },
        {
            name: 'Singapore',
            match: calculateProfessionalMatchScore(formData, 'Singapore'),
            image: 'https://images.unsplash.com/photo-1525624850166-bec5c40e7b67?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            description: 'Asian business hub with high salaries but very high cost of living.',
            industryDemand: {
                'finance': 'Very High',
                'tech': 'High',
                'consulting': 'High',
                'manufacturing': 'Medium'
            },
            salaryRange: 'SGD$70,000 - SGD$150,000',
            averageSalary: 100000,
            costOfLiving: 'Very High',
            visaDifficulty: 'Medium-Hard',
            visaOptions: ['Employment Pass', 'S Pass', 'EntrePass'],
            processingTime: '2-4 months',
            healthcare: 'Private (Excellent but expensive)',
            workLifeBalance: 'Medium',
            jobMarket: 'Competitive',
            culturalAdaptation: 'Easy',
            prPath: '2-3 years (Selective)',
            highlights: ['Financial hub', 'Strategic location', 'Low taxes'],
            jobOpenings: [
                'Investment Banker - CBD',
                'Tech Lead - Marina Bay',
                'Supply Chain Manager - Jurong'
            ],
            benefits: ['Low taxes', 'Safety', 'Business ecosystem'],
            challenges: ['High cost of living', 'Work pressure', 'Small country']
        },
        {
            name: 'Australia',
            match: calculateProfessionalMatchScore(formData, 'Australia'),
            image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            description: 'High quality of life with strong demand for skilled professionals.',
            industryDemand: {
                'healthcare': 'Very High',
                'tech': 'High',
                'engineering': 'High',
                'education': 'High'
            },
            salaryRange: 'AUD$70,000 - AUD$140,000',
            averageSalary: 95000,
            costOfLiving: 'High',
            visaDifficulty: 'Medium',
            visaOptions: ['Skilled Independent Visa', 'Employer Sponsorship', 'Global Talent'],
            processingTime: '6-12 months',
            healthcare: 'Public (Excellent)',
            workLifeBalance: 'High',
            jobMarket: 'Stable',
            culturalAdaptation: 'Easy',
            prPath: '2-4 years (Straightforward)',
            highlights: ['Quality of life', 'Skilled migration program', 'Beautiful environment'],
            jobOpenings: [
                'Medical Specialist - Sydney',
                'Mining Engineer - Perth',
                'IT Consultant - Melbourne'
            ],
            benefits: ['Lifestyle', 'Healthcare', 'Outdoor activities'],
            challenges: ['Distance from other countries', 'High living costs', 'Visa points system']
        },
        {
            name: 'Netherlands',
            match: calculateProfessionalMatchScore(formData, 'Netherlands'),
            image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            description: 'Innovative tech scene with excellent work-life balance and English-friendly environment.',
            industryDemand: {
                'tech': 'Very High',
                'engineering': 'High',
                'agriculture': 'High',
                'creative': 'High'
            },
            salaryRange: '€50,000 - €90,000',
            averageSalary: 70000,
            costOfLiving: 'Medium-High',
            visaDifficulty: 'Medium',
            visaOptions: ['Highly Skilled Migrant', 'Blue Card', 'Startup Visa'],
            processingTime: '2-4 months',
            healthcare: 'Private (Mandatory insurance)',
            workLifeBalance: 'Very High',
            jobMarket: 'Innovative',
            culturalAdaptation: 'Easy',
            prPath: '5 years (Straightforward)',
            highlights: ['Work-life balance', 'English proficiency', 'Innovation'],
            jobOpenings: [
                'AI Engineer - Amsterdam',
                'AgriTech Specialist - Rotterdam',
                'UX Designer - Utrecht'
            ],
            benefits: ['Work culture', 'Cycling infrastructure', 'International community'],
            challenges: ['Weather', 'Housing shortage', 'Taxes']
        }
    ];
    
    // Filter and sort countries
    const filteredCountries = filterProfessionalCountries(countries, formData);
    
    // Display results
    displayProfessionalResults(filteredCountries, formData.industry);
}

function getProfessionalFormData() {
    return {
        industry: document.getElementById('industry').value,
        jobRole: document.getElementById('job-role').value,
        experience: document.getElementById('experience').value,
        skills: document.getElementById('skills').value,
        expectedSalary: document.getElementById('expected-salary').value,
        costTolerance: document.getElementById('cost-tolerance').value,
        visaPreference: document.getElementById('visa-preference').value,
        workLifeBalance: document.getElementById('work-life-balance').value,
        culturalAdaptation: document.getElementById('cultural-adaptation').value,
        careerGrowth: document.getElementById('career-growth').value
    };
}

function calculateProfessionalMatchScore(formData, countryName) {
    let score = 75; // Base score
    
    // This would be more sophisticated in a real application
    // For now, using simple scoring based on preferences
    
    return Math.min(score + Math.floor(Math.random() * 20), 98);
}

function filterProfessionalCountries(countries, formData) {
    let filtered = [...countries];
    
    // Filter by industry demand
    if (formData.industry && formData.industry !== 'other') {
        filtered = filtered.filter(country => 
            country.industryDemand[formData.industry] === 'High' || 
            country.industryDemand[formData.industry] === 'Very High'
        );
    }
    
    // Adjust scores based on preferences
    filtered.forEach(country => {
        let score = 80;
        
        // Salary expectations
        if (formData.expectedSalary <= 50000 && country.averageSalary >= 60000) score += 10;
        if (formData.expectedSalary >= 90000 && country.averageSalary >= 100000) score += 10;
        
        // Cost tolerance
        if (formData.costTolerance === 'low' && country.costOfLiving === 'Medium') score += 8;
        if (formData.costTolerance === 'high' && country.averageSalary >= 100000) score += 8;
        
        // Visa preferences
        if (formData.visaPreference === 'pr' && country.prPath.includes('Straightforward')) score += 12;
        if (formData.visaPreference === 'work' && country.visaDifficulty === 'Easy-Medium') score += 8;
        
        // Work-life balance
        if (formData.workLifeBalance === 'critical' && country.workLifeBalance === 'High') score += 10;
        if (formData.workLifeBalance === 'critical' && country.workLifeBalance === 'Very High') score += 15;
        
        country.match = Math.min(score, 99);
    });
    
    // Sort by match score
    return filtered.sort((a, b) => b.match - a.match);
}

// Function to display professional results
function displayProfessionalResults(countries, industry) {
    if (countries.length === 0) {
        resultsContainer.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                No countries match your current criteria. Try adjusting your preferences.
            </div>
        `;
        return;
    }
    
    countries.forEach((country, index) => {
        const card = createResultCard(country, 'country');
        resultsContainer.appendChild(card);
    });
    
    // Add event listeners for interactive buttons
    addProfessionalEventListeners(countries);
}

function addProfessionalEventListeners(countries) {
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            showCountryDetails(countries[index]);
        });
    });
    
    document.querySelectorAll('.view-jobs').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            showJobOpportunities(countries[index]);
        });
    });
}

// Function to show country details
function showCountryDetails(country) {
    resultsContainer.innerHTML = `
        <div>
            <button class="btn btn-secondary btn-sm mb-3" onclick="location.reload()">
                <i class="fas fa-arrow-left me-2"></i>Back to Results
            </button>
            <h4>${country.name} - Professional Opportunity Analysis</h4>
            
            <div class="row mt-4">
                <div class="col-md-6">
                    <div class="result-card">
                        <div class="p-3">
                            <h5><i class="fas fa-chart-line feature-icon"></i>Economic Indicators</h5>
                            <div class="metric-bar">
                                <span class="metric-label">Average Salary:</span>
                                <span class="metric-value ${country.averageSalary >= 100000 ? 'salary-high' : 'salary-medium'}">${country.salaryRange}</span>
                            </div>
                            <div class="metric-bar">
                                <span class="metric-label">Cost of Living:</span>
                                <span class="metric-value ${country.costOfLiving === 'High' ? 'cost-high' : country.costOfLiving === 'Medium' ? 'cost-medium' : 'cost-low'}">${country.costOfLiving}</span>
                            </div>
                            <div class="metric-bar">
                                <span class="metric-label">Job Market:</span>
                                <span class="metric-value">${country.jobMarket}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="result-card mt-3">
                        <div class="p-3">
                            <h5><i class="fas fa-passport feature-icon"></i>Immigration Details</h5>
                            <p><strong>Visa Options:</strong> ${country.visaOptions.join(', ')}</p>
                            <p><strong>Processing Time:</strong> ${country.processingTime}</p>
                            <p><strong>PR Pathway:</strong> ${country.prPath}</p>
                            <p><strong>Difficulty:</strong> ${country.visaDifficulty}</p>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="result-card">
                        <div class="p-3">
                            <h5><i class="fas fa-heartbeat feature-icon"></i>Quality of Life</h5>
                            <div class="metric-bar">
                                <span class="metric-label">Work-Life Balance:</span>
                                <span class="metric-value">${country.workLifeBalance}</span>
                            </div>
                            <div class="metric-bar">
                                <span class="metric-label">Healthcare System:</span>
                                <span class="metric-value">${country.healthcare}</span>
                            </div>
                            <div class="metric-bar">
                                <span class="metric-label">Cultural Adaptation:</span>
                                <span class="metric-value">${country.culturalAdaptation}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="result-card mt-3">
                        <div class="p-3">
                            <h5><i class="fas fa-star feature-icon"></i>Key Highlights</h5>
                            <ul>
                                ${country.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                            </ul>
                            
                            <h6 class="mt-3">Benefits:</h6>
                            <ul>
                                ${country.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                            </ul>
                            
                            <h6 class="mt-3">Challenges:</h6>
                            <ul>
                                ${country.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Function to show job opportunities
function showJobOpportunities(country) {
    resultsContainer.innerHTML = `
        <div>
            <button class="btn btn-secondary btn-sm mb-3" onclick="location.reload()">
                <i class="fas fa-arrow-left me-2"></i>Back to Results
            </button>
            <h4>${country.name} - Job Opportunities</h4>
            <p class="text-muted">Sample job openings in ${country.name} (Simulated Data)</p>
            
            <div class="mt-4">
                ${country.jobOpenings.map((job, index) => `
                    <div class="job-card">
                        <h6>${job}</h6>
                        <div class="row">
                            <div class="col-md-6">
                                <small><i class="fas fa-money-bill-wave feature-icon"></i> Estimated Salary: ${country.salaryRange}</small>
                            </div>
                            <div class="col-md-6">
                                <small><i class="fas fa-clock feature-icon"></i> Visa Sponsorship: Available</small>
                            </div>
                        </div>
                        <button class="btn btn-outline-primary btn-sm mt-2">
                            <i class="fas fa-external-link-alt me-2"></i>View Details
                        </button>
                    </div>
                `).join('')}
            </div>
            
            <div class="alert alert-info mt-4">
                <i class="fas fa-info-circle me-2"></i>
                <strong>Integration Ready:</strong> This section can be connected to LinkedIn, Indeed, or Glassdoor APIs for real-time job data.
            </div>
        </div>
    `;
}
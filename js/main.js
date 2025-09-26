// Shared utility functions

// Form validation utilities
function validateRequiredField(field, errorElement) {
    if (!field.value.trim()) {
        field.classList.add('is-invalid');
        errorElement.style.display = 'block';
        return false;
    }
    field.classList.remove('is-invalid');
    errorElement.style.display = 'none';
    return true;
}

function validateNumberField(field, errorElement, min, max) {
    const value = parseFloat(field.value);
    if (isNaN(value) || value < min || value > max) {
        field.classList.add('is-invalid');
        errorElement.style.display = 'block';
        return false;
    }
    field.classList.remove('is-invalid');
    errorElement.style.display = 'none';
    return true;
}

// Loading state management
function showLoading(loadingElement, contentElement) {
    if (loadingElement) loadingElement.style.display = 'block';
    if (contentElement) contentElement.style.display = 'none';
}

function hideLoading(loadingElement, contentElement) {
    if (loadingElement) loadingElement.style.display = 'none';
    if (contentElement) contentElement.style.display = 'block';
}

// API simulation
function simulateAPICall(duration = 2000) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true, data: {} });
        }, duration);
    });
}

// Local storage utilities
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

// Common event handlers
function setupCommonFormValidation(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation - to be extended in specific dashboard files
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            }
        });
        
        if (isValid) {
            // Form is valid - handle in specific dashboard files
            console.log('Form validation passed');
        }
    });
}

// Utility for creating result cards
function createResultCard(item, type) {
    const card = document.createElement('div');
    card.className = 'result-card';
    
    switch (type) {
        case 'university':
            card.innerHTML = `
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${item.image}" class="result-img" alt="${item.name}">
                        <div class="match-score">${item.match}%</div>
                    </div>
                    <div class="col-md-8">
                        <div class="p-3">
                            <h5>${item.name}</h5>
                            <p class="text-muted">
                                <i class="fas fa-map-marker-alt feature-icon"></i>${item.location}
                                <span class="ms-3"><i class="fas fa-trophy feature-icon"></i>Ranked #${item.ranking} globally</span>
                            </p>
                            <div class="mb-2">
                                ${item.programs.map(program => `<span class="tag">${program}</span>`).join('')}
                            </div>
                            <div class="d-flex justify-content-between mt-3">
                                <div>
                                    <i class="fas fa-money-bill-wave feature-icon"></i>
                                    <strong>Tuition:</strong> $${item.tuition.toLocaleString()}/year
                                </div>
                                <button class="btn btn-outline-primary btn-sm">View Details</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'destination':
            card.innerHTML = `
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${item.image}" class="result-img" alt="${item.name}">
                        <div class="match-score">${item.match}%</div>
                    </div>
                    <div class="col-md-8">
                        <div class="p-3">
                            <h5>${item.name}, ${item.country}</h5>
                            <p class="text-muted">
                                <i class="fas fa-map-marker-alt feature-icon"></i>${item.region}
                                <span class="ms-3"><i class="fas fa-star feature-icon"></i>${item.rating}/5</span>
                            </p>
                            <div class="mb-2">
                                ${item.activities.map(activity => `<span class="tag">${activity}</span>`).join('')}
                            </div>
                            <div class="d-flex justify-content-between mt-3">
                                <div>
                                    <i class="fas fa-money-bill-wave feature-icon"></i>
                                    <strong>Budget:</strong> $${item.budget}/week
                                </div>
                                <button class="btn btn-outline-primary btn-sm">View Details</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'country':
            card.innerHTML = `
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${item.image}" class="result-img" alt="${item.name}">
                        <div class="match-score">${item.match}%</div>
                    </div>
                    <div class="col-md-8">
                        <div class="p-3">
                            <h5>${item.name}</h5>
                            <p class="text-muted">
                                <i class="fas fa-map-marker-alt feature-icon"></i>${item.region}
                                <span class="ms-3"><i class="fas fa-chart-line feature-icon"></i>${item.gdpGrowth}% GDP Growth</span>
                            </p>
                            <div class="mb-2">
                                ${item.industries.map(industry => `<span class="tag">${industry}</span>`).join('')}
                            </div>
                            <div class="d-flex justify-content-between mt-3">
                                <div>
                                    <i class="fas fa-money-bill-wave feature-icon"></i>
                                    <strong>Avg Salary:</strong> $${item.avgSalary.toLocaleString()}/year
                                </div>
                                <button class="btn btn-outline-primary btn-sm">View Details</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;
    }
    
    return card;
}

// Initialize common functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add any common initialization code here
    console.log('Global Compass initialized');
});
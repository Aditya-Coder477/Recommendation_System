// Tourist Dashboard Specific JavaScript

// DOM Elements
let touristForm, loadingSpinner, resultSection, resultsContainer;

// Initialize the tourist dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeTouristElements();
    setupTouristEventListeners();
});

function initializeTouristElements() {
    touristForm = document.getElementById('tourist-preferences-form');
    loadingSpinner = document.getElementById('loading-spinner');
    resultSection = document.getElementById('result-section');
    resultsContainer = document.getElementById('results-container');
}

function setupTouristEventListeners() {
    if (touristForm) {
        touristForm.addEventListener('submit', handleTouristFormSubmit);
    }
}

// Handle form submission
function handleTouristFormSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (validateTouristForm()) {
        showLoading(loadingSpinner, resultSection);
        
        // Simulate API call
        simulateAPICall(1500).then(() => {
            hideLoading(loadingSpinner, resultSection);
            generateTouristRecommendations();
        });
    }
}

// Form validation
function validateTouristForm() {
    let isValid = true;
    
    // Reset error states
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    
    // Validate required fields
    const requiredFields = [
        { field: document.getElementById('trip-type'), name: 'Trip Type' },
        { field: document.getElementById('trip-duration'), name: 'Trip Duration' },
        { field: document.getElementById('trip-budget'), name: 'Budget' },
        { field: document.getElementById('trip-climate'), name: 'Climate' }
    ];
    
    requiredFields.forEach(({ field, name }) => {
        if (!field.value) {
            field.classList.add('is-invalid');
            isValid = false;
        }
    });
    
    return isValid;
}

// Function to generate tourist recommendations
function generateTouristRecommendations() {
    const formData = getTouristFormData();
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // Sample destination data
    const destinations = [
        {
            name: 'Bali, Indonesia',
            country: 'Indonesia',
            type: ['adventure', 'cultural', 'nature', 'honeymoon', 'budget'],
            climate: 'tropical',
            budget: 'medium',
            bestSeasons: ['April', 'May', 'June', 'September', 'October'],
            match: calculateTouristMatchScore(formData, 'Bali, Indonesia'),
            image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            description: 'The Island of Gods offers stunning beaches, ancient temples, and vibrant culture perfect for adventure and relaxation.',
            highlights: ['Uluwatu Temple', 'Rice Terraces', 'Beach Clubs', 'Waterfalls'],
            food: ['Local cuisine', 'Vegetarian options', 'International'],
            language: 'Multilingual',
            safety: 'Moderate',
            visa: 'Visa on arrival for most nationalities (30 days)',
            itinerary: [
                'Day 1: Arrival in Denpasar, transfer to hotel, beach relaxation',
                'Day 2: Uluwatu Temple visit and Kecak dance performance',
                'Day 3: Ubud rice terraces and traditional Balinese cooking class',
                'Day 4: Waterfall exploration and spa treatment',
                'Day 5: Beach activities and local market shopping',
                'Day 6: Optional day trip to Nusa Penida island',
                'Day 7: Departure preparation and last-minute shopping'
            ],
            estimatedCost: '$1,200 - $2,500',
            accommodation: ['Luxury resorts', 'Villas', 'Budget hotels'],
            activities: ['Surfing', 'Yoga', 'Temple visits', 'Spa treatments']
        },
        {
            name: 'Swiss Alps',
            country: 'Switzerland',
            type: ['adventure', 'nature', 'luxury', 'honeymoon'],
            climate: 'snow',
            budget: 'high',
            bestSeasons: ['December', 'January', 'February', 'June', 'July'],
            match: calculateTouristMatchScore(formData, 'Swiss Alps'),
            image: 'https://images.unsplash.com/photo-1506905925000-5f4f3255cee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            description: 'Breathtaking mountain landscapes perfect for winter sports and luxury mountain retreats.',
            highlights: ['Jungfraujoch', 'Matterhorn', 'Lake Geneva', 'Cable car rides'],
            food: ['Swiss cuisine', 'International', 'Vegetarian options'],
            language: 'Multilingual',
            safety: 'High',
            visa: 'Schengen visa required',
            itinerary: [
                'Day 1: Arrival in Zurich, train to Interlaken',
                'Day 2: Jungfraujoch - Top of Europe excursion',
                'Day 3: Skiing or snowboarding in Grindelwald',
                'Day 4: Lake Geneva cruise and chocolate factory tour',
                'Day 5: Mountain hiking and photography',
                'Day 6: Relaxation at spa and local cuisine experience',
                'Day 7: Departure from Zurich'
            ],
            estimatedCost: '$3,000 - $6,000',
            accommodation: ['Luxury hotels', 'Mountain lodges', 'Ski resorts'],
            activities: ['Skiing', 'Hiking', 'Mountain railways', 'Chocolate tours']
        },
        {
            name: 'Kyoto, Japan',
            country: 'Japan',
            type: ['cultural', 'nature', 'family', 'budget'],
            climate: 'temperate',
            budget: 'medium',
            bestSeasons: ['March', 'April', 'October', 'November'],
            match: calculateTouristMatchScore(formData, 'Kyoto, Japan'),
            image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            description: 'Ancient capital with stunning temples, traditional gardens, and rich cultural heritage.',
            highlights: ['Fushimi Inari Shrine', 'Arashiyama Bamboo Grove', 'Kinkaku-ji', 'Gion District'],
            food: ['Local cuisine', 'Vegetarian options', 'Traditional Japanese'],
            language: 'Language Immersion',
            safety: 'Very High',
            visa: 'Visa requirements vary by nationality',
            itinerary: [
                'Day 1: Arrival in Kyoto, settle in traditional ryokan',
                'Day 2: Fushimi Inari Shrine and downtown Kyoto exploration',
                'Day 3: Arashiyama Bamboo Grove and monkey park',
                'Day 4: Kinkaku-ji (Golden Pavilion) and Ryoan-ji temple',
                'Day 5: Gion district cultural experience and tea ceremony',
                'Day 6: Day trip to Nara or Osaka',
                'Day 7: Last-minute souvenir shopping and departure'
            ],
            estimatedCost: '$1,500 - $3,000',
            accommodation: ['Traditional ryokans', 'Business hotels', 'Guesthouses'],
            activities: ['Temple visits', 'Tea ceremonies', 'Garden tours', 'Cultural workshops']
        },
        {
            name: 'Santorini, Greece',
            country: 'Greece',
            type: ['luxury', 'honeymoon', 'cultural', 'nature'],
            climate: 'beach',
            budget: 'high',
            bestSeasons: ['May', 'June', 'September', 'October'],
            match: calculateTouristMatchScore(formData, 'Santorini, Greece'),
            image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            description: 'Stunning volcanic island with whitewashed buildings, crystal-clear waters, and spectacular sunsets.',
            highlights: ['Oia Sunset', 'Red Beach', 'Ancient Thera', 'Wine Tours'],
            food: ['Mediterranean', 'Seafood', 'Local Greek cuisine'],
            language: 'Multilingual',
            safety: 'High',
            visa: 'Schengen visa required',
            itinerary: [
                'Day 1: Arrival and check into cliffside hotel',
                'Day 2: Oia village exploration and famous sunset viewing',
                'Day 3: Boat tour to volcanic islands and hot springs',
                'Day 4: Beach hopping (Red Beach, Perissa Beach)',
                'Day 5: Ancient Thera ruins and wine tasting tour',
                'Day 6: Relaxation and local cuisine experience',
                'Day 7: Last-minute shopping and departure'
            ],
            estimatedCost: '$2,500 - $5,000',
            accommodation: ['Luxury hotels', 'Cave houses', 'Boutique hotels'],
            activities: ['Boat tours', 'Wine tasting', 'Beach activities', 'Sunset viewing']
        },
        {
            name: 'Costa Rica',
            country: 'Costa Rica',
            type: ['adventure', 'nature', 'family', 'budget'],
            climate: 'tropical',
            budget: 'medium',
            bestSeasons: ['December', 'January', 'February', 'March'],
            match: calculateTouristMatchScore(formData, 'Costa Rica'),
            image: 'https://images.unsplash.com/photo-1536700503339-1b3b0b1b0b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            description: 'Adventure paradise with rainforests, volcanoes, and abundant wildlife for eco-tourism enthusiasts.',
            highlights: ['Arenal Volcano', 'Monteverde Cloud Forest', 'Manuel Antonio Park', 'Zip-lining'],
            food: ['Local cuisine', 'Vegetarian options', 'International'],
            language: 'Spanish/English',
            safety: 'Moderate',
            visa: 'Visa-free for most nationalities (90 days)',
            itinerary: [
                'Day 1: Arrival in San Jose, transfer to La Fortuna',
                'Day 2: Arenal Volcano hike and hot springs',
                'Day 3: Zip-lining and hanging bridges in rainforest',
                'Day 4: Transfer to Monteverde Cloud Forest',
                'Day 5: Wildlife spotting and night forest tour',
                'Day 6: Beach day at Manuel Antonio National Park',
                'Day 7: Departure from San Jose'
            ],
            estimatedCost: '$1,000 - $2,500',
            accommodation: ['Eco-lodges', 'Beach resorts', 'Jungle hotels'],
            activities: ['Zip-lining', 'Wildlife watching', 'Volcano hikes', 'Beach activities']
        }
    ];
    
    // Filter and sort destinations
    const filteredDestinations = filterTouristDestinations(destinations, formData);
    
    // Display results
    displayTouristResults(filteredDestinations);
}

function getTouristFormData() {
    return {
        tripType: document.getElementById('trip-type').value,
        tripDuration: document.getElementById('trip-duration').value,
        tripBudget: document.getElementById('trip-budget').value,
        tripClimate: document.getElementById('trip-climate').value,
        foodPreference: document.getElementById('food-preference').value,
        languagePreference: document.getElementById('language-preference').value,
        travelSeason: document.getElementById('travel-season').value,
        travelStyle: document.getElementById('travel-style').value
    };
}

function calculateTouristMatchScore(formData, destinationName) {
    let score = 75; // Base score
    
    // This would be more sophisticated in a real application
    // For now, using simple scoring based on preferences
    
    return Math.min(score + Math.floor(Math.random() * 20), 98);
}

function filterTouristDestinations(destinations, formData) {
    let filtered = [...destinations];
    
    // Filter by trip type
    if (formData.tripType) {
        filtered = filtered.filter(dest => dest.type.includes(formData.tripType));
    }
    
    // Filter by climate
    if (formData.tripClimate && formData.tripClimate !== 'any') {
        filtered = filtered.filter(dest => dest.climate === formData.tripClimate);
    }
    
    // Filter by budget
    if (formData.tripBudget) {
        filtered = filtered.filter(dest => dest.budget === formData.tripBudget);
    }
    
    // Adjust match scores based on additional preferences
    filtered.forEach(dest => {
        // Language preference
        if (formData.languagePreference === 'english' && dest.language.includes('English')) {
            dest.match += 5;
        } else if (formData.languagePreference === 'immersion' && dest.language === 'Language Immersion') {
            dest.match += 5;
        }
        
        // Food preference
        if (formData.foodPreference === 'vegetarian' && dest.food.includes('Vegetarian options')) {
            dest.match += 3;
        }
    });
    
    // Sort by match score
    return filtered.sort((a, b) => b.match - a.match);
}

// Function to display tourist results
function displayTouristResults(destinations) {
    if (destinations.length === 0) {
        resultsContainer.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                No destinations match your current criteria. Try adjusting your preferences.
            </div>
        `;
        return;
    }
    
    destinations.forEach((destination, index) => {
        const card = createResultCard(destination, 'destination');
        resultsContainer.appendChild(card);
    });
    
    // Add event listeners for interactive buttons
    addTouristEventListeners(destinations);
}

function addTouristEventListeners(destinations) {
    document.querySelectorAll('.view-itinerary').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            showItinerary(destinations[index]);
        });
    });
    
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            showDestinationDetails(destinations[index]);
        });
    });
}

// Function to show itinerary
function showItinerary(destination) {
    resultsContainer.innerHTML = `
        <div>
            <button class="btn btn-secondary btn-sm mb-3" onclick="location.reload()">
                <i class="fas fa-arrow-left me-2"></i>Back to Results
            </button>
            <h4>${destination.name} - ${destination.country}</h4>
            <h5 class="mt-4">Suggested Itinerary (${destination.itinerary.length} days)</h5>
            <div class="mt-3">
                ${destination.itinerary.map(day => `
                    <div class="itinerary-day">
                        <i class="fas fa-map-marker-alt feature-icon"></i>${day}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Function to show destination details
function showDestinationDetails(destination) {
    resultsContainer.innerHTML = `
        <div>
            <button class="btn btn-secondary btn-sm mb-3" onclick="location.reload()">
                <i class="fas fa-arrow-left me-2"></i>Back to Results
            </button>
            <h4>${destination.name} - Complete Travel Guide</h4>
            
            <div class="row mt-4">
                <div class="col-md-6">
                    <h5><i class="fas fa-info-circle feature-icon"></i>Essential Information</h5>
                    <ul class="list-group">
                        <li class="list-group-item"><strong>Country:</strong> ${destination.country}</li>
                        <li class="list-group-item"><strong>Best Time to Visit:</strong> ${destination.bestSeasons.join(', ')}</li>
                        <li class="list-group-item"><strong>Climate:</strong> ${destination.climate}</li>
                        <li class="list-group-item"><strong>Language:</strong> ${destination.language}</li>
                        <li class="list-group-item"><strong>Visa Requirements:</strong> ${destination.visa}</li>
                        <li class="list-group-item"><strong>Safety Level:</strong> ${destination.safety}</li>
                    </ul>
                </div>
                <div class="col-md-6">
                    <h5><i class="fas fa-utensils feature-icon"></i>Food & Accommodation</h5>
                    <ul class="list-group">
                        <li class="list-group-item"><strong>Food Options:</strong> ${destination.food.join(', ')}</li>
                        <li class="list-group-item"><strong>Accommodation Types:</strong> ${destination.accommodation.join(', ')}</li>
                        <li class="list-group-item"><strong>Estimated Cost:</strong> ${destination.estimatedCost}</li>
                        <li class="list-group-item"><strong>Budget Level:</strong> ${destination.budget}</li>
                    </ul>
                </div>
            </div>
            
            <div class="mt-4">
                <h5><i class="fas fa-star feature-icon"></i>Top Activities</h5>
                <div class="d-flex flex-wrap">
                    ${destination.activities.map(activity => `
                        <span class="tag me-2 mb-2">${activity}</span>
                    `).join('')}
                </div>
            </div>
            
            <div class="mt-4">
                <h5><i class="fas fa-map-pin feature-icon"></i>Must-Visit Highlights</h5>
                <ul>
                    ${destination.highlights.map(highlight => `
                        <li>${highlight}</li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `;
}
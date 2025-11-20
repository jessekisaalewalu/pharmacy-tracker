// app.js - Main application logic with geographic filtering
class PharmacyTrackerApp {
    constructor() {
        this.currentLocation = null;
        this.pharmacies = [];
        this.filteredPharmacies = [];
        this.searchRadius = 10; // km
        this.selectedCountry = null;
        this.selectedRegion = null;
        this.selectedCity = null;
        
        // Geographic data
        this.locations = {
            'Rwanda': {
                coordinates: [-1.9536, 29.8739],
                regions: {
                    'Kigali': {
                        coordinates: [-1.9536, 29.8739],
                        cities: ['Kigali Central', 'Nyarugenge', 'Gasabo', 'Kicukiro']
                    },
                    'Southern Province': {
                        coordinates: [-2.8, 29.7],
                        cities: ['Huye', 'Butare', 'Gisagara', 'Muhanga']
                    },
                    'Western Province': {
                        coordinates: [-2.5, 29.3],
                        cities: ['Karongi', 'Kibuye', 'Gitarama', 'Muhanga']
                    },
                    'Northern Province': {
                        coordinates: [-1.5, 29.8],
                        cities: ['Ruhengeri', 'Musanze', 'Burera', 'Gicumbi']
                    },
                    'Eastern Province': {
                        coordinates: [-1.9, 30.3],
                        cities: ['Kibungo', 'Ngoma', 'Kayonza', 'Kirehe']
                    }
                }
            },
            'Kenya': {
                coordinates: [-0.3031, 36.8025],
                regions: {
                    'Nairobi': {
                        coordinates: [-1.2921, 36.8219],
                        cities: ['Nairobi CBD', 'Westlands', 'Karen', 'Kilimani']
                    },
                    'Mombasa': {
                        coordinates: [-4.0435, 39.6682],
                        cities: ['Mombasa CBD', 'Shimanzi', 'Nyali', 'Tudor']
                    },
                    'Kisumu': {
                        coordinates: [-0.1049, 34.7680],
                        cities: ['Kisumu CBD', 'Nyalenda', 'Kasagam', 'Kondele']
                    },
                    'Eldoret': {
                        coordinates: [0.5143, 35.2795],
                        cities: ['Eldoret CBD', 'Kapsoya', 'Huruma', 'Kamworor']
                    }
                }
            },
            'Uganda': {
                coordinates: [1.3733, 32.2903],
                regions: {
                    'Kampala': {
                        coordinates: [0.3476, 32.5825],
                        cities: ['Kampala CBD', 'Makindye', 'Kawempe', 'Nakawa']
                    },
                    'Mbarara': {
                        coordinates: [-0.6117, 30.6547],
                        cities: ['Mbarara CBD', 'Kakyeka', 'Kacizo', 'Bwizibwera']
                    },
                    'Jinja': {
                        coordinates: [0.4161, 33.1166],
                        cities: ['Jinja CBD', 'Nile Avenue', 'Jinja South', 'Buyikira']
                    },
                    'Fort Portal': {
                        coordinates: [0.6707, 30.2706],
                        cities: ['Fort Portal CBD', 'Kabarole', 'Burahya', 'Kabwoya']
                    }
                }
            },
            'Tanzania': {
                coordinates: [-6.3690, 34.8888],
                regions: {
                    'Dar es Salaam': {
                        coordinates: [-6.8000, 39.2833],
                        cities: ['Dar es Salaam CBD', 'Upanga', 'Kariakoo', 'Kisutu']
                    },
                    'Dodoma': {
                        coordinates: [-6.1750, 35.7347],
                        cities: ['Dodoma CBD', 'Mikumi', 'Chalinze', 'Morogoro']
                    },
                    'Arusha': {
                        coordinates: [-3.3869, 36.6830],
                        cities: ['Arusha CBD', 'Ngaramtoni', 'Themi', 'Oloirien']
                    },
                    'Mbeya': {
                        coordinates: [-8.7449, 33.4949],
                        cities: ['Mbeya CBD', 'Chunya', 'Ilolo', 'Mbeya Range']
                    }
                }
            },
            'Ethiopia': {
                coordinates: [9.1450, 40.4897],
                regions: {
                    'Addis Ababa': {
                        coordinates: [9.0320, 38.7469],
                        cities: ['Addis Ababa CBD', 'Bole', 'Yeka', 'Nifas Silk']
                    },
                    'Dire Dawa': {
                        coordinates: [9.6412, 41.8607],
                        cities: ['Dire Dawa CBD', 'Legehare', 'Genda', 'Magala']
                    },
                    'Mekele': {
                        coordinates: [13.4975, 39.4802],
                        cities: ['Mekele CBD', 'Ayder', 'May Beles', 'Tekele']
                    },
                    'Hawassa': {
                        coordinates: [5.0269, 38.4835],
                        cities: ['Hawassa CBD', 'Tula', 'Arba Minch', 'Dila']
                    }
                }
            }
        };

        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.setupEventListeners();
        this.initializeLocationSelects();
        this.loadPharmacies();
    }

    /**
     * Initialize country/region/city selects
     */
    initializeLocationSelects() {
        const countrySelect = document.getElementById('countrySelect');
        const regionSelect = document.getElementById('regionSelect');
        const citySelect = document.getElementById('citySelect');

        // Populate countries
        Object.keys(this.locations).sort().forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countrySelect.appendChild(option);
        });

        // Country change handler
        countrySelect.addEventListener('change', (e) => {
            this.selectedCountry = e.target.value;
            this.selectedRegion = null;
            this.selectedCity = null;
            regionSelect.innerHTML = '<option value="">Select a region...</option>';
            citySelect.innerHTML = '<option value="">Select a city...</option>';
            regionSelect.disabled = !this.selectedCountry;
            citySelect.disabled = true;

            if (this.selectedCountry) {
                const regions = this.locations[this.selectedCountry].regions;
                Object.keys(regions).sort().forEach(region => {
                    const option = document.createElement('option');
                    option.value = region;
                    option.textContent = region;
                    regionSelect.appendChild(option);
                });
            }
        });

        // Region change handler
        regionSelect.addEventListener('change', (e) => {
            this.selectedRegion = e.target.value;
            this.selectedCity = null;
            citySelect.innerHTML = '<option value="">Select a city...</option>';
            citySelect.disabled = !this.selectedRegion;

            if (this.selectedRegion && this.selectedCountry) {
                const cities = this.locations[this.selectedCountry].regions[this.selectedRegion].cities;
                cities.forEach(city => {
                    const option = document.createElement('option');
                    option.value = city;
                    option.textContent = city;
                    citySelect.appendChild(option);
                });
            }
        });

        // City change handler
        citySelect.addEventListener('change', (e) => {
            this.selectedCity = e.target.value;
            if (this.selectedCity && this.selectedRegion && this.selectedCountry) {
                const coords = this.locations[this.selectedCountry].regions[this.selectedRegion].coordinates;
                this.currentLocation = {
                    latitude: coords[0],
                    longitude: coords[1]
                };
                this.filterPharmacies();
                this.renderMap();
            }
        });
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateTo(page);
            });
            // Add keyboard activation for elements that are not native buttons/links
            const role = link.getAttribute('role');
            const tab = link.getAttribute('tabindex');
            if (role === 'button' || tab !== null) {
                link.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                        e.preventDefault();
                        const page = link.getAttribute('data-page');
                        this.navigateTo(page);
                    }
                });
            }
        });

        // Hamburger menu
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when link clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Search page
        document.getElementById('getLocationBtn').addEventListener('click', () => this.getUserLocation());
        document.getElementById('searchInput').addEventListener('input', (e) => this.searchPharmacies(e.target.value));
        document.getElementById('radiusFilter').addEventListener('input', (e) => {
            this.searchRadius = parseInt(e.target.value);
            document.getElementById('radiusValue').textContent = e.target.value;
            this.filterPharmacies();
        });

        // Register page
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegisterSubmit(e));
        document.getElementById('detectLocationBtn').addEventListener('click', () => this.detectPharmacyLocation());

        // Modal
        document.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        document.getElementById('detailModal').addEventListener('click', (e) => {
            if (e.target.id === 'detailModal') {
                this.closeModal();
            }
        });
    }

    /**
     * Navigate to a page
     */
    navigateTo(pageName) {
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        const page = document.getElementById(pageName);
        if (page) {
            page.classList.add('active');
        }

        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`[data-page="${pageName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        if (pageName === 'search') {
            setTimeout(() => this.renderMap(), 100);
            // Focus search input for quick typing
            setTimeout(() => {
                const input = document.getElementById('searchInput');
                if (input) input.focus();
            }, 150);
        }
    }

    /**
     * Load all pharmacies from backend
     */
    async loadPharmacies() {
        this.showLoadingSpinner(true);
        try {
            const response = await api.fetchAll();
            const data = Array.isArray(response) ? response : response.data || [];
            // Normalize coordinate fields so both `lat`/`lng` and `latitude`/`longitude` are supported
            data.forEach(item => {
                if (item.lat !== undefined && item.latitude === undefined) item.latitude = parseFloat(item.lat);
                if (item.lng !== undefined && item.longitude === undefined) item.longitude = parseFloat(item.lng);
                if (typeof item.latitude === 'string') item.latitude = parseFloat(item.latitude);
                if (typeof item.longitude === 'string') item.longitude = parseFloat(item.longitude);
            });
            this.pharmacies = data;
            this.filteredPharmacies = data;
            console.log('Loaded pharmacies:', this.pharmacies.length);
            this.renderPharmaciesList(); // Render immediately after loading
        } catch (error) {
            console.error('Failed to load pharmacies:', error);
            this.showLocationStatus('error', 'Failed to load pharmacies. Ensure backend is running on port 4000.');
        } finally {
            this.showLoadingSpinner(false);
        }
    }

    /**
     * Show/hide loading spinner
     */
    showLoadingSpinner(show) {
        const spinner = document.getElementById('loadingSpinner');
        if (show) {
            spinner.classList.remove('hidden');
        } else {
            spinner.classList.add('hidden');
        }
    }

    /**
     * Get user's current location
     */
    async getUserLocation() {
        if (!navigator.geolocation) {
            this.showLocationStatus('error', 'Geolocation not supported by your browser');
            return;
        }

        this.showLoadingSpinner(true);
        this.showLocationStatus('info', 'Getting your location...');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                this.currentLocation = { latitude, longitude };
                this.showLoadingSpinner(false);
                this.showLocationStatus('success', `Location found: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                this.filterPharmacies();
                this.renderMap();
            },
            (error) => {
                this.showLoadingSpinner(false);
                console.error('Geolocation error:', error);
                this.showLocationStatus('error', 'Unable to get your location. Please enable location services.');
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    }

    /**
     * Show location status message
     */
    showLocationStatus(type, message) {
        const statusDiv = document.getElementById('locationStatus');
        statusDiv.textContent = message;
        statusDiv.className = `location-status ${type}`;
    }

    /**
     * Calculate distance between two coordinates (Haversine formula)
     */
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    /**
     * Filter pharmacies by location and search
     */
    filterPharmacies() {
        let filtered = [...this.pharmacies];

        // Filter by distance if location available
        if (this.currentLocation) {
            filtered = filtered.filter(pharmacy => {
                const distance = this.calculateDistance(
                    this.currentLocation.latitude,
                    this.currentLocation.longitude,
                    pharmacy.latitude || 0,
                    pharmacy.longitude || 0
                );
                pharmacy.distance = distance;
                return distance <= this.searchRadius;
            });

            // Sort by distance
            filtered.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
        } else {
            // If no location selected, just show all pharmacies
            filtered.forEach(pharmacy => {
                pharmacy.distance = undefined;
            });
        }

        this.filteredPharmacies = filtered;
        this.renderPharmaciesList();
    }

    /**
     * Search pharmacies by name
     */
    searchPharmacies(query) {
        if (!query) {
            this.filterPharmacies();
            return;
        }

        const searchTerm = query.toLowerCase();
        let filtered = this.pharmacies.filter(pharmacy => 
            pharmacy.name.toLowerCase().includes(searchTerm) ||
            (pharmacy.address && pharmacy.address.toLowerCase().includes(searchTerm))
        );

        // Apply distance filter if location is available
        if (this.currentLocation) {
            filtered = filtered.filter(pharmacy => {
                const distance = this.calculateDistance(
                    this.currentLocation.latitude,
                    this.currentLocation.longitude,
                    pharmacy.latitude || 0,
                    pharmacy.longitude || 0
                );
                pharmacy.distance = distance;
                return distance <= this.searchRadius;
            });

            // Sort by distance
            filtered.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
        }

        this.filteredPharmacies = filtered;
        this.renderPharmaciesList();
    }

    /**
     * Render pharmacies list
     */
    renderPharmaciesList() {
        const container = document.getElementById('pharmaciesList');
        
        if (this.filteredPharmacies.length === 0) {
            container.innerHTML = '<p class="placeholder">No pharmacies found. Try adjusting your search radius, location, or search term.</p>';
            return;
        }

        container.innerHTML = this.filteredPharmacies.map((pharmacy, index) => `
            <div class="pharmacy-card" onclick="app.showPharmacyDetail('${pharmacy.id}')" style="animation-delay: ${index * 50}ms">
                <div class="pharmacy-info">
                    <div class="pharmacy-name">${pharmacy.name}</div>
                    <div class="pharmacy-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${pharmacy.address || 'Address not available'}</span>
                    </div>
                    <div class="pharmacy-detail">
                        <i class="fas fa-phone"></i>
                        <span><a href="tel:${pharmacy.phone_number}" onclick="event.stopPropagation()">${pharmacy.phone_number}</a></span>
                    </div>
                    ${pharmacy.opening_hours ? `
                    <div class="pharmacy-detail">
                        <i class="fas fa-clock"></i>
                        <span>${pharmacy.opening_hours}</span>
                    </div>
                    ` : ''}
                </div>
                ${pharmacy.distance !== undefined ? `
                <div class="pharmacy-distance">
                    <i class="fas fa-location-dot"></i> ${pharmacy.distance.toFixed(1)} km
                </div>
                ` : ''}
            </div>
        `).join('');

        // Add stagger animation to pharmacy cards
        document.querySelectorAll('.pharmacy-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 50}ms`;
        });
    }

    /**
     * Render map with markers
     */
    renderMap() {
        const mapEl = document.getElementById('map');

        if (!this.currentLocation && this.filteredPharmacies.length === 0) {
            mapEl.innerHTML = '<p>Select a location or enable location access to see pharmacies on the map</p>';
            return;
        }

        mapEl.innerHTML = '';
        mapEl.style.position = 'relative';

        // Calculate map bounds
        let allPoints = [...(this.filteredPharmacies || [])];
        if (this.currentLocation) {
            allPoints.push(this.currentLocation);
        }

        if (allPoints.length === 0) {
            return;
        }

        // Find bounds
        const lats = allPoints.map(p => p.latitude);
        const lngs = allPoints.map(p => p.longitude);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);

        // Calculate center
        const centerLat = (minLat + maxLat) / 2;
        const centerLng = (minLng + maxLng) / 2;

        // Create markers
        if (this.currentLocation) {
            this.createMapMarker(mapEl, this.currentLocation, 'user-location', 'You', centerLat, centerLng);
        }

        this.filteredPharmacies.forEach((pharmacy, index) => {
            setTimeout(() => {
                this.createMapMarker(mapEl, pharmacy, 'pharmacy', pharmacy.name, centerLat, centerLng);
            }, index * 100);
        });
    }

    /**
     * Create a marker on the map
     */
    createMapMarker(mapEl, location, type, label, centerLat, centerLng) {
        const marker = document.createElement('div');
        marker.className = 'map-marker';
        marker.style.cursor = type === 'pharmacy' ? 'pointer' : 'default';

        const latRatio = (location.latitude - centerLat) * 100;
        const lngRatio = (location.longitude - centerLng) * 100;

        marker.style.left = `calc(50% + ${lngRatio}px)`;
        marker.style.top = `calc(50% - ${latRatio}px)`;

        const pinHTML = `
            <div class="map-pin ${type}">
                <i class="fas fa-${type === 'user-location' ? 'location-dot' : 'hospital'}"></i>
            </div>
            <div class="map-info">${label}</div>
        `;

        marker.innerHTML = pinHTML;

        if (type === 'pharmacy') {
            marker.onclick = (e) => {
                e.stopPropagation();
                const pharmacy = this.filteredPharmacies.find(p => p.name === label);
                if (pharmacy) {
                    this.showPharmacyDetail(pharmacy.id);
                }
            };
        }

        mapEl.appendChild(marker);
    }

    /**
     * Show pharmacy detail modal
     */
    showPharmacyDetail(pharmacyId) {
        const pharmacy = this.pharmacies.find(p => p.id === pharmacyId);
        if (!pharmacy) return;

        const detailContent = document.getElementById('detailContent');
        const services = Array.isArray(pharmacy.services) ? pharmacy.services : 
                        (pharmacy.services && pharmacy.services.length > 0 ? JSON.parse(pharmacy.services) : []);

        detailContent.innerHTML = `
            <h2>${pharmacy.name}</h2>
            
            <div class="detail-item">
                <div class="detail-icon"><i class="fas fa-map-marker-alt"></i></div>
                <div class="detail-text">
                    <div class="detail-label">Address</div>
                    <div class="detail-value">${pharmacy.address || 'Not provided'}</div>
                </div>
            </div>

            <div class="detail-item">
                <div class="detail-icon"><i class="fas fa-phone"></i></div>
                <div class="detail-text">
                    <div class="detail-label">Phone</div>
                    <div class="detail-value"><a href="tel:${pharmacy.phone_number}">${pharmacy.phone_number}</a></div>
                </div>
            </div>

            ${pharmacy.email ? `
            <div class="detail-item">
                <div class="detail-icon"><i class="fas fa-envelope"></i></div>
                <div class="detail-text">
                    <div class="detail-label">Email</div>
                    <div class="detail-value"><a href="mailto:${pharmacy.email}">${pharmacy.email}</a></div>
                </div>
            </div>
            ` : ''}

            ${pharmacy.contact_person ? `
            <div class="detail-item">
                <div class="detail-icon"><i class="fas fa-user"></i></div>
                <div class="detail-text">
                    <div class="detail-label">Contact Person</div>
                    <div class="detail-value">${pharmacy.contact_person}</div>
                </div>
            </div>
            ` : ''}

            ${pharmacy.opening_hours ? `
            <div class="detail-item">
                <div class="detail-icon"><i class="fas fa-clock"></i></div>
                <div class="detail-text">
                    <div class="detail-label">Opening Hours</div>
                    <div class="detail-value">${pharmacy.opening_hours}</div>
                </div>
            </div>
            ` : ''}

            ${services && services.length > 0 ? `
            <div class="detail-item">
                <div class="detail-icon"><i class="fas fa-stethoscope"></i></div>
                <div class="detail-text">
                    <div class="detail-label">Services</div>
                    <div class="detail-value">${Array.isArray(services) ? services.join(', ') : services}</div>
                </div>
            </div>
            ` : ''}

            ${this.currentLocation && pharmacy.latitude && pharmacy.longitude ? `
            <div class="detail-item">
                <div class="detail-icon"><i class="fas fa-location-dot"></i></div>
                <div class="detail-text">
                    <div class="detail-label">Distance</div>
                    <div class="detail-value">${this.calculateDistance(
                        this.currentLocation.latitude,
                        this.currentLocation.longitude,
                        pharmacy.latitude,
                        pharmacy.longitude
                    ).toFixed(2)} km away</div>
                </div>
            </div>
            ` : ''}
        `;

        document.getElementById('detailModal').classList.add('active');
    }

    /**
     * Close pharmacy detail modal
     */
    closeModal() {
        document.getElementById('detailModal').classList.remove('active');
    }

    /**
     * Detect pharmacy location for registration
     */
    detectPharmacyLocation() {
        if (!navigator.geolocation) {
            alert('Geolocation not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                document.getElementById('latitude').value = latitude.toFixed(6);
                document.getElementById('longitude').value = longitude.toFixed(6);
                alert(`Location detected!\nLatitude: ${latitude.toFixed(6)}\nLongitude: ${longitude.toFixed(6)}`);
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Unable to detect location. Please enable location services.');
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    }

    /**
     * Handle register form submission
     */
    async handleRegisterSubmit(event) {
        event.preventDefault();

        const formData = new FormData(document.getElementById('registerForm'));
        const payload = Object.fromEntries(formData);

        if (!payload.name || !payload.phone_number || !payload.address) {
            this.showMessage('error', 'Please fill in all required fields (marked with *)');
            return;
        }

        payload.latitude = parseFloat(payload.latitude) || 0;
        payload.longitude = parseFloat(payload.longitude) || 0;

        if (payload.services) {
            payload.services = payload.services.split(',').map(s => s.trim()).filter(s => s);
        }

        payload.is_registered_by_pharmacy = document.getElementById('isRegistered').checked;

        try {
            const response = await api.createPharmacy(payload);
            
            if (response.success || response.data) {
                this.showMessage('success', 'Pharmacy registered successfully! Your pharmacy is now visible to customers.');
                document.getElementById('registerForm').reset();
                await this.loadPharmacies();
                setTimeout(() => this.navigateTo('home'), 2000);
            } else {
                this.showMessage('error', response.message || 'Failed to register pharmacy');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showMessage('error', 'Error registering pharmacy: ' + error.message);
        }
    }

    /**
     * Show message in register form
     */
    showMessage(type, message) {
        const msgBox = document.getElementById('registerMessage');
        msgBox.textContent = message;
        msgBox.className = `message-box ${type}`;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PharmacyTrackerApp();
});

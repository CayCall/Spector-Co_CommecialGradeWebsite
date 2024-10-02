const map = L.map('map', {
    scrollWheelZoom: false, // Initially disable scroll wheel zoom
    dragging: false // Initially disable dragging
}).setView([51.505, -0.09], 2);

// Adding OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Sample location data
const locations = [
    { name: "New York", lat: 40.7128, lng: -74.0060 }, // North America
    { name: "Los Angeles", lat: 34.0522, lng: -118.2437 }, 
    { name: "Toronto", lat: 43.6510, lng: -79.3470 },
    
    { name: "London", lat: 51.5074, lng: -0.1278 }, // Europe
    { name: "Berlin", lat: 52.5200, lng: 13.4050 },
    { name: "Paris", lat: 48.8566, lng: 2.3522 },

    { name: "Tokyo", lat: 35.6762, lng: 139.6503 }, // Asia
    { name: "Beijing", lat: 39.9042, lng: 116.4074 },
    { name: "Seoul", lat: 37.5665, lng: 126.9780 },

    { name: "Sydney", lat: -33.8688, lng: 151.2093 }, // Australia
    { name: "Melbourne", lat: -37.8136, lng: 144.9631 },
    { name: "Brisbane", lat: -27.4698, lng: 153.0251 },

    { name: "Cairo", lat: 30.0444, lng: 31.2357 }, // Africa
    { name: "Nairobi", lat: -1.2864, lng: 36.8172 },
    { name: "Lagos", lat: 6.5244, lng: 3.3792 },

    { name: "Buenos Aires", lat: -34.6037, lng: -58.3816 }, // South America
    { name: "Sao Paulo", lat: -23.5505, lng: -46.6333 },
    { name: "Bogotá", lat: 4.6118, lng: -74.0818 }
];

// Create markers
locations.forEach(location => {
    L.marker([location.lat, location.lng])
        .addTo(map)
        .bindPopup(location.name); // Bind a popup to display the name
});

// Enable dragging and scroll zoom on map click
map.on('click', () => {
    map.dragging.enable();
    map.scrollWheelZoom.enable();
});

// Disable dragging and scroll zoom when mouse leaves the map
map.on('mouseout', () => {
    map.dragging.disable();
    map.scrollWheelZoom.disable();
});

// Prevent scrolling the page when interacting with the map
map.on('mousedown', (e) => {
    e.preventDefault();
});

// Prevent map interaction when scrolling
let isScrolling;

window.addEventListener('scroll', () => {
    clearTimeout(isScrolling);
    map.dragging.disable();
    map.scrollWheelZoom.disable();

    isScrolling = setTimeout(() => {
        // Re-enable dragging and scroll zoom after scrolling stops
        map.dragging.enable();
        map.scrollWheelZoom.enable();
    }, 200);
});
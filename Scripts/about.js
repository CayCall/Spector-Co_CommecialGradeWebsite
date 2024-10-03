const locations = [
    { name: "New York", lat: 40.7128, lng: -74.0060 },
    { name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
    { name: "Toronto", lat: 43.6510, lng: -79.3470 },
    { name: "London", lat: 51.5074, lng: -0.1278 },
    { name: "Berlin", lat: 52.5200, lng: 13.4050 },
    { name: "Paris", lat: 48.8566, lng: 2.3522 },
    { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
    { name: "Beijing", lat: 39.9042, lng: 116.4074 },
    { name: "Seoul", lat: 37.5665, lng: 126.9780 },
    { name: "Sydney", lat: -33.8688, lng: 151.2093 },
    { name: "Melbourne", lat: -37.8136, lng: 144.9631 },
    { name: "Brisbane", lat: -27.4698, lng: 153.0251 },
    { name: "Cairo", lat: 30.0444, lng: 31.2357 },
    { name: "Nairobi", lat: -1.2864, lng: 36.8172 },
    { name: "Lagos", lat: 6.5244, lng: 3.3792 },
    { name: "Buenos Aires", lat: -34.6037, lng: -58.3816 },
    { name: "Sao Paulo", lat: -23.5505, lng: -46.6333 },
    { name: "Bogotá", lat: 4.6118, lng: -74.0818 }
];

// Initialize the map
const map = L.map('map').setView([20, 0], 2); // Center map at a reasonable global view

// Load and display tile layers
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add markers for each location
locations.forEach(location => {
    L.marker([location.lat, location.lng]).addTo(map)
        .bindPopup(location.name)
        .openPopup();
});
const API_URL = 'https://www.courtlistener.com/api/rest/v3/opinions/?page=1'; // Make sure the URL is correct
let legalData = [];

// Function to fetch legal opinions data from the API
async function fetchLegalOpinions() {
    if (legalData.length > 0) return legalData; // Return cached data if already fetched

    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) throw new Error('Network response was not ok: ' + response.status); // Check for HTTP errors
        
        const jsonData = await response.json();
        console.log(jsonData); // Log the entire API response to the console for inspection

        legalData = jsonData.results || []; // Store results if they exist
        return legalData;
    } catch (error) {
        console.error("Error fetching or parsing data:", error);
        return [];
    }
}

export { fetchLegalOpinions };
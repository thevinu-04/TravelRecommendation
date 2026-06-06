const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("btn-search");
const resetBtn = document.getElementById("btn-clear"); 
const resultsGrid = document.getElementById("recommendation-results");

searchBtn.addEventListener("click", handleSearch);
resetBtn.addEventListener("click", reset);

function handleSearch() {
    const text = searchInput.value.toLowerCase().trim();
    
    if (!text) {
        resultsGrid.innerHTML = `<p class="no-results">Enter keyword to get recommendations.</p>`;
        return;
    }

    fetch('travel_recommendation_api.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {

            resultsGrid.innerHTML = "";
            
            let recommendations = [];
            
            if (text === "beach" || text === "beaches") {
                recommendations = data.beaches;
            } else if (text === "temple" || text === "temples") {
                recommendations = data.temples;
            } else if (text === "country" || text === "countries") {
                data.countries.forEach(country => {
                    recommendations.push(...country.cities);
                });
            } else {
                resultsGrid.innerHTML = `<p class="no-results">No recommendations found for "${text}".</p>`;
                return;
            }
            displayResults(recommendations);
        })
        .catch(error => {
            console.error('Fetch error:', error);
            resultsGrid.innerHTML = `<p class="no-results">Error loading recommendations. Please try again later.</p>`;
        });
}

function reset(){
    searchInput.value = "";
    resultsGrid.innerHTML = "";    
}

function displayResults(places) {
    places.forEach(place => {

        const card = document.createElement("div");
        card.classList.add("result-card");

        card.innerHTML = `
            <img src="${place.imageUrl}" alt="${place.name}">
            <div class="card-body">
                <h3>${place.name}</h3>
                <p>${place.description}</p>
                <button class="btn-visit">Visit</button>
            </div>
        `;
        resultsGrid.appendChild(card);
    });
}

window.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  });
  
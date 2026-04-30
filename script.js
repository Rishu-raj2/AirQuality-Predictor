/**
 * script.js — AirInsight Prediction Page
 * Handles city search, air quality data fetching, and results rendering.
 * All API calls go through the server-side proxy to keep secrets safe.
 */

// ─── DOM References ───────────────────────────────────────────────────────────
const cityInput   = document.getElementById("input-city");
const submitBtn   = document.getElementById("btn-submit");
const mainTitle   = document.querySelector(".main-title");
const subTitle    = document.querySelector(".secondary-title");
const aqiDisplay  = document.getElementById("aqi-data");
const resultText  = document.getElementById("result");
const aqiImage    = document.getElementById("airQuality-img");
const loader      = document.querySelector(".loader-data");
const errorBanner = document.getElementById("error-banner");

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Show or hide the loading spinner */
function setLoading(isLoading) {
  loader.style.display = isLoading ? "block" : "none";
}

/** Show a user-friendly error message in the UI */
function showError(message) {
  if (errorBanner) {
    errorBanner.textContent = message;
    errorBanner.style.display = "block";
  }
}

/** Hide the error banner */
function clearError() {
  if (errorBanner) {
    errorBanner.style.display = "none";
    errorBanner.textContent = "";
  }
}

/**
 * Determine AQI category and return label, image path, and border color.
 * @param {number} aqi — Overall AQI value
 */
function getAqiCategory(aqi) {
  if (aqi <= 50) {
    return { label: "Good Air Quality", img: "/assets/goodAirQuality.png", borderColor: "#e1edde" };
  } else if (aqi <= 100) {
    return { label: "Moderate Air Quality", img: "/assets/airQuality.png", borderColor: "#f6e1db" };
  } else {
    return { label: "Unhealthy Air Quality", img: "/assets/unhealthy_aqi.png", borderColor: "#f2dee9" };
  }
}

/** Remove any existing real-time results card before rendering new ones */
function clearPreviousResults() {
  const existing = document.querySelector(".rt-card");
  if (existing) existing.remove();
}

// ─── Main Fetch Function ──────────────────────────────────────────────────────

/**
 * Fetch air quality data from the server-side proxy and render results.
 * @param {string} city — City name entered by the user
 */
async function fetchAirQuality(city) {
  setLoading(true);
  clearError();
  clearPreviousResults();

  try {
    const response = await fetch(`/api/airquality?city=${encodeURIComponent(city)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to retrieve air quality data.");
    }

    if (!data.overall_aqi) {
      throw new Error(`No air quality data found for "${city}". Please check the city name.`);
    }

    renderResults(city, data);
  } catch (err) {
    showError(err.message);
    console.error("Air quality fetch error:", err);
  } finally {
    setLoading(false);
  }
}

// ─── Results Renderer ─────────────────────────────────────────────────────────

/**
 * Render the pollutant breakdown cards and update the summary panel.
 * @param {string} city — The searched city name
 * @param {object} data — The air quality data object from the API
 */
function renderResults(city, data) {
  const { overall_aqi } = data;
  const category = getAqiCategory(overall_aqi);

  // Update summary panel
  mainTitle.textContent = `${city} Air Quality Index`;
  subTitle.textContent  = `Real-time PM2.5, PM10 air pollution level of ${city}`;
  aqiDisplay.textContent = `${overall_aqi} (AQI-US)`;
  resultText.textContent = category.label;
  aqiImage.src = category.img;

  // Build pollutant cards
  const sectionCards = document.querySelector(".section-cards");
  const rtCard = document.createElement("div");
  rtCard.classList.add("cards", "rt-card");

  Object.entries(data).forEach(([pollutant, values]) => {
    // Skip the overall AQI summary field — not a pollutant
    if (pollutant === "overall_aqi") return;

    const smallCard   = document.createElement("div");
    const nameEl      = document.createElement("div");
    const concEl      = document.createElement("div");
    const aqiEl       = document.createElement("div");

    smallCard.classList.add("small-card");
    nameEl.classList.add("chemicals", "medium");
    concEl.classList.add("percentage");
    aqiEl.classList.add("aqi");

    nameEl.textContent = pollutant;
    concEl.textContent = `Concentration: ${values.concentration.toFixed(2)} µg/m³`;
    aqiEl.textContent  = `AQI: ${values.aqi}`;

    smallCard.appendChild(nameEl);
    smallCard.appendChild(concEl);
    smallCard.appendChild(aqiEl);
    rtCard.appendChild(smallCard);
  });

  rtCard.style.border = `3px solid ${category.borderColor}`;
  sectionCards.appendChild(rtCard);
}

// ─── Event Listeners ──────────────────────────────────────────────────────────

submitBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) {
    showError("Please enter a city name.");
    return;
  }
  fetchAirQuality(city);
});

// Allow submitting with the Enter key
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    submitBtn.click();
  }
});

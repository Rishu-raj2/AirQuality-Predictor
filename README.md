# 🌬️ AirInsight — Real-time Air Quality Monitor

AirInsight is a full-stack web application that gives you instant access to real-time air quality data for any city. Whether you're checking the daily AQI before a morning run or researching pollution trends, AirInsight provides clear, data-driven insights — powered by an AI assistant that answers your environmental questions in plain language.

---

## ✨ Features

- **🔍 City AQI Search** — Enter any city name to get live pollutant data (PM2.5, PM10, CO, NO2, O3, SO2) with AQI ratings
- **🗺️ Interactive Live Map** — OpenStreetMap-based map with a real-time AQI overlay showing pollution hotspots
- **🤖 AI Assistant** — Powered by Google Gemini; ask any air quality or health question and get an intelligent response
- **📊 AQI Reference Table** — Full breakdown of AQI ranges, health implications, and cautionary statements
- **📰 Environmental Articles** — Curated articles on forest, water, sewage, and land pollution
- **📱 Responsive Design** — Works seamlessly across desktop and mobile devices

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Backend    | Node.js, Express.js                 |
| Frontend   | HTML5, CSS3, Vanilla JavaScript     |
| AI         | Google Gemini API (`gemini-1.5-flash`) |
| Air Data   | RapidAPI — Air Quality by API Ninjas |
| Map        | Leaflet.js + OpenStreetMap + WAQI Tiles |
| Container  | Docker, Docker Compose              |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A [Google Gemini API key](https://aistudio.google.com/app/apikey) (free)
- A [RapidAPI key](https://rapidapi.com/apininjas/api/air-quality-by-api-ninjas) for Air Quality by API Ninjas (free tier available)

### 1. Clone the Repository

```bash
git clone https://github.com/Rishu-raj2/Air-Insight.git
cd Air-Insight
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example env file and fill in your API keys:

```bash
cp .env.example .env
```

Then open `.env` and set your keys:

```env
API_KEY=your_google_gemini_api_key_here
RAPIDAPI_KEY=your_rapidapi_key_here
PORT=3000
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

### 4. Run the Application

```bash
npm start
```

Open your browser and visit: **http://localhost:3000**

---

## 🐳 Docker

### Build and Run with Docker

```bash
docker build -t airinsight-app .
docker run -d --name airinsight-container -p 3000:3000 --env-file .env airinsight-app
```

### Or Use Docker Compose

```bash
docker-compose up -d
```

To stop:

```bash
docker-compose down
```

---

## 📡 API Endpoints

| Method | Endpoint                         | Description                                      |
|--------|----------------------------------|--------------------------------------------------|
| GET    | `/`                              | Serves the main homepage                         |
| GET    | `/prediction`                    | Serves the AQI checker page                      |
| GET    | `/about`                         | Serves the about page                            |
| GET    | `/api/airquality?city=<name>`    | Returns live air quality data for the given city |
| POST   | `/assistance`                    | Returns an AI-generated response to a message    |

### Example: Check Air Quality

```bash
curl "http://localhost:3000/api/airquality?city=Delhi"
```

### Example: AI Assistant

```bash
curl -X POST http://localhost:3000/assistance \
  -H "Content-Type: application/json" \
  -d '{"message": "What is a safe AQI level for outdoor exercise?"}'
```

---

## 📁 Project Structure

```
Air-Insight/
├── public/                  # All frontend files served statically
│   ├── assets/              # Images, icons, SVGs
│   ├── index.html           # Homepage
│   ├── prediction.html      # AQI checker page
│   ├── about.html           # About page
│   ├── style.css            # Main styles
│   ├── about.css            # About page styles
│   ├── pollution.css        # AQI checker styles
│   ├── utility.css          # Shared utility styles
│   ├── script.js            # AQI search logic
│   └── bot.js               # AI chatbot widget logic
├── server.js                # Express server — routes & API proxy
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .env.example             # Environment variable template
├── .gitignore
└── .dockerignore
```

---

## 🔒 Security

- All API keys are stored server-side in `.env` and **never exposed to the browser**
- The RapidAPI call is proxied through the Express server at `/api/airquality`
- `.env` is excluded from version control via `.gitignore`

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

**Rishu-raj2** — [GitHub](https://github.com/Rishu-raj2)
<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=28&pause=1000&color=2EA44F&center=true&vCenter=true&width=650&lines=Electricity+Forecast+%26+Advisor;GRU-Powered+Usage+Prediction;Explainable+AI+Energy+Advice;Try+the+Live+Demo+%E2%86%92" alt="typing-svg" />

**AI-powered electricity consumption forecasting and energy-saving advice, built on a GRU deep learning model.**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-2ea44f?style=for-the-badge)](https://eelctricity-forecost-advisor.vercel.app/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3.3-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![ONNX](https://img.shields.io/badge/ONNX_Runtime-1.16.0-005CED?style=flat-square&logo=onnx&logoColor=white)](https://onnxruntime.ai/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](#-license)

[![Stars](https://img.shields.io/github/stars/AsgharGhanghro/Electricty_Analyzer_And_Advisor?style=social)](https://github.com/AsgharGhanghro/Electricty_Analyzer_And_Advisor/stargazers)
[![Forks](https://img.shields.io/github/forks/AsgharGhanghro/Electricty_Analyzer_And_Advisor?style=social)](https://github.com/AsgharGhanghro/Electricty_Analyzer_And_Advisor/network/members)
[![Issues](https://img.shields.io/github/issues/AsgharGhanghro/Electricty_Analyzer_And_Advisor?style=flat-square)](https://github.com/AsgharGhanghro/Electricty_Analyzer_And_Advisor/issues)
[![Last Commit](https://img.shields.io/github/last-commit/AsgharGhanghro/Electricty_Analyzer_And_Advisor?style=flat-square)](https://github.com/AsgharGhanghro/Electricty_Analyzer_And_Advisor/commits)

[**⭐ Star this repo**](https://github.com/AsgharGhanghro/Electricty_Analyzer_And_Advisor) · [**🚀 Try it live**](https://eelctricity-forecost-advisor.vercel.app/) · [**🐛 Report a bug**](https://github.com/AsgharGhanghro/Electricty_Analyzer_And_Advisor/issues) · [**💡 Request a feature**](https://github.com/AsgharGhanghro/Electricty_Analyzer_And_Advisor/issues)

</div>

---

## 📖 Table of Contents

<div align="center">

[![Overview](https://img.shields.io/badge/📖-Overview-informational?style=for-the-badge)](#-overview)
[![Demo](https://img.shields.io/badge/🌐-Live_Demo-2ea44f?style=for-the-badge)](#-live-demo)
[![Features](https://img.shields.io/badge/📌-Features-orange?style=for-the-badge)](#-features)
[![Tour](https://img.shields.io/badge/🖥️-Dashboard_Tour-blueviolet?style=for-the-badge)](#️-dashboard-tour)
[![Quick Start](https://img.shields.io/badge/🚀-Quick_Start-success?style=for-the-badge)](#-quick-start)
[![API](https://img.shields.io/badge/🌐-API_Reference-lightgrey?style=for-the-badge)](#-api-reference)
[![FAQ](https://img.shields.io/badge/❓-FAQ-yellow?style=for-the-badge)](#-faq)
[![Contributing](https://img.shields.io/badge/🤝-Contributing-red?style=for-the-badge)](#-contributing)

</div>

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Dashboard Tour](#-dashboard-tour)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#️-project-structure)
- [Quick Start](#-quick-start)
- [API Reference](#-api-reference)
- [Model Details](#-model-details)
- [Deployment](#-deployment-vercel)
- [Excluded Files](#-files-not-included-in-repo)
- [FAQ](#-faq)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)
- [Author & License](#-author)

---

## 🔍 Overview

Electricity Forecast & Advisor analyzes historical electricity usage, forecasts future consumption with a GRU neural network, and turns those predictions into plain-language, actionable energy-saving advice — all through a lightweight dashboard you can run locally or use online right now.

> 💡 **No setup needed to try it** — the hosted demo is live and connects to real-time data on load.

---

## 🌐 Live Demo

**[eelctricity-forecost-advisor.vercel.app](https://eelctricity-forecost-advisor.vercel.app/)**

| What you'll see | What it does |
|---|---|
| 🔌 Real-time usage cards | Current kW draw, today's total kWh, expected peak hour, estimated cost so far |
| 📈 Predictions tab | Toggle between 24-hour, 48-hour, and 7-day forecasts |
| 🧠 AI Explanations tab | Human-readable breakdown of *why* the model predicts what it predicts |
| 💰 Energy Advice tab | On-demand 7-day savings plan with estimated ₹ savings per week |
| 📊 Analytics tab | Consumption trends, peak-hour analysis, and model training history |

---

## 📌 Features

- 📊 **Electricity Usage Analysis** — Analyzes historical consumption data
- 🤖 **GRU Deep Learning Model** — Predicts future electricity usage using ONNX Runtime
- 💡 **Smart Advice Generator** — Personalized, cost-aware energy-saving recommendations
- 📈 **Interactive Dashboard** — Live charts, tabs, and component-level breakdowns
- 🔮 **Multi-horizon Forecasting** — 24-hour, 48-hour, and 7-day prediction windows
- 🧠 **Explainable AI** — A dedicated panel that explains model reasoning, not just numbers
- ⚡ **Lightweight Deployment** — Optimized with ONNX (no TensorFlow in production, ~50MB vs ~500MB)

---

## 🖥️ Dashboard Tour

<details>
<summary><strong>📈 Predictions</strong> — click to expand</summary>

- Switch between **24 Hours / 48 Hours / 7 Days** views
- See **Peak Prediction (kW)**, **Average (kW)**, and **Estimated Weekly Cost (₹)** at a glance
- **Component Breakdown** shows which appliances/loads are driving usage
</details>

<details>
<summary><strong>🧠 AI Explanations</strong> — click to expand</summary>

- Plain-language explanations of the GRU model's forecast drivers
- Refreshable on demand so explanations stay current with the latest data
</details>

<details>
<summary><strong>💡 Energy Advice</strong> — click to expand</summary>

- Generate a **7-Day Plan** or view **General Advice**
- Shows **Potential Savings (₹ per week)** based on your usage pattern
</details>

<details>
<summary><strong>📊 Analytics & Insights</strong> — click to expand</summary>

- **Consumption Trends** over time
- **Peak Hours Analysis** to spot your costliest windows
- **Model Training History** for transparency into how the GRU model was built
</details>

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Python, Flask |
| ML Model | GRU Neural Network (ONNX Runtime) |
| Server | Gunicorn |
| Deployment | Vercel |

---

## 🗂️ Project Structure

```
Electricity/
├── client/                          # Frontend
│   ├── css/                         # Stylesheets
│   ├── js/                          # JavaScript files
│   └── index.html                   # Main HTML page
├── server/                          # Backend (Flask)
│   ├── artifacts/
│   │   └── model_artifacts/
│   │       └── gru_model.onnx       # Lightweight ONNX model
│   ├── advice_generator.py          # AI advice logic
│   ├── app.py                       # Flask app entry point
│   ├── data_processor.py            # Data preprocessing
│   ├── model_loader.py              # ONNX model loader
│   ├── model_predictor.py           # Prediction logic
│   ├── gunicorn_config.py           # Gunicorn config
│   └── requirements.txt             # Python dependencies
├── .gitignore
├── vercel.json                      # Vercel deployment config
├── start.sh                         # Linux start script
└── start.bat                        # Windows start script
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- pip

### 1. Clone the repository
```bash
git clone https://github.com/AsgharGhanghro/Electricty_Analyzer_And_Advisor.git
cd Electricty_Analyzer_And_Advisor
```

### 2. Install dependencies
```bash
cd server
pip install -r requirements.txt
```

### 3. Run it

| Platform | Command |
|---|---|
| Linux/Mac | `chmod +x start.sh && ./start.sh` |
| Windows | `start.bat` |
| Manual (any OS) | `cd server && python app.py` |

### 4. Open in your browser
```
http://localhost:5000
```

---

## 🌐 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/` | Serves the frontend dashboard |
| `POST` | `/api/predict` | Returns electricity usage prediction |
| `POST` | `/api/advice` | Returns energy-saving advice |
| `GET`  | `/api/health` | Health check |

Click any endpoint below to see a ready-to-run example.

<details>
<summary><code>POST /api/predict</code> — get a usage forecast</summary>

```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
        "horizon": "24h",
        "history_kwh": [1.2, 1.4, 1.1, 0.9, 2.3]
      }'
```

**Example response:**
```json
{
  "horizon": "24h",
  "peak_kw": 3.4,
  "average_kw": 1.8,
  "estimated_cost": 245.60
}
```
</details>

<details>
<summary><code>POST /api/advice</code> — get an energy-saving plan</summary>

```bash
curl -X POST http://localhost:5000/api/advice \
  -H "Content-Type: application/json" \
  -d '{ "plan_type": "7_day" }'
```

**Example response:**
```json
{
  "plan_type": "7_day",
  "estimated_savings": 620,
  "recommendations": [
    "Shift laundry loads to off-peak hours (10pm–6am)",
    "Reduce AC setpoint by 1°C during peak hours"
  ]
}
```
</details>

<details>
<summary><code>GET /api/health</code> — check service status</summary>

```bash
curl http://localhost:5000/api/health
```

**Example response:**
```json
{ "status": "ok", "model_loaded": true }
```
</details>

---

## 🤖 Model Details

| Property | Value |
|----------|-------|
| Architecture | GRU (Gated Recurrent Unit) |
| Format | ONNX (converted from `.h5`) |
| Runtime | ONNX Runtime |
| Purpose | Electricity consumption forecasting |

> The model was originally trained with TensorFlow/Keras and converted to ONNX for lightweight Vercel deployment (~50MB vs ~500MB).

**Core dependencies:**
```
Flask==2.3.3
flask-cors==4.0.0
numpy==1.24.3
pandas==1.5.3
scikit-learn==1.3.0
onnxruntime==1.16.0
gunicorn==21.2.0
```

---

## ☁️ Deployment (Vercel)

Deployed with:
- Frontend served as static files
- Backend running as Python serverless functions
- ONNX model for lightweight inference

```json
{
  "version": 2,
  "builds": [
    { "src": "client/index.html", "use": "@vercel/static" },
    { "src": "server/app.py", "use": "@vercel/python" }
  ]
}
```

---

## 📁 Files Not Included in Repo

Excluded via `.gitignore` due to size:

| File | Reason |
|------|--------|
| `*.h5` | Large TensorFlow model (~200MB) |
| `*.pkl` | Large pickle files |
| `*.csv` | Large dataset files |
| `*.ipynb` | Jupyter notebooks |
| `venv/` | Virtual environment |
| `.env` | Environment variables |

---

## ❓ FAQ

<details>
<summary>Do I need TensorFlow installed to run this?</summary><br>

No. Production inference uses the ONNX-converted model via ONNX Runtime, so TensorFlow is only needed if you want to retrain the model from scratch.
</details>

<details>
<summary>Can I use my own electricity usage data?</summary><br>

Yes — feed historical `kWh`/`kW` readings into `data_processor.py`, which prepares the input sequence for the GRU model. See `model_predictor.py` for the expected input shape.
</details>

<details>
<summary>Why doesn't the repo include the trained model file?</summary><br>

The original `.h5` model (~200MB) is excluded via `.gitignore` to keep the repo lightweight. Only the smaller, converted `gru_model.onnx` used for inference is checked in.
</details>

<details>
<summary>Does the live demo use real data or sample data?</summary><br>

The hosted demo at <a href="https://eelctricity-forecost-advisor.vercel.app/">eelctricity-forecost-advisor.vercel.app</a> is meant to showcase the forecasting and advice pipeline end-to-end. Run it locally with your own dataset for production use.
</details>

<details>
<summary>Can I deploy this somewhere other than Vercel?</summary><br>

Yes. The backend is a standard Flask app served with Gunicorn (see `gunicorn_config.py`), so it can run on any platform that supports Python WSGI apps (Render, Railway, a VPS, Docker, etc.) — `vercel.json` is only needed for Vercel's serverless setup.
</details>

---

## 🤝 Contributing

Contributions are welcome! Here's the quick workflow:

<details>
<summary>Click to expand contribution steps</summary>

1. **Fork** the repository
2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and commit
   ```bash
   git commit -m "Add: your feature description"
   ```
4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** describing what you changed and why

</details>

---

## 🗺️ Roadmap

- [ ] User accounts & multi-household tracking
- [ ] Push/email alerts for predicted usage spikes
- [ ] Downloadable weekly savings reports (PDF)
- [ ] Mobile-first PWA support

---

## ⭐ Star History

<a href="https://star-history.com/#AsgharGhanghro/Electricty_Analyzer_And_Advisor&Date">
  <img src="https://api.star-history.com/svg?repos=AsgharGhanghro/Electricty_Analyzer_And_Advisor&type=Date" alt="Star History Chart" width="500"/>
</a>

---

## 👤 Author

**Asghar Ghanghro**
GitHub: [@AsgharGhanghro](https://github.com/AsgharGhanghro)

## 📄 License

Licensed under the [MIT License](#-license).

## 🙏 Acknowledgements

- TensorFlow / Keras — model training
- ONNX Runtime — lightweight inference
- Flask — backend API
- Vercel — free hosting

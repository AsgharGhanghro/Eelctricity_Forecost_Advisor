# ⚡ Electricity Forecost & Advisor

An AI-powered web application that analyzes electricity consumption patterns and provides smart energy-saving advice using a GRU (Gated Recurrent Unit) deep learning model.



## 📌 Features

- 📊 **Electricity Usage Analysis** — Analyzes historical consumption data
- 🤖 **GRU Deep Learning Model** — Predicts future electricity usage using ONNX runtime
- 💡 **Smart Advice Generator** — Provides personalized energy-saving recommendations
- 📈 **Interactive Dashboard** — Visual charts and insights
- ⚡ **Lightweight Deployment** — Optimized with ONNX (no TensorFlow in production)

---

## 🗂️ Project Structure

```
Electricity/
├── client/                  # Frontend
│   ├── css/                 # Stylesheets
│   ├── js/                  # JavaScript files
│   └── index.html           # Main HTML page
├── server/                  # Backend (Flask)
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
├── vercel.json              # Vercel deployment config
├── start.sh                 # Linux start script
└── start.bat                # Windows start script
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Python, Flask |
| ML Model | GRU Neural Network (ONNX Runtime) |
| Deployment | Vercel |
| Server | Gunicorn |

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.9+
- pip

### 1. Clone the Repository
```bash
git clone https://github.com/AsgharGhanghro/Electricty_Analyzer_And_Advisor.git
cd Electricty_Analyzer_And_Advisor
```

### 2. Install Dependencies
```bash
cd server
pip install -r requirements.txt
```

### 3. Run the App

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

**Windows:**
```bash
start.bat
```

**Or manually:**
```bash
cd server
python app.py
```

### 4. Open in Browser
```
http://localhost:5000
```

---

## 🤖 Model Details

| Property | Value |
|----------|-------|
| Architecture | GRU (Gated Recurrent Unit) |
| Format | ONNX (converted from .h5) |
| Runtime | ONNX Runtime |
| Purpose | Electricity consumption forecasting |

> The model was originally trained with TensorFlow/Keras and converted to ONNX format for lightweight Vercel deployment (~50MB vs ~500MB).

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Serves frontend |
| POST | `/api/predict` | Returns electricity prediction |
| POST | `/api/advice` | Returns energy-saving advice |
| GET | `/api/health` | Health check |

---

## 📦 Dependencies

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

## 🚀 Deployment (Vercel)

This project is deployed on **Vercel** with:
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

## 📁 Files NOT Included in Repo

The following files are excluded via `.gitignore` due to size:

| File | Reason |
|------|--------|
| `*.h5` | Large TensorFlow model (~200MB) |
| `*.pkl` | Large pickle files |
| `*.csv` | Large dataset files |
| `*.ipynb` | Jupyter notebooks |
| `venv/` | Virtual environment |
| `.env` | Environment variables |

---

## 👤 Author

**Asghar Ghanghro**
- GitHub: [@AsgharGhanghro](https://github.com/AsgharGhanghro)

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- TensorFlow / Keras for model training
- ONNX Runtime for lightweight inference
- Flask for the backend API
- Vercel for free hosting

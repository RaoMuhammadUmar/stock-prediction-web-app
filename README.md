# 📈 Stock Market Price Prediction Web App

A **full-stack AI-powered stock prediction system** that forecasts Apple stock prices using **ARIMA, LSTM, and Prophet models**, combined with an interactive web dashboard for visualization and analysis.

---
## 🎥 Project Demo

👉 Click to watch full working demo:

[▶ Watch Demo Video](apps/apple_stock_analysis/frontend/public/assets/web-preview.mp4)

## 🚀 Live Features

<img width="947" height="427" alt="{C0EC254F-29F0-4252-AD96-7EC617B6F129}" src="https://github.com/user-attachments/assets/d928dd21-fa6b-4fd5-8024-2a0c1e2be114" />


- 📊 Interactive stock price dashboard
- 🤖 AI-based predictions using multiple models
- 📈 Historical trend visualization
- 🔮 Future price forecasting
- ⚡ Real-time data-driven insights

---

## 🧠 Machine Learning Models
<img width="931" height="437" alt="{446C812F-4D9F-4674-9530-4C59F70FE48E}" src="https://github.com/user-attachments/assets/5d5cccf3-4101-4b27-af2f-e5549156db2f" />


### 📉 ARIMA (Statistical Model)
- Captures time-series patterns using AR, I, and MA components
- Best for short-term forecasting
- ARIMA(2,1,2) configuration used

---

### 🤖 LSTM (Deep Learning Model)
<img width="949" height="440" alt="{75BA5364-7DE4-4DBC-8380-1FC1D8A688F8}" src="https://github.com/user-attachments/assets/54c24f6c-e1e8-4e1b-a571-0b822b7607dc" />

- Captures long-term dependencies in stock prices
- Uses stacked LSTM layers + Dense output layer
- Learns complex temporal patterns

---

### 📅 Prophet (Facebook AI)
- Handles trend + seasonality automatically
- Effective for business time-series forecasting
- Provides interpretable components

---

## 📂 Dataset

- Apple stock historical data (1980–2024)
- Features: Open, High, Low, Close
- ~11,094 records
- No missing values

---

## 🛠️ Tech Stack

### Frontend
- React / Vite
- TypeScript
- Tailwind CSS

### Backend
- Python
- Flask / FastAPI (if applicable)
- Pandas, NumPy

### ML Libraries
- Scikit-learn
- Statsmodels
- TensorFlow / Keras
- Prophet

---

## 📊 Key Insights

- Stock data is **non-stationary**
- Strong correlation between OHLC values
- LSTM provides best long-term pattern learning
- ARIMA performs well for short-term trends
- Prophet captures seasonality effectively

---

## 🏁 Final Outcome

This project demonstrates how combining **traditional statistics + deep learning + time-series forecasting** leads to more robust stock prediction systems.

---

## 💡 Future Improvements

- Live stock API integration
- Portfolio tracking system
- Sentiment analysis (news + Twitter)
- Deployment on cloud (Vercel / AWS)

---

## 👨‍💻 Author

Rao Muhammad Umar  
Full-Stack AI Developer

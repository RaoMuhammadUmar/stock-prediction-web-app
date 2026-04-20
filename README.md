# 📈 Stock Market Price Prediction Web App

A full-stack machine learning web application that predicts stock prices using **ARIMA, LSTM, and Prophet models** with interactive visualizations and a real-time forecasting dashboard.

---

## 📌 Project Overview

This project analyzes historical Apple stock data and applies multiple forecasting models to predict future stock prices. It combines statistical modeling, deep learning, and time series forecasting techniques.

---

## 🛠️ Libraries and Tools Used

### 📊 Data Processing
- NumPy – numerical computations
- Pandas – data manipulation

### 📈 Visualization
- Matplotlib – plotting graphs
- Seaborn – statistical visualization

### ⚙️ Machine Learning / Preprocessing
- Scikit-learn (MinMaxScaler) – feature scaling
- Keras – deep learning (LSTM model)

### 📉 Statistical Modeling
- Statsmodels – ARIMA model + ADF test
- Prophet – time series forecasting with seasonality

---

## 📂 Dataset

- Historical Apple stock data (CSV file)
- Columns: `Date`, `Open`, `High`, `Low`, `Close`
- Time range: 1980 – 2024
- Total records: ~11,094

### Key Insight:
- No missing values in dataset
- Close price is the main prediction target

---

## 📊 Data Visualization

- Line plots used to analyze stock trends
- Shows long-term growth, spikes, and volatility in Apple stock

---

## 🔍 Stationarity Check (ADF Test)

- ADF Statistic: 4.83  
- p-value: 1.0  

### Conclusion:
- Data is **non-stationary**
- First-order differencing applied (`Close_diff`) to stabilize data

---

## 🔗 Correlation Analysis

- Heatmap used to analyze relationships between:
  - Open
  - High
  - Low
  - Close

### Insight:
- Strong correlation between Close, High, and Low prices

---

## 📉 ARIMA Model

### Configuration:
- ARIMA(2,1,2)

### Parameters:
- AR(1): 0.6954
- AR(2): -0.4979
- MA(1): -0.7078
- MA(2): 0.4776

### Model Performance:
- AIC: 29593.536
- BIC: 29630.106
- Ljung-Box p-value: 0.87 (no autocorrelation in residuals)

---

## 🤖 LSTM Model

### Architecture:
- LSTM Layer (50 units)
- LSTM Layer (50 units)
- Dense Layer (25 units)
- Output Layer (1 value prediction)

### Training:
- Epochs: 20
- Batch size: 32

### Performance:
- Loss decreases consistently → model converges successfully

---

## 📊 LSTM Predictions

- Predictions closely follow actual stock trends
- Captures long-term dependencies in price movement

---

## 📅 Prophet Forecasting

- Handles trend + seasonality (yearly, weekly)
- Produces future stock price predictions
- Includes decomposition of seasonal components

---

## 🏁 Conclusion

This project compares three forecasting approaches:

### 📌 ARIMA
- Strong statistical time series model
- Good for short-term forecasting

### 📌 LSTM
- Deep learning-based model
- Captures complex patterns and long-term dependencies

### 📌 Prophet
- Best for seasonality and trend analysis
- Simple and effective forecasting tool

---

## 🚀 Final Insight

Combining multiple models provides a more robust understanding of stock behavior and improves forecasting reliability.

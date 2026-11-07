# Multi-Calculator Web App (React + Vite)

A modern, responsive multi-calculator web application built with **React**, **Vite**, **Bootstrap 5**, and **ECharts**.

<p align="center">
  <img src="src/img/screenshoot.png" alt="Calculator App Screenshot" width="700" />
</p>

## ✨ Features

### 📅 Age Calculator (`#/`)
- **3-Part Date Picker**: Day dropdown (1–31), Month dropdown (Jan–Dec), and numeric Year input.
- **Smart Validation**: Dynamic day options per month, leap year detection, and future date checks.
- **Detailed Time Breakdown**:
  - Primary age in years, months, and days
  - Total months + remaining days
  - Total weeks + remaining days
  - Total days, hours, minutes, and seconds
- **Utilities**: One-click **Copy Result** and **Reset** buttons. Defaults to yesterday's date.

### ⚖️ BMI Calculator (`#/bmi`)
- **Inputs**: Height in Feet.Inches (e.g. `5.8`) and Weight in KG (e.g. `68`).
- **Interactive Gauge Chart**: Visual ECharts gauge meter with color-coded BMI zones.
- **Avatar Illustrations**: Dynamically shows the corresponding category character for Underweight, Healthy, Overweight, Obese, or Extra Obese.
- **Threshold Reference**: Color-coded category summary badges.

### 🧭 Navigation & Architecture
- **Sliding Indicator Navbar**: Smooth `.hori-selector` animation tracking active routes natively in React.
- **Hash Routing**: Built with `react-router-dom` using `HashRouter` for 100% compatibility with static hosting (GitHub Pages).
- **Automated Deployment**: GitHub Actions workflow included for automated GitHub Pages deploys.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm`

### Installation

```bash
# Clone the repository
git clone https://github.com/wapborhan/age-calculator.git
cd age-calculator

# Install dependencies
npm install
```

### Running Locally

```bash
# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Building for Production

```bash
# Build production bundle to /dist
npm run build

# Preview production build locally
npm run preview
```

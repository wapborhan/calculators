import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Calculator from "./components/Calculator";
import AgeCalculator from "./components/AgeCalculator";
import BmiCalculator from "./components/BmiCalculator";
import GradeCalculator from "./components/GradeCalculator";
import LoveCalculator from "./components/LoveCalculator";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/age" element={<AgeCalculator />} />
          <Route path="/bmi" element={<BmiCalculator />} />
          <Route path="/grade" element={<GradeCalculator />} />
          <Route path="/love" element={<LoveCalculator />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

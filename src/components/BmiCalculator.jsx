import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
import img1 from "../assets/bmi/1.png";
import img2 from "../assets/bmi/2.png";
import img3 from "../assets/bmi/3.png";
import img4 from "../assets/bmi/4.png";
import img5 from "../assets/bmi/5.png";

export default function BmiCalculator() {
  const [height, setHeight] = useState("5.8");
  const [weight, setWeight] = useState("68");
  const [hasCalculated, setHasCalculated] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [bmiResult, setBmiResult] = useState(() => {
    return calculateBMI("5.8", "68");
  });

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  function calculateBMI(hVal, wVal) {
    if (!hVal || !wVal) {
      return { error: "Please enter both Height and Weight!" };
    }

    const h = parseFloat(hVal);
    const w = parseFloat(wVal);

    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      return {
        error: "Please enter valid positive numbers for Height and Weight!",
      };
    }

    // Convert height (Feet.Inches) to meters:
    // e.g. 5.8 -> 5 feet 8 inches, 5.10 -> 5 feet 10 inches
    let heightInMeters;
    const hStr = hVal.toString().trim();
    if (hStr.includes(".")) {
      const [feetPart, inchPart] = hStr.split(".");
      const feet = parseInt(feetPart, 10) || 0;
      const inches = parseFloat(inchPart) || 0;
      const totalInches = feet * 12 + inches;
      heightInMeters = totalInches * 0.0254;
    } else {
      heightInMeters = h * 0.3048;
    }

    if (heightInMeters <= 0) {
      return { error: "Invalid height value entered!" };
    }

    const bmi = parseFloat((w / (heightInMeters * heightInMeters)).toFixed(2));

    let category = "Healthy";
    let color = "#73c7a3";
    let img = img2;

    if (bmi < 18.5) {
      category = "Underweight";
      color = "#89b7d8";
      img = img1;
    } else if (bmi >= 18.5 && bmi < 25) {
      category = "Healthy";
      color = "#73c7a3";
      img = img2;
    } else if (bmi >= 25 && bmi < 30) {
      category = "Overweight";
      color = "#feda0a";
      img = img3;
    } else if (bmi >= 30 && bmi < 40) {
      category = "Obese";
      color = "#f99f51";
      img = img4;
    } else {
      category = "Extra Obese";
      color = "#ef464d";
      img = img5;
    }

    return { bmi, category, color, img, error: null };
  }

  const handleCalculate = (e) => {
    if (e) e.preventDefault();

    const result = calculateBMI(height, weight);
    if (result.error) {
      setErrorMessage(result.error);
      setBmiResult(null);
      setHasCalculated(false);
    } else {
      setErrorMessage("");
      setBmiResult(result);
      setHasCalculated(true);
    }
  };

  const handleReset = (e) => {
    if (e) e.preventDefault();
    setHeight("");
    setWeight("");
    setErrorMessage("");
    setBmiResult(null);
    setHasCalculated(false);
    if (chartInstance.current) {
      chartInstance.current.dispose();
      chartInstance.current = null;
    }
  };

  // Initialize and update ECharts gauge
  useEffect(() => {
    if (!chartRef.current || !hasCalculated || !bmiResult || !bmiResult.bmi) {
      return;
    }

    let chart = echarts.getInstanceByDom(chartRef.current);
    if (!chart) {
      chart = echarts.init(chartRef.current);
      chartInstance.current = chart;
    }

    const option = {
      series: [
        {
          type: "gauge",
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          splitNumber: 5,
          axisLine: {
            lineStyle: {
              width: 12,
              color: [
                [0.184, "#89b7d8"],
                [0.25, "#73c7a3"],
                [0.3, "#feda0a"],
                [0.4, "#f99f51"],
                [1, "#ef464d"],
              ],
            },
          },
          pointer: {
            icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
            length: "14%",
            width: 16,
            offsetCenter: [0, "-60%"],
            itemStyle: {
              color: "auto",
            },
          },
          axisTick: {
            length: 10,
            lineStyle: {
              color: "auto",
              width: 2,
            },
          },
          splitLine: {
            length: 16,
            lineStyle: {
              color: "auto",
              width: 3,
            },
          },
          title: {
            offsetCenter: [0, "-20%"],
            fontSize: 22,
            fontWeight: 600,
            color: "#4a5568",
          },
          detail: {
            fontSize: 36,
            offsetCenter: [0, "0%"],
            valueAnimation: true,
            formatter: function (value) {
              return value.toFixed(1);
            },
            color: "auto",
          },
          data: [
            {
              value: bmiResult.bmi,
              name: "BMI",
            },
          ],
        },
      ],
    };

    chart.setOption(option, true);

    const timer = setTimeout(() => {
      if (chart) chart.resize();
    }, 50);

    const handleResize = () => {
      if (chart) chart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [bmiResult, hasCalculated]);

  return (
    <div className="main-wraper py-4">
      <div className="container">
        <div className="row g-4 justify-content-center">
          {/* Input Card */}
          <div className="col-lg-4 col-md-5">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-primary text-light fw-bold py-3 d-flex justify-content-between align-items-center">
                <span>
                  <i className="fas fa-weight me-2"></i>
                  BMI Calculator
                </span>
                <button
                  className="btn btn-sm btn-outline-light"
                  type="button"
                  onClick={handleReset}
                  title="Reset inputs and clear result"
                >
                  <i className="fas fa-redo-alt me-1"></i> Reset
                </button>
              </div>

              <div className="card-body p-4">
                <form onSubmit={handleCalculate}>
                  <div className="mb-3">
                    <label
                      htmlFor="height"
                      className="form-label fw-semibold text-secondary"
                    >
                      Height (Feet.Inches)
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="fas fa-ruler-vertical text-muted"></i>
                      </span>
                      <input
                        type="number"
                        step="any"
                        id="height"
                        className="form-control"
                        placeholder="e.g. 5.8 (5ft 8in)"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-text">Example: 5.8 for 5ft 8in, 5.10 for 5ft 10in</div>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="weight"
                      className="form-label fw-semibold text-secondary"
                    >
                      Weight (KG)
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="fas fa-weight-hanging text-muted"></i>
                      </span>
                      <input
                        type="number"
                        step="any"
                        id="weight"
                        className="form-control"
                        placeholder="e.g. 68"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-text">Example: 68 for 68 kg</div>
                  </div>

                  <button
                    className="btn btn-success w-100 py-2 fs-5 fw-bold shadow-sm"
                    type="submit"
                  >
                    <i className="fas fa-calculator me-2"></i>
                    Calculate BMI
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="col-lg-8 col-md-7">
            <div
              id="card-res"
              className="card shadow-sm border-0 w-100 h-100"
            >
              <div className="card-header bg-danger text-light fw-bold py-3">
                <i className="fas fa-poll me-2"></i>
                BMI Result
              </div>

              <div className="card-body p-4 text-center">
                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {errorMessage}
                  </div>
                )}

                {hasCalculated && bmiResult ? (
                  <div>
                    <h3 className="comment mb-3">
                      You are{" "}
                      <span
                        className="fw-bold px-3 py-1 rounded text-white"
                        style={{ backgroundColor: bmiResult.color }}
                      >
                        {bmiResult.category}
                      </span>
                    </h3>

                    <div className="row align-items-center justify-content-center g-3">
                      {/* Gauge Chart */}
                      <div className="col-12 col-md-7">
                        <div
                          ref={chartRef}
                          style={{
                            width: "100%",
                            height: "320px",
                            margin: "0 auto",
                          }}
                        ></div>
                      </div>

                      {/* Avatar Image */}
                      <div className="col-12 col-md-5">
                        <div className="p-2 border rounded bg-light shadow-xs">
                          <img
                            id="show-img"
                            src={bmiResult.img}
                            alt={bmiResult.category}
                            className="img-fluid"
                            style={{
                              maxHeight: "260px",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Category Legend */}
                    <div className="row g-2 mt-3 pt-3 border-top">
                      <div className="col">
                        <div
                          className="p-1 rounded small text-white fw-bold"
                          style={{
                            backgroundColor: "#89b7d8",
                            fontSize: "0.75rem",
                          }}
                        >
                          &lt; 18.5
                          <br />
                          Underweight
                        </div>
                      </div>
                      <div className="col">
                        <div
                          className="p-1 rounded small text-white fw-bold"
                          style={{
                            backgroundColor: "#73c7a3",
                            fontSize: "0.75rem",
                          }}
                        >
                          18.5 - 24.9
                          <br />
                          Healthy
                        </div>
                      </div>
                      <div className="col">
                        <div
                          className="p-1 rounded small text-white fw-bold"
                          style={{
                            backgroundColor: "#feda0a",
                            fontSize: "0.75rem",
                          }}
                        >
                          25 - 29.9
                          <br />
                          Overweight
                        </div>
                      </div>
                      <div className="col">
                        <div
                          className="p-1 rounded small text-white fw-bold"
                          style={{
                            backgroundColor: "#f99f51",
                            fontSize: "0.75rem",
                          }}
                        >
                          30 - 39.9
                          <br />
                          Obese
                        </div>
                      </div>
                      <div className="col">
                        <div
                          className="p-1 rounded small text-white fw-bold"
                          style={{
                            backgroundColor: "#ef464d",
                            fontSize: "0.75rem",
                          }}
                        >
                          &ge; 40
                          <br />
                          Extra Obese
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-5 text-muted">
                    <i className="fas fa-weight-scale fa-3x mb-3 text-secondary opacity-50"></i>
                    <p className="fs-5 mb-1 fw-semibold text-secondary">
                      Ready to Calculate
                    </p>
                    <p className="small text-muted mb-0">
                      Enter your height and weight on the left and click{" "}
                      <strong>Calculate BMI</strong>.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

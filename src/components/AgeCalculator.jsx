import React, { useState } from "react";
import DateInputGroup from "./DateInputGroup";
import { calculateDetailedAge } from "../utils/ageCalculator";

export default function AgeCalculator() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // State for Date of Birth (defaults to yesterday)
  const [dob, setDob] = useState({
    day: yesterday.getDate(),
    month: yesterday.getMonth(),
    year: yesterday.getFullYear(),
  });

  // State for Target Date (Age at the Date of)
  const [targetDate, setTargetDate] = useState({
    day: today.getDate(),
    month: today.getMonth(),
    year: today.getFullYear(),
  });

  const [hasCalculated, setHasCalculated] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [breakdown, setBreakdown] = useState(() => {
    const initialCalc = calculateDetailedAge(
      {
        day: yesterday.getDate(),
        month: yesterday.getMonth(),
        year: yesterday.getFullYear(),
      },
      {
        day: today.getDate(),
        month: today.getMonth(),
        year: today.getFullYear(),
      }
    );
    return initialCalc.isValid ? initialCalc.breakdown : null;
  });

  const [copied, setCopied] = useState(false);

  const handleCalculate = (e) => {
    if (e) e.preventDefault();
    setHasCalculated(true);

    const calculation = calculateDetailedAge(dob, targetDate);
    if (!calculation.isValid) {
      setErrorMessage(calculation.error);
      setBreakdown(null);
    } else {
      setErrorMessage("");
      setBreakdown(calculation.breakdown);
    }
  };

  const handleReset = () => {
    const yest = new Date();
    yest.setDate(yest.getDate() - 1);
    setDob({
      day: yest.getDate(),
      month: yest.getMonth(),
      year: yest.getFullYear(),
    });
    setTargetDate({
      day: today.getDate(),
      month: today.getMonth(),
      year: today.getFullYear(),
    });
    setHasCalculated(false);
    setErrorMessage("");
    setBreakdown(null);
  };

  const handleCopy = () => {
    if (!breakdown) return;
    const textToCopy = `Age:
${breakdown.years} years ${breakdown.months} months ${breakdown.days} days
or ${breakdown.totalMonths} months ${breakdown.days} days
or ${breakdown.totalWeeks} weeks ${breakdown.remDays} days
or ${breakdown.totalDays.toLocaleString()} days
or ${breakdown.totalHours.toLocaleString()} hours
or ${breakdown.totalMinutes.toLocaleString()} minutes
or ${breakdown.totalSeconds.toLocaleString()} seconds`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="main-wraper py-4">
      <div className="container">
        <div className="row g-4 justify-content-center">
          {/* Input Card */}
          <div className="col-lg-6">
            <div className="card text-left shadow-sm border-0 h-100">
              <div className="card-header bg-primary text-light fw-bold py-3 d-flex justify-content-between align-items-center">
                <span>
                  <i className="fas fa-calendar-alt me-2"></i>
                  Calculate Age from Date of Birth
                </span>
                <button
                  className="btn btn-sm btn-outline-light"
                  type="button"
                  onClick={handleReset}
                  title="Reset to default"
                >
                  <i className="fas fa-redo-alt me-1"></i> Reset
                </button>
              </div>

              <div className="card-body p-4">
                <form onSubmit={handleCalculate}>
                  {/* Date of Birth Picker */}
                  <div className="mb-4">
                    <DateInputGroup
                      label="Date of Birth:"
                      idPrefix="dob"
                      value={dob}
                      onChange={setDob}
                    />
                    <div className="form-text mt-1 text-muted">
                      Select Day (1-31), Month (Jan-Dec), and Year
                    </div>
                  </div>

                  {/* Age at the Date of Picker */}
                  <div className="mb-4">
                    <DateInputGroup
                      label="Age at the Date of:"
                      idPrefix="target"
                      value={targetDate}
                      onChange={setTargetDate}
                    />
                    <div className="form-text mt-1 text-muted">
                      Defaults to today, or select any target date
                    </div>
                  </div>

                  {/* Calculate Button */}
                  <button
                    className="btn btn-success w-100 py-2 fs-5 fw-bold shadow-sm"
                    type="submit"
                  >
                    <i className="fas fa-calculator me-2"></i>
                    Calculate age
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="col-lg-6">
            <div
              id="card-res"
              className="card w-100 shadow-sm border-0 h-100"
              style={{ display: hasCalculated ? "block" : "none" }}
            >
              <div className="card-header bg-danger text-light fw-bold py-3 d-flex justify-content-between align-items-center">
                <span>
                  <i className="fas fa-poll me-2"></i>
                  Result
                </span>
                {breakdown && (
                  <button
                    className="btn btn-sm btn-outline-light"
                    type="button"
                    onClick={handleCopy}
                    title="Copy result to clipboard"
                  >
                    <i
                      className={`fas ${copied ? "fa-check" : "fa-copy"} me-1`}
                    ></i>
                    {copied ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>

              <div className="card-body p-4">
                {errorMessage && (
                  <div className="alert alert-danger mb-0" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {errorMessage}
                  </div>
                )}

                {breakdown && (
                  <div className="age-result-box bg-light rounded p-4 border">
                    <div className="text-secondary fw-bold text-uppercase fs-6 mb-2">
                      Age:
                    </div>

                    <div className="primary-age mb-3 pb-3 border-bottom">
                      <span className="fs-3 fw-bold text-primary">
                        {breakdown.years} years {breakdown.months} months{" "}
                        {breakdown.days} days
                      </span>
                    </div>

                    <ul className="list-unstyled mb-0 d-flex flex-column gap-2 text-dark fs-5">
                      <li className="d-flex align-items-center">
                        <span className="text-muted me-2" style={{ minWidth: "25px" }}>
                          or
                        </span>
                        <span>
                          <strong>{breakdown.totalMonths}</strong> months{" "}
                          {breakdown.days} days
                        </span>
                      </li>
                      <li className="d-flex align-items-center">
                        <span className="text-muted me-2" style={{ minWidth: "25px" }}>
                          or
                        </span>
                        <span>
                          <strong>{breakdown.totalWeeks}</strong> weeks{" "}
                          {breakdown.remDays} days
                        </span>
                      </li>
                      <li className="d-flex align-items-center">
                        <span className="text-muted me-2" style={{ minWidth: "25px" }}>
                          or
                        </span>
                        <span>
                          <strong>{breakdown.totalDays.toLocaleString()}</strong>{" "}
                          days
                        </span>
                      </li>
                      <li className="d-flex align-items-center">
                        <span className="text-muted me-2" style={{ minWidth: "25px" }}>
                          or
                        </span>
                        <span>
                          <strong>{breakdown.totalHours.toLocaleString()}</strong>{" "}
                          hours
                        </span>
                      </li>
                      <li className="d-flex align-items-center">
                        <span className="text-muted me-2" style={{ minWidth: "25px" }}>
                          or
                        </span>
                        <span>
                          <strong>
                            {breakdown.totalMinutes.toLocaleString()}
                          </strong>{" "}
                          minutes
                        </span>
                      </li>
                      <li className="d-flex align-items-center">
                        <span className="text-muted me-2" style={{ minWidth: "25px" }}>
                          or
                        </span>
                        <span>
                          <strong>
                            {breakdown.totalSeconds.toLocaleString()}
                          </strong>{" "}
                          seconds
                        </span>
                      </li>
                    </ul>
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

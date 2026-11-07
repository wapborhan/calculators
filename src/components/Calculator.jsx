import React, { useState, useEffect, useCallback } from "react";
import "./Calculator.css";

export default function Calculator() {
  const [display, setDisplay] = useState("");
  const [prevEquation, setPrevEquation] = useState("");

  const handleInput = useCallback((val) => {
    setDisplay((prev) => {
      // Prevent consecutive operators like ++, **, //
      const operators = ["+", "-", "*", "/"];
      if (
        operators.includes(val) &&
        operators.includes(prev.slice(-1))
      ) {
        return prev.slice(0, -1) + val;
      }
      return prev + val;
    });
  }, []);

  const handleClear = useCallback(() => {
    setDisplay("");
    setPrevEquation("");
  }, []);

  const handleBackspace = useCallback(() => {
    setDisplay((prev) => prev.slice(0, -1));
  }, []);

  const handleSqrt = useCallback(() => {
    setDisplay((prev) => {
      if (!prev) return "";
      try {
        // Evaluate expression first if needed, then take sqrt
        // eslint-disable-next-line no-new-func
        const evaluated = Function(`'use strict'; return (${prev})`)();
        if (evaluated < 0) return "Error";
        const res = Math.sqrt(evaluated);
        setPrevEquation(`√(${prev})`);
        return parseFloat(res.toFixed(8)).toString();
      } catch (e) {
        return "Error";
      }
    });
  }, []);

  const handleSolve = useCallback(() => {
    setDisplay((prev) => {
      if (!prev) return "";
      try {
        // Sanitize string to only allow numbers and safe math operators
        const sanitized = prev.replace(/[^0-9+\-*/.]/g, "");
        if (!sanitized) return "";
        // Safely evaluate math expression
        // eslint-disable-next-line no-new-func
        const result = Function(`'use strict'; return (${sanitized})`)();
        if (result === Infinity || result === -Infinity || isNaN(result)) {
          return "Error";
        }
        setPrevEquation(prev);
        return parseFloat(Number(result).toFixed(8)).toString();
      } catch (err) {
        return "Error";
      }
    });
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      if (
        (key >= "0" && key <= "9") ||
        key === "." ||
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
      ) {
        e.preventDefault();
        handleInput(key);
      } else if (key === "Enter" || key === "=") {
        e.preventDefault();
        handleSolve();
      } else if (key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      } else if (key === "Escape" || key === "c" || key === "C") {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleInput, handleSolve, handleBackspace, handleClear]);

  return (
    <div className="calculator-page-wrapper">
      <div className="calc-main-container shadow">
        {/* Top Header */}
        <section className="calc-top-container">
          <div className="calc-icon-left" title="Calculator">🖩</div>
          <h2 className="calc-heading">SR Calculator</h2>
          <div className="calc-icon-right" title="Calculator">🖩</div>
        </section>

        {/* Calculator Body */}
        <div className="calc-body-wrapper">
          {prevEquation && (
            <div className="calc-prev-equation text-muted small text-end pe-3 mb-1">
              {prevEquation} =
            </div>
          )}

          <div className="calc-screen-box mb-3">
            <input
              className="calc-result-screen"
              type="text"
              id="result"
              readOnly
              value={display || "0"}
              placeholder="0"
            />
          </div>

          {/* Button Grid matching cal/index.html */}
          <table className="calc-table">
            <tbody>
              {/* Row 1: AC, empty, C */}
              <tr>
                <td colSpan="2">
                  <button
                    type="button"
                    className="calc-btn oparetorc"
                    id="del"
                    onClick={handleBackspace}
                    title="Delete / Backspace"
                  >
                    AC
                  </button>
                </td>
                <td></td>
                <td colSpan="2">
                  <button
                    type="button"
                    className="calc-btn oparetorc"
                    onClick={handleClear}
                    title="Clear"
                  >
                    C
                  </button>
                </td>
              </tr>

              {/* Row 2: 7, 8, 9, *, / */}
              <tr>
                <td>
                  <button
                    type="button"
                    className="calc-btn btn-num"
                    onClick={() => handleInput("7")}
                  >
                    7
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="calc-btn btn-num"
                    onClick={() => handleInput("8")}
                  >
                    8
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="calc-btn btn-num"
                    onClick={() => handleInput("9")}
                  >
                    9
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="calc-btn btn-op play"
                    onClick={() => handleInput("*")}
                    title="Multiply"
                  >
                    *
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="calc-btn btn-op play"
                    onClick={() => handleInput("/")}
                    title="Divide"
                  >
                    /
                  </button>
                </td>
              </tr>

              {/* Row 3: 4, 5, 6, + (rowspan 2), - */}
              <tr>
                <td>
                  <button
                    type="button"
                    className="calc-btn btn-num"
                    onClick={() => handleInput("4")}
                  >
                    4
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="calc-btn btn-num"
                    onClick={() => handleInput("5")}
                  >
                    5
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="calc-btn btn-num"
                    onClick={() => handleInput("6")}
                  >
                    6
                  </button>
                </td>
                <td rowSpan="2">
                  <button
                    type="button"
                    className="calc-btn oparetoradd"
                    onClick={() => handleInput("+")}
                    title="Add"
                  >
                    +
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="calc-btn btn-op play"
                    onClick={() => handleInput("-")}
                    title="Subtract"
                  >
                    -
                  </button>
                </td>
              </tr>

              {/* Row 4: 1, 2, 3, √ */}
              <tr>
                <td>
                  <button
                    type="button"
                    className="calc-btn btn-num"
                    onClick={() => handleInput("1")}
                  >
                    1
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="calc-btn btn-num"
                    onClick={() => handleInput("2")}
                  >
                    2
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="calc-btn btn-num"
                    onClick={() => handleInput("3")}
                  >
                    3
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="calc-btn btn-op play"
                    onClick={handleSqrt}
                    title="Square Root"
                  >
                    √
                  </button>
                </td>
              </tr>

              {/* Row 5: 0, ., 00, = */}
              <tr>
                <td>
                  <button
                    type="button"
                    className="calc-btn btn-num"
                    onClick={() => handleInput("0")}
                  >
                    0
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="calc-btn btn-num"
                    onClick={() => handleInput(".")}
                  >
                    .
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="calc-btn btn-num"
                    onClick={() => handleInput("00")}
                  >
                    00
                  </button>
                </td>
                <td colSpan="2">
                  <button
                    type="button"
                    className="calc-btn oparetoreq"
                    onClick={handleSolve}
                    title="Calculate Result"
                  >
                    =
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


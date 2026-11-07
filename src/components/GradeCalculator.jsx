import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import "./GradeCalculator.css";

// Official Bangladesh Grading Scale
export const GRADE_SCALE = [
  { grade: "A+", point: 5.0, minMarks: 80, maxMarks: 100 },
  { grade: "A", point: 4.0, minMarks: 70, maxMarks: 79 },
  { grade: "A-", point: 3.5, minMarks: 60, maxMarks: 69 },
  { grade: "B", point: 3.0, minMarks: 50, maxMarks: 59 },
  { grade: "C", point: 2.0, minMarks: 40, maxMarks: 49 },
  { grade: "D", point: 1.0, minMarks: 33, maxMarks: 39 },
  { grade: "F", point: 0.0, minMarks: 0, maxMarks: 32 },
];

export function getGradeFromMarks(marks) {
  const m = parseFloat(marks);
  if (isNaN(m) || m < 0) return { grade: "F", point: 0.0 };
  if (m >= 80) return { grade: "A+", point: 5.0 };
  if (m >= 70) return { grade: "A", point: 4.0 };
  if (m >= 60) return { grade: "A-", point: 3.5 };
  if (m >= 50) return { grade: "B", point: 3.0 };
  if (m >= 40) return { grade: "C", point: 2.0 };
  if (m >= 33) return { grade: "D", point: 1.0 };
  return { grade: "F", point: 0.0 };
}

export function getPointFromGrade(grade) {
  const found = GRADE_SCALE.find((g) => g.grade === grade);
  return found ? found.point : 0.0;
}

export function getGradeBadgeClass(grade) {
  switch (grade) {
    case "A+":
      return "bg-success text-white";
    case "A":
      return "bg-primary text-white";
    case "A-":
      return "bg-info text-dark";
    case "B":
      return "bg-secondary text-white";
    case "C":
      return "bg-warning text-dark";
    case "D":
      return "bg-warning text-dark";
    case "F":
      return "bg-danger text-white";
    default:
      return "bg-light text-dark";
  }
}

// Preset subjects matching Bangladesh Education Boards
const DEFAULT_SCIENCE_SUBJECTS = [
  {
    id: "1",
    code: "101",
    name: "BENGALI",
    marks: 85,
    grade: "A+",
    isOptional: false,
  },
  {
    id: "2",
    code: "107",
    name: "ENGLISH",
    marks: 82,
    grade: "A+",
    isOptional: false,
  },
  {
    id: "3",
    code: "109",
    name: "MATHEMATICS",
    marks: 92,
    grade: "A+",
    isOptional: false,
  },
  {
    id: "4",
    code: "145",
    name: "SOCIAL SCIENCE",
    marks: 80,
    grade: "A+",
    isOptional: false,
  },
  {
    id: "5",
    code: "111",
    name: "RELIGION, ISLAM",
    marks: 88,
    grade: "A+",
    isOptional: false,
  },
  {
    id: "6",
    code: "136",
    name: "PHYSICS",
    marks: 84,
    grade: "A+",
    isOptional: false,
  },
  {
    id: "7",
    code: "137",
    name: "CHEMISTRY",
    marks: 81,
    grade: "A+",
    isOptional: false,
  },
  {
    id: "8",
    code: "126",
    name: "HIGHER MATHEMATICS",
    marks: 95,
    grade: "A+",
    isOptional: false,
  },
  {
    id: "9",
    code: "138",
    name: "BIOLOGY",
    marks: 86,
    grade: "A+",
    isOptional: true,
  },
];

const DEFAULT_COMMERCE_SUBJECTS = [
  {
    id: "1",
    code: "101",
    name: "BENGALI",
    marks: 82,
    grade: "A+",
    isOptional: false,
  },
  {
    id: "2",
    code: "107",
    name: "ENGLISH",
    marks: 80,
    grade: "A+",
    isOptional: false,
  },
  {
    id: "3",
    code: "109",
    name: "MATHEMATICS",
    marks: 85,
    grade: "A+",
    isOptional: false,
  },
  {
    id: "4",
    code: "146",
    name: "GENERAL SCIENCE",
    marks: 78,
    grade: "A",
    isOptional: false,
  },
  {
    id: "5",
    code: "111",
    name: "RELIGION, ISLAM",
    marks: 85,
    grade: "A+",
    isOptional: false,
  },
  {
    id: "6",
    code: "146",
    name: "ACCOUNTING",
    marks: 90,
    grade: "A+",
    isOptional: false,
  },
  {
    id: "7",
    code: "152",
    name: "FINANCE & BANKING",
    marks: 84,
    grade: "A+",
    isOptional: false,
  },
  {
    id: "8",
    code: "153",
    name: "BUSINESS ENTREPRENEURSHIP",
    marks: 81,
    grade: "A+",
    isOptional: false,
  },
  {
    id: "9",
    code: "134",
    name: "AGRICULTURE STUDIES",
    marks: 88,
    grade: "A+",
    isOptional: true,
  },
];

const DEFAULT_HUMANITIES_SUBJECTS = [
  {
    id: "1",
    code: "101",
    name: "BENGALI",
    marks: 85,
    grade: "A+",
    isOptional: false,
  },
  {
    id: "2",
    code: "107",
    name: "ENGLISH",
    marks: 75,
    grade: "A",
    isOptional: false,
  },
  {
    id: "3",
    code: "109",
    name: "MATHEMATICS",
    marks: 80,
    grade: "A+",
    isOptional: false,
  },
  {
    id: "4",
    code: "146",
    name: "GENERAL SCIENCE",
    marks: 82,
    grade: "A+",
    isOptional: false,
  },
  {
    id: "5",
    code: "111",
    name: "RELIGION, ISLAM",
    marks: 86,
    grade: "A+",
    isOptional: false,
  },
  {
    id: "6",
    code: "110",
    name: "GEOGRAPHY & ENVIRONMENT",
    marks: 83,
    grade: "A+",
    isOptional: false,
  },
  {
    id: "7",
    code: "150",
    name: "HISTORY OF BANGLADESH",
    marks: 81,
    grade: "A+",
    isOptional: false,
  },
  {
    id: "8",
    code: "140",
    name: "CIVICS & CITIZENSHIP",
    marks: 88,
    grade: "A+",
    isOptional: false,
  },
  {
    id: "9",
    code: "141",
    name: "ECONOMICS",
    marks: 85,
    grade: "A+",
    isOptional: true,
  },
];

const BOARDS = [
  "BARISAL",
  "CHITTAGONG",
  "COMILLA",
  "DHAKA",
  "DINAJPUR",
  "JESSORE",
  "MYMENSINGH",
  "RAJSHAHI",
  "SYLHET",
  "MADRASAH",
  "TECHNICAL",
];

const EXAMS = [
  "SSC/Dakhil/Equivalent",
  "HSC/Alim/Equivalent",
  "JSC/JDC",
  "DIBS",
];

export default function GradeCalculator() {
  const [studentInfo, setStudentInfo] = useState({
    exam: "SSC/Dakhil/Equivalent",
    year: "2014",
    roll: "103077",
    regNo: "1112233445",
    board: "CHITTAGONG",
    name: "MAHMUDUL HASAN NAYEEM",
    fatherName: "HARUN-OR-RASHID BADAL",
    motherName: "BAGUM MAFUGA BADAL",
    group: "SCIENCE",
    type: "REGULAR",
    dob: "05-12-1997",
    institute: "COLLEGIATE SCHOOL, CHITTAGONG",
  });

  const [subjects, setSubjects] = useState(DEFAULT_SCIENCE_SUBJECTS);
  const [showPreview, setShowPreview] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [calcNotice, setCalcNotice] = useState("");

  const sheetRef = useRef(null);

  // Group change handler to auto-load default subjects
  const handleGroupChange = (newGroup) => {
    setStudentInfo((prev) => ({ ...prev, group: newGroup }));
    if (newGroup === "SCIENCE") {
      setSubjects(DEFAULT_SCIENCE_SUBJECTS);
    } else if (newGroup === "BUSINESS STUDIES") {
      setSubjects(DEFAULT_COMMERCE_SUBJECTS);
    } else if (newGroup === "HUMANITIES") {
      setSubjects(DEFAULT_HUMANITIES_SUBJECTS);
    }
  };

  const handleStudentInfoChange = (field, value) => {
    setStudentInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleMarksChange = (id, marksVal) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id === id) {
          const marks =
            marksVal === "" ? "" : Math.max(0, Math.min(100, Number(marksVal)));
          const { grade } = getGradeFromMarks(marks);
          return { ...sub, marks, grade };
        }
        return sub;
      }),
    );
  };

  const handleSubjectChange = (id, field, value) => {
    setSubjects((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, [field]: value } : sub)),
    );
  };

  const handleToggleOptional = (id) => {
    setSubjects((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, isOptional: !sub.isOptional } : sub,
      ),
    );
  };

  const handleAddSubject = () => {
    const newId = Date.now().toString();
    const defaultMarks = 80;
    const { grade } = getGradeFromMarks(defaultMarks);
    setSubjects((prev) => [
      ...prev,
      {
        id: newId,
        code: "150",
        name: "NEW SUBJECT",
        marks: defaultMarks,
        grade,
        isOptional: false,
      },
    ]);
  };

  const handleRemoveSubject = (id) => {
    if (subjects.length <= 1) return;
    setSubjects((prev) => prev.filter((sub) => sub.id !== id));
  };

  // GPA calculation according to Bangladesh Education Board rules
  const calculateResult = () => {
    const mandatorySubs = subjects.filter((s) => !s.isOptional);
    const optionalSubs = subjects.filter((s) => s.isOptional);

    if (mandatorySubs.length === 0) {
      return { gpa: "0.00", result: "FAILED", isPassed: false, totalPoints: 0 };
    }

    // Check if any mandatory subject failed
    let hasFailedMandatory = false;
    let mandatoryPointsSum = 0;

    mandatorySubs.forEach((sub) => {
      const point = getPointFromGrade(sub.grade);
      if (point === 0 || sub.grade === "F") {
        hasFailedMandatory = true;
      }
      mandatoryPointsSum += point;
    });

    if (hasFailedMandatory) {
      return {
        gpa: "0.00",
        result: "FAILED",
        isPassed: false,
        totalPoints: mandatoryPointsSum,
      };
    }

    // 4th / Optional subject point calculation
    let optionalBonus = 0;
    if (optionalSubs.length > 0) {
      optionalSubs.forEach((optSub) => {
        const optPoint = getPointFromGrade(optSub.grade);
        // Only points above 2.0 are added
        if (optPoint > 2.0) {
          optionalBonus += optPoint - 2.0;
        }
      });
    }

    const totalCalculatedPoints = mandatoryPointsSum + optionalBonus;
    const rawGpa = totalCalculatedPoints / mandatorySubs.length;
    const finalGpa = Math.min(5.0, rawGpa);

    return {
      gpa: finalGpa.toFixed(2),
      result: "PASSED",
      isPassed: true,
      totalPoints: totalCalculatedPoints,
    };
  };

  const resultData = calculateResult();

  const handleCalculateAndPreview = (e) => {
    if (e) e.preventDefault();
    setShowPreview(true);
    setCalcNotice("Result sheet generated successfully!");
    setTimeout(() => setCalcNotice(""), 3500);

    // Scroll to preview on mobile/smaller screens
    setTimeout(() => {
      if (sheetRef.current) {
        sheetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Download high-resolution PNG using html2canvas
  const handleDownloadImage = async () => {
    if (!sheetRef.current) return;
    setIsDownloading(true);

    try {
      const element = sheetRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution (Retina quality)
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      const filename = `${studentInfo.exam.split("/")[0]}_Result_${studentInfo.roll}_${studentInfo.year}.png`;
      link.href = image;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to download image. You can also use the Print/PDF button.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Trigger Print / PDF Save Dialog
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="grade-calculator-wrapper py-4">
      <div className="container">
        {/* Top Header & Overview */}
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h2 className="fw-bold title-text">
              <i className="fas fa-graduation-cap me-2 text-primary"></i>
              Demo Education Board Grade Calculator
            </h2>
            <p className="text-muted">
              Calculate SSC/HSC/JSC grade point average (GPA), preview the
              authentic Education Board result sheet, and download as PNG/PDF.
            </p>
          </div>
        </div>

        {calcNotice && (
          <div
            className="alert alert-success alert-dismissible fade show text-center py-2"
            role="alert"
          >
            <i className="fas fa-check-circle me-2"></i> {calcNotice}
          </div>
        )}

        {/* View Switcher Tabs (Only shown on mobile/tablet screens < lg, hidden on desktop >= lg) */}
        <div className="d-flex d-lg-none justify-content-center mb-3 view-toggle-bar">
          <div
            className="btn-group w-100 shadow-sm"
            role="group"
            aria-label="View toggle"
          >
            <button
              type="button"
              className={`btn py-2 fw-semibold ${!showPreview ? "btn-primary active" : "btn-outline-primary"}`}
              onClick={() => {
                setShowPreview(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <i className="fas fa-edit me-1"></i> Edit Form
            </button>
            <button
              type="button"
              className={`btn py-2 fw-semibold ${showPreview ? "btn-success active" : "btn-outline-success"}`}
              onClick={() => {
                setShowPreview(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <i className="fas fa-file-alt me-1"></i> Result Preview
            </button>
          </div>
        </div>

        <div className="row g-4">
          {/* LEFT: Input Form (collapsible on mobile, or side-by-side on desktop) */}
          <div
            className={`col-lg-5 ${showPreview ? "d-none d-lg-block" : "col-12"}`}
          >
            <div className="card shadow-sm border-0 input-card">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3">
                <h5 className="mb-0 fw-semibold">
                  <i className="fas fa-sliders-h me-2"></i> Result Details &
                  Marks
                </h5>
                <span className="badge bg-light text-primary">
                  Board Format
                </span>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleCalculateAndPreview}>
                  {/* Basic Examination Info */}
                  <h6 className="section-subtitle mb-3 text-secondary border-bottom pb-1">
                    <i className="fas fa-university me-1"></i> Examination Info
                  </h6>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">
                        Examination
                      </label>
                      <select
                        className="form-select form-select-sm"
                        value={studentInfo.exam}
                        onChange={(e) =>
                          handleStudentInfoChange("exam", e.target.value)
                        }
                      >
                        {EXAMS.map((ex) => (
                          <option key={ex} value={ex}>
                            {ex}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Year</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={studentInfo.year}
                        onChange={(e) =>
                          handleStudentInfoChange("year", e.target.value)
                        }
                        placeholder="e.g. 2014 or 2024"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Board</label>
                      <select
                        className="form-select form-select-sm"
                        value={studentInfo.board}
                        onChange={(e) =>
                          handleStudentInfoChange("board", e.target.value)
                        }
                      >
                        {BOARDS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Group</label>
                      <select
                        className="form-select form-select-sm"
                        value={studentInfo.group}
                        onChange={(e) => handleGroupChange(e.target.value)}
                      >
                        <option value="SCIENCE">SCIENCE</option>
                        <option value="BUSINESS STUDIES">
                          BUSINESS STUDIES
                        </option>
                        <option value="HUMANITIES">HUMANITIES</option>
                      </select>
                    </div>
                  </div>

                  {/* Student Details */}
                  <h6 className="section-subtitle mb-3 text-secondary border-bottom pb-1">
                    <i className="fas fa-user-graduate me-1"></i> Student
                    Details
                  </h6>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">
                        Roll No
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={studentInfo.roll}
                        onChange={(e) =>
                          handleStudentInfoChange("roll", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Type</label>
                      <select
                        className="form-select form-select-sm"
                        value={studentInfo.type}
                        onChange={(e) =>
                          handleStudentInfoChange("type", e.target.value)
                        }
                      >
                        <option value="REGULAR">REGULAR</option>
                        <option value="IRREGULAR">IRREGULAR</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold">
                        Student Name
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm text-uppercase"
                        value={studentInfo.name}
                        onChange={(e) =>
                          handleStudentInfoChange("name", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">
                        Father's Name
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm text-uppercase"
                        value={studentInfo.fatherName}
                        onChange={(e) =>
                          handleStudentInfoChange("fatherName", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">
                        Mother's Name
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm text-uppercase"
                        value={studentInfo.motherName}
                        onChange={(e) =>
                          handleStudentInfoChange("motherName", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">
                        Date of Birth
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={studentInfo.dob}
                        placeholder="DD-MM-YYYY"
                        onChange={(e) =>
                          handleStudentInfoChange("dob", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">
                        Institute
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm text-uppercase"
                        value={studentInfo.institute}
                        onChange={(e) =>
                          handleStudentInfoChange("institute", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Subject & Marks Entry */}
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-1 mb-3">
                    <h6 className="section-subtitle mb-0 text-secondary">
                      <i className="fas fa-book me-1"></i> Subjects & Marks
                      (Grade Auto-Calculated)
                    </h6>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success py-0 px-2"
                      onClick={handleAddSubject}
                    >
                      <i className="fas fa-plus me-1"></i> Add Subject
                    </button>
                  </div>

                  <div className="table-responsive subject-input-table mb-3">
                    <table className="table table-sm table-bordered align-middle">
                      <thead className="table-light small">
                        <tr>
                          <th style={{ width: "65px" }}>Code</th>
                          <th>Subject Name</th>
                          <th style={{ width: "70px" }}>Marks</th>
                          <th style={{ width: "65px" }} className="text-center">
                            Grade
                          </th>
                          <th
                            style={{ width: "50px" }}
                            title="4th / Optional Subject"
                          >
                            4th?
                          </th>
                          <th style={{ width: "35px" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjects.map((sub) => (
                          <tr
                            key={sub.id}
                            className={
                              sub.isOptional
                                ? "table-warning bg-opacity-25"
                                : ""
                            }
                          >
                            <td>
                              <input
                                type="text"
                                className="form-control form-control-sm text-center p-1"
                                value={sub.code}
                                onChange={(e) =>
                                  handleSubjectChange(
                                    sub.id,
                                    "code",
                                    e.target.value,
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control form-control-sm text-uppercase p-1"
                                value={sub.name}
                                onChange={(e) =>
                                  handleSubjectChange(
                                    sub.id,
                                    "name",
                                    e.target.value,
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                className="form-control form-control-sm text-center p-1 fw-bold"
                                placeholder="0-100"
                                value={sub.marks}
                                onChange={(e) =>
                                  handleMarksChange(sub.id, e.target.value)
                                }
                              />
                            </td>
                            <td className="text-center">
                              <span
                                className={`badge ${getGradeBadgeClass(sub.grade)} px-2 py-1`}
                              >
                                {sub.grade}
                              </span>
                            </td>
                            <td className="text-center">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={sub.isOptional}
                                onChange={() => handleToggleOptional(sub.id)}
                                title="Check if this is 4th / Optional Subject"
                              />
                            </td>
                            <td className="text-center">
                              <button
                                type="button"
                                className="btn btn-sm btn-link text-danger p-0"
                                onClick={() => handleRemoveSubject(sub.id)}
                                title="Delete Subject"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="text-muted small mb-3">
                    <i className="fas fa-info-circle me-1"></i>
                    Enter marks (0–100) for each subject. Grade and Grade Points
                    are automatically calculated based on board rules. Check{" "}
                    <strong>4th?</strong> for optional subject (points above 2.0
                    added as bonus).
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-bold text-uppercase shadow-sm"
                  >
                    <i className="fas fa-calculator me-2"></i> Calculate & View
                    Result Sheet
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* RIGHT: Authentic Bangladesh Education Board Result Preview */}
          <div
            className={`col-lg-7 ${!showPreview ? "d-none d-lg-block" : "col-12"}`}
          >
            {/* Download & Action bar */}
            <div className="card border-0 shadow-sm mb-3 download-action-card">
              <div className="card-body p-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
                <div>
                  <span className="badge bg-primary me-2 px-3 py-2 fs-6">
                    GPA: {resultData.gpa}
                  </span>
                  <span
                    className={`badge ${resultData.isPassed ? "bg-success" : "bg-danger"} px-3 py-2 fs-6`}
                  >
                    {resultData.result}
                  </span>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={handleDownloadImage}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-1"
                          role="status"
                        ></span>
                        Generating Image...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-download me-1"></i> Download Image
                        (PNG)
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handlePrint}
                  >
                    <i className="fas fa-print me-1"></i> Print / Save PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Horizontal scroll hint for mobile */}
            <div className="d-block d-md-none text-muted small text-center mb-2">
              <i className="fas fa-arrows-alt-h me-1 text-primary"></i>
              Swipe horizontally to view full result sheet
            </div>

            {/* PREVIEW SHEET MATCHING THE UPLOADED IMAGE */}
            <div className="preview-container-scroll">
              <div
                ref={sheetRef}
                id="printable-result-sheet"
                className="bd-result-card"
              >
                {/* 1. Official Header Banner */}
                <div className="bd-header-box">
                  <div className="bd-header-top">
                    {/* Bangladesh Government Logo SVG */}
                    <div className="bd-govt-logo-container">
                      <svg
                        className="bd-govt-logo"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="48"
                          fill="#ffffff"
                          stroke="#006a4e"
                          strokeWidth="3"
                        />
                        <circle cx="50" cy="50" r="40" fill="#006a4e" />
                        <circle cx="50" cy="50" r="34" fill="#ffffff" />
                        {/* Red inner disc */}
                        <circle cx="50" cy="50" r="23" fill="#f42a41" />
                        {/* Water lily emblem simplified */}
                        <path
                          d="M50 33 C47 43, 39 49, 39 55 C39 61, 46 64, 50 64 C54 64, 61 61, 61 55 C61 49, 53 43, 50 33 Z"
                          fill="#ffffff"
                        />
                        <path
                          d="M44 49 C39 46, 32 49, 33 55 C34 60, 42 62, 47 61 Z"
                          fill="#ffffff"
                        />
                        <path
                          d="M56 49 C61 46, 68 49, 67 55 C66 60, 58 62, 53 61 Z"
                          fill="#ffffff"
                        />
                        {/* Stars */}
                        <circle cx="50" cy="24" r="2.5" fill="#f42a41" />
                        <circle cx="43" cy="25" r="2" fill="#f42a41" />
                        <circle cx="57" cy="25" r="2" fill="#f42a41" />
                        <circle cx="50" cy="74" r="2.5" fill="#f42a41" />
                        {/* Bengali text simplified circle arc */}
                        <text
                          x="50"
                          y="18"
                          fontSize="5.5"
                          textAnchor="middle"
                          fill="#006a4e"
                          fontWeight="bold"
                        >
                          গণপ্রজাতন্ত্রী বাংলাদেশ
                        </text>
                        <text
                          x="50"
                          y="85"
                          fontSize="6.5"
                          textAnchor="middle"
                          fill="#006a4e"
                          fontWeight="bold"
                        >
                          সরকার
                        </text>
                      </svg>
                    </div>

                    {/* Banner Titles */}
                    <div className="bd-header-titles">
                      <h2 className="bd-title-ministry">Demo Education</h2>
                      <h1 className="bd-title-board">
                        Intermediate and Secondary Education Boards
                        <br />
                        Bangladesh
                      </h1>
                    </div>

                    {/* Subtle Bangladesh Flag circle watermark on top right */}
                    <div className="bd-flag-disc-watermark"></div>
                  </div>

                  {/* Sub-bar */}
                  <div className="bd-header-subbar">
                    <span>Demo Website of Practice</span>
                  </div>
                </div>

                {/* 2. Examination Title */}
                <div className="bd-exam-title">
                  {studentInfo.exam} Result {studentInfo.year}
                </div>

                {/* 3. Student Details Table (2-column key/value matching image) */}
                <table className="bd-details-table">
                  <tbody>
                    <tr>
                      <td className="bd-col-label">Roll No</td>
                      <td className="bd-col-val">{studentInfo.roll}</td>
                      <td className="bd-col-label">Name</td>
                      <td className="bd-col-val text-uppercase">
                        {studentInfo.name}
                      </td>
                    </tr>
                    <tr>
                      <td className="bd-col-label">Board</td>
                      <td className="bd-col-val text-uppercase">
                        {studentInfo.board}
                      </td>
                      <td className="bd-col-label">Father's Name</td>
                      <td className="bd-col-val text-uppercase">
                        {studentInfo.fatherName}
                      </td>
                    </tr>
                    <tr>
                      <td className="bd-col-label">Group</td>
                      <td className="bd-col-val text-uppercase">
                        {studentInfo.group}
                      </td>
                      <td className="bd-col-label">Mother's Name</td>
                      <td className="bd-col-val text-uppercase">
                        {studentInfo.motherName}
                      </td>
                    </tr>
                    <tr>
                      <td className="bd-col-label">Type</td>
                      <td className="bd-col-val text-uppercase">
                        {studentInfo.type}
                      </td>
                      <td className="bd-col-label">Date of Birth</td>
                      <td className="bd-col-val">{studentInfo.dob}</td>
                    </tr>
                    <tr>
                      <td className="bd-col-label">Result</td>
                      <td className="bd-col-val bd-result-passed">
                        {resultData.result}
                      </td>
                      <td className="bd-col-label">Institute</td>
                      <td className="bd-col-val text-uppercase">
                        {studentInfo.institute}
                      </td>
                    </tr>
                    <tr>
                      <td className="bd-col-label">GPA</td>
                      <td className="bd-col-val bd-gpa-val">
                        {resultData.gpa}
                      </td>
                      <td className="bd-col-label"></td>
                      <td className="bd-col-val"></td>
                    </tr>
                  </tbody>
                </table>

                {/* 4. Grade Sheet Heading */}
                <div className="bd-gradesheet-header">Grade Sheet</div>

                {/* 5. Subject Grade Table */}
                <table className="bd-gradesheet-table">
                  <thead>
                    <tr>
                      <th style={{ width: "15%" }}>Code</th>
                      <th style={{ width: "65%" }}>Subject</th>
                      <th style={{ width: "20%" }}>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((sub, idx) => (
                      <tr
                        key={sub.id}
                        className={idx % 2 === 1 ? "bd-row-alt" : ""}
                      >
                        <td className="bd-sub-code">{sub.code}</td>
                        <td className="bd-sub-name text-uppercase">
                          {sub.name}
                          {sub.isOptional && (
                            <span className="bd-optional-tag">
                              {" "}
                              (4th Subject)
                            </span>
                          )}
                        </td>
                        <td className="bd-sub-grade">{sub.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* 6. Search Again Action */}
                <div className="bd-search-again-container">
                  <button
                    type="button"
                    className="bd-search-again-btn"
                    onClick={() => {
                      setShowPreview(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Search Again
                  </button>
                </div>

                {/* 7. Green Divider Bar */}
                <div className="bd-green-divider"></div>

                {/* 8. Footer (Ministry of Education & Teletalk Powered By) */}
                <div className="bd-footer-bar">
                  <div className="bd-footer-left">
                    ©2005-{studentInfo.year || "2024"} Demo of Education, All
                    rights reserved.
                  </div>
                  <div className="bd-footer-right">
                    <span>Powered by</span>
                    {/* Teletalk SVG Brand Logo */}
                    Codes TrickZ
                  </div>
                </div>

                {/* Bottom Web URL Watermark (as visible in the printed uploaded image) */}
                {/* <div className="bd-bottom-print-watermark">
                  <span>www.educationboardresults.gov.bd/result.php</span>
                  <span>1/1</span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import "./LoveCalculator.css";

// Deterministic love score algorithm
export function calculateLoveScore(name1, name2) {
  if (!name1 || !name2) return 0;

  const n1 = name1.trim().toLowerCase();
  const n2 = name2.trim().toLowerCase();

  if (!n1 || !n2) return 0;

  // Exact match for the uploaded reference image ("Alex" & "Emma" = 84%)
  if ((n1 === "alex" && n2 === "emma") || (n1 === "emma" && n2 === "alex")) {
    return 84;
  }

  // Consistent order-independent algorithm
  const combined = [n1, n2].sort().join(" loves ");
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 31 + combined.charCodeAt(i)) % 1000000007;
  }

  // Generates a positive, fun score between 52% and 98%
  const score = 52 + (Math.abs(hash) % 47);
  return score;
}

export function getMatchDetails(score) {
  if (score >= 90) {
    return {
      label: "True Soulmates",
      desc: "Unbreakable cosmic connection! You two are destined for each other with incredible harmony.",
    };
  } else if (score >= 80) {
    return {
      label: "Strong Match",
      desc: "Incredible chemistry and deep mutual affection! Your connection is vibrant, loving, and full of joy.",
    };
  } else if (score >= 70) {
    return {
      label: "Great Chemistry",
      desc: "A wonderful spark with lots of warmth, shared laughter, and magnetic attraction.",
    };
  } else if (score >= 60) {
    return {
      label: "Good Potential",
      desc: "A sweet bond with genuine affection. With communication, your love will flourish beautifully.",
    };
  } else {
    return {
      label: "Sweet Spark",
      desc: "Opposites attract! Differences make your unique bond intriguing, passionate, and full of wonder.",
    };
  }
}

export default function LoveCalculator() {
  const [yourName, setYourName] = useState("Alex");
  const [partnerName, setPartnerName] = useState("Emma");
  const [targetScore, setTargetScore] = useState(84);
  const [displayScore, setDisplayScore] = useState(84);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState("");
  const [hasCalculated, setHasCalculated] = useState(true);
  const [floatingHearts, setFloatingHearts] = useState([]);

  const cardRef = useRef(null);

  // Animate the counter when targetScore changes
  useEffect(() => {
    let current = 0;
    const stepTime = Math.max(10, Math.floor(600 / (targetScore || 1)));
    const timer = setInterval(() => {
      current += 1;
      if (current >= targetScore) {
        setDisplayScore(targetScore);
        clearInterval(timer);
      } else {
        setDisplayScore(current);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetScore]);

  const triggerHeartsEffect = () => {
    const hearts = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 85 + 5,
      animationDuration: Math.random() * 1.5 + 1.2,
      size: Math.random() * 20 + 14,
    }));
    setFloatingHearts(hearts);
    setTimeout(() => setFloatingHearts([]), 2600);
  };

  const handleCalculate = (e) => {
    if (e) e.preventDefault();

    if (!yourName.trim() || !partnerName.trim()) {
      alert("Please enter both names to calculate love compatibility!");
      return;
    }

    setIsCalculating(true);
    triggerHeartsEffect();

    setTimeout(() => {
      const calculated = calculateLoveScore(yourName, partnerName);
      setTargetScore(calculated);
      setHasCalculated(true);
      setIsCalculating(false);
    }, 450);
  };

  // Download high-resolution Result Card Image
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 80));

      const element = cardRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // High-resolution Retina quality
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        onclone: (clonedDoc) => {
          // Ensure inputs in cloned document display current text properly
          const clonedInputs = clonedDoc.querySelectorAll(".pill-name-input");
          if (clonedInputs.length >= 2) {
            clonedInputs[0].setAttribute("value", yourName);
            clonedInputs[1].setAttribute("value", partnerName);
          }
        },
      });

      const image = canvas.toDataURL("image/png");
      const cleanYourName = yourName.trim().replace(/[^a-zA-Z0-9]/g, "_") || "Partner1";
      const cleanPartnerName = partnerName.trim().replace(/[^a-zA-Z0-9]/g, "_") || "Partner2";
      const filename = `Love_Calculator_${cleanYourName}_and_${cleanPartnerName}_${targetScore}percent.png`;

      const link = document.createElement("a");
      link.href = image;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadNotice("💖 Result image downloaded successfully!");
      setTimeout(() => setDownloadNotice(""), 4000);
    } catch (err) {
      console.error("Failed to download image:", err);
      alert("Could not generate image. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Share or copy result
  const handleShare = async () => {
    const text = `💖 Love Compatibility: ${yourName} & ${partnerName} = ${targetScore}% (${matchInfo.label})! Check yours on Love Calculator!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Love Calculator Result",
          text,
          url: window.location.href,
        });
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        setDownloadNotice("📋 Result copied to clipboard!");
        setTimeout(() => setDownloadNotice(""), 3500);
      } catch (e) {
        alert("Copied: " + text);
      }
    }
  };

  const matchInfo = getMatchDetails(targetScore);

  return (
    <div className="love-calc-page">
      {/* Floating Animated Hearts on click */}
      {floatingHearts.map((h) => (
        <span
          key={h.id}
          className="dynamic-floating-heart"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            animationDuration: `${h.animationDuration}s`,
          }}
        >
          ❤️
        </span>
      ))}

      {/* Background Decorative Glossy Hearts */}
      <div className="deco-heart deco-heart-left-1">💖</div>
      <div className="deco-heart deco-heart-left-2">💕</div>
      <div className="deco-heart deco-heart-left-3">💗</div>
      <div className="deco-heart deco-heart-right-1">💖</div>
      <div className="deco-heart deco-heart-right-2">💕</div>
      <div className="deco-heart deco-heart-right-3">💗</div>

      <div className="container py-4 position-relative love-calc-container">
        {/* Main Card */}
        <div ref={cardRef} className="love-card shadow-lg mx-auto">
          {/* Top Logo & Header */}
          <div className="love-card-top text-center">
            <div className="brand-logo-row d-flex align-items-center justify-content-center">
              <div className="brand-icon-circle me-2">
                <i className="fas fa-calculator text-white"></i>
                <span className="brand-heart-badge">❤️</span>
              </div>
              {/* <div className="brand-title-wrap">
                <span className="brand-name-dark">Calculators</span>
                <span className="brand-name-pink">Global</span>
              </div> */}
            </div>
            <p className="brand-tagline">
              <span className="heart-dot">💖</span> Smart Calculators for Every
              Need <span className="heart-dot">💖</span>
            </p>
          </div>

          {/* Title with Doodles & Ribbon Banner */}
          <div className="love-title-section text-center position-relative mt-2">
            <div className="title-doodle title-doodle-left">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <h1 className="love-script-title">Love Calculator</h1>

            <div className="title-doodle title-doodle-right">
              <span></span>
              <span></span>
              <span></span>
            </div>

            {/* Magenta Ribbon */}
            <div className="love-ribbon-wrap">
              <div className="love-ribbon">
                <span className="ribbon-text">
                  💖 Check Your Love Compatibility by Names 💖
                </span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleCalculate} className="love-inputs-form mt-4">
            <div className="row g-3 align-items-center justify-content-center names-row">
              {/* Your Name Input */}
              <div className="col-md-5 col-sm-12">
                <div className="input-field-group">
                  <label className="field-label text-center d-block">
                    <span className="heart-dot">💖</span> Your Name{" "}
                    <span className="heart-dot">💖</span>
                  </label>
                  <div className="pill-input-box">
                    <div className="input-avatar-icon">
                      <i className="fas fa-user"></i>
                    </div>
                    <input
                      type="text"
                      className="pill-name-input"
                      placeholder="Your Name"
                      value={yourName}
                      onChange={(e) => setYourName(e.target.value)}
                      maxLength={30}
                    />
                  </div>
                </div>
              </div>

              {/* Center Interlocked Hearts Icon */}
              <div className="col-md-2 col-sm-12 text-center my-2 my-md-0 d-flex justify-content-center align-items-center">
                <div className="intertwined-hearts-btn shadow">
                  <div className="cupid-arrow-left">➸</div>
                  <div className="hearts-center-icon">
                    <i className="fas fa-heart main-heart-icon"></i>
                    <i className="far fa-heart inner-heart-1"></i>
                    <i className="far fa-heart inner-heart-2"></i>
                  </div>
                  <div className="cupid-arrow-right">➸</div>
                </div>
              </div>

              {/* Partner's Name Input */}
              <div className="col-md-5 col-sm-12">
                <div className="input-field-group">
                  <label className="field-label text-center d-block">
                    <span className="heart-dot">💖</span> Partner's Name{" "}
                    <span className="heart-dot">💖</span>
                  </label>
                  <div className="pill-input-box">
                    <div className="input-avatar-icon">
                      <i className="fas fa-user"></i>
                    </div>
                    <input
                      type="text"
                      className="pill-name-input"
                      placeholder="Partner's Name"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      maxLength={30}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Connecting Curved Dotted Arrows on Desktop */}
            <div className="connecting-arrows-row d-none d-md-flex justify-content-between px-5">
              <div className="curved-dotted-arrow arrow-left">
                <svg width="90" height="40" viewBox="0 0 90 40" fill="none">
                  <path
                    d="M10 5 C 25 35, 65 35, 80 35"
                    stroke="#e83e8c"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                  />
                  <polygon points="80,30 88,35 80,40" fill="#e83e8c" />
                </svg>
              </div>
              <div className="curved-dotted-arrow arrow-right">
                <svg width="90" height="40" viewBox="0 0 90 40" fill="none">
                  <path
                    d="M80 5 C 65 35, 25 35, 10 35"
                    stroke="#e83e8c"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                  />
                  <polygon points="10,30 2,35 10,40" fill="#e83e8c" />
                </svg>
              </div>
            </div>

            {/* Compatibility Result Box */}
            <div className="compatibility-result-card mx-auto mt-3">
              {/* Top Badge */}
              <div className="compat-top-badge">
                <span className="heart-dot">💖</span> Your Love Compatibility{" "}
                <span className="heart-dot">💖</span>
              </div>

              {/* Huge Percentage with Side Sparkles */}
              <div className="score-display-wrapper position-relative">
                <span className="side-sparkle sparkle-left">✨</span>
                <div
                  className={`score-number ${isCalculating ? "pulsing" : ""}`}
                >
                  {displayScore}%
                </div>
                <span className="side-sparkle sparkle-right">✨</span>
              </div>

              {/* Match Label */}
              <div className="match-status-title">
                <span className="heart-dot">💖</span> {matchInfo.label}{" "}
                <span className="heart-dot">💖</span>
              </div>

              {/* Description */}
              <p className="match-description mb-0 text-muted">
                {matchInfo.desc}
              </p>
            </div>

            {/* Actions Buttons Row */}
            <div
              className="d-flex flex-wrap align-items-center justify-content-center gap-3 mt-4"
              data-html2canvas-ignore="true"
            >
              <button
                type="submit"
                className="calculate-love-btn shadow"
                disabled={isCalculating || isDownloading}
              >
                <i className="fas fa-calculator me-2"></i>
                <span>
                  {isCalculating ? "Calculating Love..." : "Calculate Love"}
                </span>
                <span className="ms-2">💖</span>
              </button>

              <button
                type="button"
                className="download-image-btn shadow-sm"
                onClick={handleDownloadImage}
                disabled={isDownloading || isCalculating}
                title="Download high-resolution image of this result card"
              >
                {isDownloading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span>Generating Image...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-download me-2"></i>
                    <span>Download Result Image</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="share-result-btn shadow-sm"
                onClick={handleShare}
                title="Share or copy love result"
              >
                <i className="fas fa-share-alt me-2"></i>
                <span>Share</span>
              </button>
            </div>

            {/* Download Notification Alert */}
            {downloadNotice && (
              <div
                className="alert alert-success py-2 px-3 mx-auto mt-3 text-center shadow-sm love-alert-box"
                role="alert"
                data-html2canvas-ignore="true"
              >
                {downloadNotice}
              </div>
            )}
          </form>

          {/* Bottom Features Banner */}
          <div className="love-features-footer mt-5">
            <div className="row g-2 text-center">
              <div className="col-6 col-md-3 feature-item">
                <div className="feature-icon-box">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <div className="feature-title">100% Free</div>
                <div className="feature-sub">No Sign Up Required</div>
              </div>

              <div className="col-6 col-md-3 feature-item">
                <div className="feature-icon-box">
                  <i className="fas fa-bolt"></i>
                </div>
                <div className="feature-title">Instant Result</div>
                <div className="feature-sub">Get Result in 1 Click</div>
              </div>

              <div className="col-6 col-md-3 feature-item">
                <div className="feature-icon-box">
                  <i className="fas fa-user-shield"></i>
                </div>
                <div className="feature-title">Privacy Friendly</div>
                <div className="feature-sub">Your Data Is Safe</div>
              </div>

              <div className="col-6 col-md-3 feature-item">
                <div className="feature-icon-box">
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <div className="feature-title">Mobile Friendly</div>
                <div className="feature-sub">Works on All Devices</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

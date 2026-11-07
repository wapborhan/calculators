import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const navItems = [
  {
    id: "calculate",
    label: "Calculate",
    icon: "fas fa-tachometer-alt",
    path: "/",
  },
  {
    id: "age-calculate",
    label: "Age Calculate",
    icon: "fas fa-house-user",
    path: "/age",
  },
  {
    id: "bmi-calculate",
    label: "BMI Calculate",
    icon: "far fa-clone",
    path: "/bmi",
  },
  {
    id: "grade-calculate",
    label: "Grade Calculate",
    icon: "far fa-calendar-alt",
    path: "/grade",
  },
  {
    id: "love-calculate",
    label: "Love Calculate",
    icon: "fas fa-heart",
    path: "/love",
  },
];

export default function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const location = useLocation();

  // Find active item matching current route
  const activeNavItem = navItems.find((item) => item.path === location.pathname);
  const currentTab = activeNavItem ? activeNavItem.id : "";

  const [selectorStyle, setSelectorStyle] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  const tabRefs = useRef({});

  const updateSelectorPosition = (immediate = false) => {
    const activeEl = currentTab ? tabRefs.current[currentTab] : null;
    if (activeEl) {
      setSelectorStyle({
        top: activeEl.offsetTop,
        left: activeEl.offsetLeft,
        height: activeEl.offsetHeight,
        width: activeEl.offsetWidth,
        opacity: 1,
      });
      if (immediate) {
        setIsReady(true);
      }
    } else {
      setSelectorStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  useEffect(() => {
    // Initial measurement
    updateSelectorPosition(true);

    const handleResize = () => {
      updateSelectorPosition(false);
    };

    window.addEventListener("resize", handleResize);

    // Re-check when fonts are loaded for pixel-perfect positioning
    if (document.fonts) {
      document.fonts.ready.then(() => {
        updateSelectorPosition(false);
      });
    }

    const timer = setTimeout(() => {
      updateSelectorPosition(false);
      setIsReady(true);
    }, 60);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [currentTab, isCollapsed]);

  const toggleNavbar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const closeNavbar = () => {
    if (!isCollapsed) {
      setIsCollapsed(true);
    }
  };

  return (
    <header className="navbar-header">
      <nav className="navbar navbar-expand-custom navbar-mainbg">
        <div className="container">
          <Link
            className="navbar-brand navbar-logo d-flex align-items-center"
            to="/"
            onClick={closeNavbar}
          >
            <img src={logo} className="imglogo" alt="Logo" />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            aria-controls="navbarSupportedContent"
            aria-expanded={!isCollapsed}
            aria-label="Toggle navigation"
            onClick={toggleNavbar}
          >
            <i className="fas fa-bars text-white"></i>
          </button>

          <div
            className={`navbar-collapse ${
              isCollapsed ? "collapse-custom-hide" : "collapse-custom-show"
            }`}
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav ms-auto position-relative">
              {/* Sliding Active Indicator (Desktop only) */}
              <div
                className={`hori-selector ${isReady ? "has-transition" : ""}`}
                style={{
                  top: `${selectorStyle.top}px`,
                  left: `${selectorStyle.left}px`,
                  height: `${selectorStyle.height}px`,
                  width: `${selectorStyle.width}px`,
                  opacity: selectorStyle.opacity,
                }}
              >
                <div className="left"></div>
                <div className="right"></div>
              </div>

              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <li
                    key={item.id}
                    ref={(el) => (tabRefs.current[item.id] = el)}
                    className={`nav-item ${isActive ? "active" : ""}`}
                    onClick={closeNavbar}
                  >
                    <Link className="nav-link" to={item.path}>
                      <i className={item.icon}></i>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

/* Quickmove — Global Logistics ERP theme presets */
(function (global) {
  "use strict";

  var THEMES = {
    "midnight-logistics": {
      name: "Midnight Logistics",
      desc: "Modern slate · default",
      swatch: ["#0F172A", "#2563EB", "#F8FAFC"],
      vars: {
        "--nav": "#1E293B", "--nav-2": "#0F172A", "--nav-accent": "#2563EB", "--nav-active": "#2563EB",
        "--nav-text": "#E2E8F0", "--nav-muted": "#94A3B8", "--logo-accent": "#60A5FA",
        "--primary": "#2563EB", "--primary-dk": "#1D4ED8", "--primary-lt": "#EFF6FF",
        "--menu-panel": "#FFFFFF", "--menu-panel-hd": "#F8FAFC", "--menu-hover": "#F1F5F9",
        "--menu-active": "#EFF6FF", "--menu-active-bd": "#BFDBFE", "--page": "#F1F5F9"
      }
    },
    "ocean-freight": {
      name: "Ocean Freight",
      desc: "Deep sea · Maersk-style",
      swatch: ["#0C4A6E", "#0284C7", "#F0F9FF"],
      vars: {
        "--nav": "#0C4A6E", "--nav-2": "#082F49", "--nav-accent": "#0284C7", "--nav-active": "#0284C7",
        "--nav-text": "#E0F2FE", "--nav-muted": "#7DD3FC", "--logo-accent": "#38BDF8",
        "--primary": "#0284C7", "--primary-dk": "#0369A1", "--primary-lt": "#E0F2FE",
        "--menu-panel": "#FFFFFF", "--menu-panel-hd": "#F0F9FF", "--menu-hover": "#E0F2FE",
        "--menu-active": "#BAE6FD", "--menu-active-bd": "#7DD3FC", "--page": "#F0F9FF"
      }
    },
    "sap-fiori": {
      name: "SAP Fiori",
      desc: "Enterprise blue · SAP",
      swatch: ["#354A5F", "#0A6ED1", "#F5F6F7"],
      vars: {
        "--nav": "#354A5F", "--nav-2": "#223548", "--nav-accent": "#0A6ED1", "--nav-active": "#0A6ED1",
        "--nav-text": "#EAECEE", "--nav-muted": "#A9B4BE", "--logo-accent": "#89D1FF",
        "--primary": "#0A6ED1", "--primary-dk": "#0854A0", "--primary-lt": "#E5F0FA",
        "--menu-panel": "#FFFFFF", "--menu-panel-hd": "#F5F6F7", "--menu-hover": "#EBF5FF",
        "--menu-active": "#D1EFFF", "--menu-active-bd": "#A9D4FF", "--page": "#F5F6F7"
      }
    },
    "dynamics-365": {
      name: "Dynamics 365",
      desc: "Microsoft cloud ERP",
      swatch: ["#002050", "#0078D4", "#FAFAFA"],
      vars: {
        "--nav": "#002050", "--nav-2": "#001940", "--nav-accent": "#0078D4", "--nav-active": "#0078D4",
        "--nav-text": "#FFFFFF", "--nav-muted": "#A0C4E8", "--logo-accent": "#50A0FF",
        "--primary": "#0078D4", "--primary-dk": "#005A9E", "--primary-lt": "#E6F2FB",
        "--menu-panel": "#FFFFFF", "--menu-panel-hd": "#FAFAFA", "--menu-hover": "#F3F9FD",
        "--menu-active": "#E6F2FB", "--menu-active-bd": "#B4D6FA", "--page": "#FAFAFA"
      }
    },
    "oracle-netsuite": {
      name: "Oracle NetSuite",
      desc: "Corporate · Oracle cloud",
      swatch: ["#312D2A", "#C74634", "#FBF9F7"],
      vars: {
        "--nav": "#312D2A", "--nav-2": "#1F1C1A", "--nav-accent": "#C74634", "--nav-active": "#C74634",
        "--nav-text": "#F5F3F0", "--nav-muted": "#B8AFA8", "--logo-accent": "#F0A898",
        "--primary": "#C74634", "--primary-dk": "#A23325", "--primary-lt": "#FCECEA",
        "--menu-panel": "#FFFFFF", "--menu-panel-hd": "#FBF9F7", "--menu-hover": "#F5F0EC",
        "--menu-active": "#FCECEA", "--menu-active-bd": "#F0A898", "--page": "#FBF9F7"
      }
    },
    "cargo-teal": {
      name: "Cargo Teal",
      desc: "Quickmove classic",
      swatch: ["#0C4F63", "#1D4ED8", "#F4F6FA"],
      vars: {
        "--nav": "#0C4F63", "--nav-2": "#0A4252", "--nav-accent": "#1D4ED8", "--nav-active": "#1D4ED8",
        "--nav-text": "#CFE6EE", "--nav-muted": "#8CB4C0", "--logo-accent": "#7FC8DC",
        "--primary": "#1D4ED8", "--primary-dk": "#1E40AF", "--primary-lt": "#DBEAFE",
        "--menu-panel": "#FFFFFF", "--menu-panel-hd": "#F4F6FA", "--menu-hover": "#F0F9FC",
        "--menu-active": "#DBEAFE", "--menu-active-bd": "#93C5FD", "--page": "#F4F6FA"
      }
    },
    "freight-emerald": {
      name: "Freight Emerald",
      desc: "Green logistics · eco",
      swatch: ["#14532D", "#059669", "#F0FDF4"],
      vars: {
        "--nav": "#14532D", "--nav-2": "#052E16", "--nav-accent": "#059669", "--nav-active": "#059669",
        "--nav-text": "#DCFCE7", "--nav-muted": "#86EFAC", "--logo-accent": "#4ADE80",
        "--primary": "#059669", "--primary-dk": "#047857", "--primary-lt": "#D1FAE5",
        "--menu-panel": "#FFFFFF", "--menu-panel-hd": "#F0FDF4", "--menu-hover": "#ECFDF5",
        "--menu-active": "#D1FAE5", "--menu-active-bd": "#6EE7B7", "--page": "#F0FDF4"
      }
    },
    "aviation-indigo": {
      name: "Aviation Indigo",
      desc: "Air cargo · premium",
      swatch: ["#312E81", "#6366F1", "#EEF2FF"],
      vars: {
        "--nav": "#312E81", "--nav-2": "#1E1B4B", "--nav-accent": "#6366F1", "--nav-active": "#6366F1",
        "--nav-text": "#E0E7FF", "--nav-muted": "#A5B4FC", "--logo-accent": "#818CF8",
        "--primary": "#6366F1", "--primary-dk": "#4F46E5", "--primary-lt": "#EEF2FF",
        "--menu-panel": "#FFFFFF", "--menu-panel-hd": "#EEF2FF", "--menu-hover": "#EEF2FF",
        "--menu-active": "#E0E7FF", "--menu-active-bd": "#A5B4FC", "--page": "#F5F7FF"
      }
    }
  };

  function applyTheme(id) {
    var theme = THEMES[id] || THEMES["midnight-logistics"];
    var root = document.documentElement;
    Object.keys(theme.vars).forEach(function (k) {
      root.style.setProperty(k, theme.vars[k]);
    });
    root.setAttribute("data-qm-theme", id);
    localStorage.setItem("qm-theme", id);
    return theme;
  }

  function initTheme() {
    applyTheme(localStorage.getItem("qm-theme") || "midnight-logistics");
  }

  global.QM_THEMES = THEMES;
  global.QMapplyTheme = applyTheme;
  global.QMinitTheme = initTheme;
})(window);

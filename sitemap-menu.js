/* Quickmove CRM — dynamic menu from sitemap.xml */
(function (global) {
  "use strict";

  var DEMO_MODE = global.QM_DEMO_MODE !== false;
  var DEMO_PAGES = {
    "ViewEnquiry.aspx": "enquiry-console.html",
    "ViewEnquiry": "enquiry-console.html"
  };

  var ICONS = {
    Home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z"/></svg>',
    Marketing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l18-5v12L3 13v8l4-2V11z"/><path d="M11 13v8"/></svg>',
    Sales: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-7"/></svg>',
    Services: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14a4 4 0 014-4h1a3 3 0 016 0h1a4 4 0 014 4v2H4v-2z"/><circle cx="12" cy="7" r="3"/></svg>',
    Operation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    Shipping: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 18h20M4 18l2-8h12l2 8"/><path d="M6 10V6h5l2 4"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/></svg>',
    Storage: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-5 9 5v10l-9 5-9-5V9z"/><path d="M12 4v20M3 9l9 5 9-5"/></svg>',
    TMS: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="15" height="10" rx="1"/><path d="M16 8h4l2 4v2h-6V8z"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
    Procurement: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 2h2l2.5 12h11l2-8H6"/></svg>',
    Billing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
    Accounts: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
    HR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="7" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 19c0-3 2.5-5 6-5s6 2 6 5M14 19c0-2 1.5-3.5 3.5-3.5"/></svg>',
    Reports: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20V10M10 20V4M16 20v-8M22 20V7"/></svg>',
    default: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>'
  };

  function parseSiteMap(xmlText) {
    var doc = new DOMParser().parseFromString(xmlText, "text/xml");
    if (doc.querySelector("parsererror")) throw new Error("Invalid sitemap XML");
    var root = doc.documentElement;
    var modules = [];
    [].slice.call(root.children).forEach(function (modEl) {
      if (modEl.nodeType !== 1) return;
      var key = modEl.tagName;
      var mod = {
        key: key,
        id: modEl.getAttribute("id") || "",
        displayName: modEl.getAttribute("DisplayName") || key,
        url: modEl.getAttribute("URL") || "#",
        menus: []
      };
      [].slice.call(modEl.children).forEach(function (menuEl) {
        if (menuEl.tagName !== "Menu") return;
        var isSub = (menuEl.getAttribute("IsSubMenu") || "").toLowerCase() === "true";
        var children = [];
        [].slice.call(menuEl.children).forEach(function (subEl) {
          if (subEl.tagName !== "SubMenu") return;
          children.push({
            id: subEl.getAttribute("id") || "",
            title: subEl.getAttribute("title") || "",
            url: subEl.getAttribute("url") || "#"
          });
        });
        mod.menus.push({
          id: menuEl.getAttribute("id") || "",
          title: menuEl.getAttribute("title") || "",
          url: menuEl.getAttribute("url") || "#",
          isSubMenu: isSub || children.length > 0,
          children: children
        });
      });
      modules.push(mod);
    });
    return modules;
  }

  function loadXml(callback) {
    var embed = document.getElementById("qm-sitemap-embed");
    if (embed && embed.textContent.trim()) {
      callback(embed.textContent.trim());
      return;
    }
    try {
      var sync = new XMLHttpRequest();
      sync.open("GET", "sitemap.xml", false);
      sync.send(null);
      if (sync.status === 200 || sync.status === 0) {
        callback(sync.responseText);
        return;
      }
    } catch (e) { /* ignore */ }
    fetch("sitemap.xml")
      .then(function (r) { return r.text(); })
      .then(callback)
      .catch(function () { callback(null); });
  }

  function isJsUrl(url) {
    return /^javascript:/i.test(url || "") || url === "#";
  }

  function resolveDemoPage(url) {
    if (!url) return null;
    var keys = Object.keys(DEMO_PAGES);
    for (var i = 0; i < keys.length; i++) {
      if (url.indexOf(keys[i]) !== -1) return DEMO_PAGES[keys[i]];
    }
    return null;
  }

  function showToast(msg, type) {
    var el = document.getElementById("qm-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "qm-toast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    el.className = "qm-toast is-show" + (type ? " qm-toast-" + type : "");
    el.textContent = msg;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { el.classList.remove("is-show"); }, 3200);
  }

  function execJsUrl(url) {
    var code = (url || "").replace(/^javascript:/i, "").trim();
    if (!code || code === "#") return false;
    try {
      /* eslint-disable no-new-func */
      new Function(code)();
      return true;
    } catch (err) {
      var fn = code.replace(/\(\s*\)\s*;?\s*$/, "").trim();
      if (fn && typeof global[fn] === "function") {
        global[fn]();
        return true;
      }
      return false;
    }
  }

  function hideAllMegas(root) {
    if (!root) return;
    document.body.classList.remove("qm-mega-open");
    root.querySelectorAll(".qm-mega.is-visible").forEach(function (p) {
      p.classList.remove("is-visible", "is-pinned");
      p.style.display = "";
      p.style.top = "";
      p.style.left = "";
    });
    root.querySelectorAll(".qm-mega-parent.is-open").forEach(function (el) {
      el.classList.remove("is-open");
    });
    root.querySelectorAll("[data-fly-id].is-open, .qm-mod.is-open").forEach(function (el) {
      el.classList.remove("is-open", "is-hover");
    });
  }

  function iconFor(key) {
    return ICONS[key] || ICONS.default;
  }

  function sectionCols(n, vw) {
    vw = vw || window.innerWidth;
    if (n <= 2) return 2;
    if (n <= 4) return vw >= 900 ? 3 : 2;
    if (n <= 8) return vw >= 1200 ? 4 : vw >= 900 ? 3 : 2;
    return vw >= 1400 ? 5 : vw >= 1100 ? 4 : 3;
  }

  function positionPanel(trigger, panel, sidebarEl) {
    panel.classList.add("is-visible");
    document.body.classList.add("qm-mega-open");
    panel.style.visibility = "hidden";
    panel.style.display = "block";
    var pw = panel.offsetWidth;
    var ph = panel.offsetHeight;
    panel.style.visibility = "";
    var r = trigger.getBoundingClientRect();
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var gap = 4;
    var top, left;

    if (sidebarEl) {
      var sb = sidebarEl.getBoundingClientRect();
      left = sb.right + gap;
      top = r.top - 6;
    } else {
      left = r.left;
      top = r.bottom + gap;
    }

    if (left + pw > vw - 12) left = Math.max(12, vw - pw - 12);
    if (left < 12) left = 12;
    if (top + ph > vh - 12) top = Math.max(12, r.top - ph - gap);
    if (top < 12) top = 12;

    panel.style.top = top + "px";
    panel.style.left = left + "px";
  }

  function MenuApp(options) {
    this.root = options.root;
    this.modules = options.modules;
    this.activeModule = options.activeModule || (this.modules[0] && this.modules[0].key);
    this.activeMenuTitle = options.activeMenuTitle || "";
    this.layout = localStorage.getItem("qm-menu-layout") || "top";
    this.sidebarCollapsed = localStorage.getItem("qm-sidebar-collapsed") === "1";
    this.openGroups = {};
    this.searchQuery = "";
    this.mobileOpen = false;
    this.render();
    this.bindGlobal();
  }

  MenuApp.prototype.setLayout = function (layout) {
    this.layout = layout;
    localStorage.setItem("qm-menu-layout", layout);
    document.body.classList.toggle("qm-layout-left", layout === "left");
    document.body.classList.toggle("qm-layout-top", layout === "top");
    this.syncMenuHeight();
    this.render();
  };

  MenuApp.prototype.setModule = function (key) {
    this.activeModule = key;
    this.updateActiveUI();
  };

  MenuApp.prototype.updateActiveUI = function () {
    var key = this.activeModule;
    var flyId = "mod-" + key;
    this.root.querySelectorAll(".qm-top-mod, .qm-mod-btn").forEach(function (btn) {
      var host = btn.closest("[data-fly-id]");
      var modBlock = btn.closest(".qm-mod");
      var match = (host && host.dataset.flyId === flyId) ||
        (modBlock && modBlock.dataset.modKey === key);
      btn.classList.toggle("is-active", !!match);
    });
    this.root.querySelectorAll(".qm-mega-item, .qm-item").forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("data-title") === this.activeMenuTitle);
    }, this);
  };

  MenuApp.prototype.toggleGroup = function (modKey, menuId) {
    var k = modKey + ":" + menuId;
    this.openGroups[k] = !this.openGroups[k];
    this.render();
  };

  MenuApp.prototype.getModule = function (key) {
    key = key || this.activeModule;
    return this.modules.find(function (m) { return m.key === key; }) || this.modules[0];
  };

  MenuApp.prototype.filteredModules = function () {
    var q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.modules;
    return this.modules.filter(function (mod) {
      if (mod.displayName.toLowerCase().indexOf(q) !== -1) return true;
      return mod.menus.some(function (menu) {
        if (menu.title.toLowerCase().indexOf(q) !== -1) return true;
        return menu.children.some(function (c) { return c.title.toLowerCase().indexOf(q) !== -1; });
      });
    });
  };

  MenuApp.prototype.handleNavigate = function (url, title, modKey, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    hideAllMegas(this.root);
    this.activeModule = modKey || this.activeModule;
    this.activeMenuTitle = title || "";
    this.updateActiveUI();
    this.mobileOpen = false;
    document.body.classList.remove("qm-mobile-open");

    if (isJsUrl(url)) {
      if (execJsUrl(url)) {
        showToast(title);
      } else {
        showToast(title + " — report opens when connected to ASP.NET server");
      }
      return;
    }

    if (DEMO_MODE) {
      var demo = resolveDemoPage(url);
      if (demo) {
        window.location.href = demo;
        return;
      }
      var short = (url || "").replace(/^\.\.\//, "").split("?")[0];
      showToast(title + " → " + short);
      return;
    }

    window.location.href = url;
  };

  MenuApp.prototype.renderLink = function (item, cls, isActive, modKey) {
    var self = this;
    var url = item.url || "#";
    var a = document.createElement("a");
    a.className = cls + (isActive ? " is-active" : "");
    a.href = "#";
    a.textContent = item.title;
    a.setAttribute("data-title", item.title);
    a.setAttribute("role", "menuitem");
    a.addEventListener("click", function (e) {
      self.handleNavigate(url, item.title, modKey, e);
    });
    return a;
  };

  MenuApp.prototype.renderMegaItem = function (item, cls, isActive, modKey) {
    var self = this;
    var url = item.url || "#";
    var a = document.createElement("a");
    a.className = cls + (isActive ? " is-active" : "");
    a.href = "#";
    a.textContent = item.title;
    a.setAttribute("data-title", item.title);
    a.setAttribute("role", "menuitem");
    a.addEventListener("click", function (e) {
      self.handleNavigate(url, item.title, modKey, e);
    });
    return a;
  };

  MenuApp.prototype.buildModuleMegaPanel = function (mod) {
    var self = this;
    var panel = document.createElement("div");
    panel.className = "qm-mega qm-module-mega";
    panel.setAttribute("role", "menu");

    var head = document.createElement("div");
    head.className = "qm-mega-head";
    head.innerHTML =
      '<span class="qm-mega-head-icon">' + iconFor(mod.key) + "</span>" +
      '<span class="qm-mega-title">' + mod.displayName + "</span>";
    panel.appendChild(head);

    var body = document.createElement("div");
    body.className = "qm-module-body qm-module-flat";
    mod.menus.forEach(function (menu) {
      if (menu.isSubMenu && menu.children.length) {
        var parent = document.createElement("div");
        parent.className = "qm-mega-parent";
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "qm-mega-parent-btn";
        btn.setAttribute("aria-expanded", "false");
        btn.innerHTML =
          '<span class="qm-mega-item-text">' + menu.title + "</span>" +
          '<span class="qm-mega-parent-meta">' + menu.children.length + "</span>" +
          '<span class="qm-chev">▸</span>';
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          var open = parent.classList.contains("is-open");
          panel.querySelectorAll(".qm-mega-parent.is-open").forEach(function (p) {
            p.classList.remove("is-open");
            var b = p.querySelector(".qm-mega-parent-btn");
            if (b) b.setAttribute("aria-expanded", "false");
          });
          if (!open) {
            parent.classList.add("is-open");
            btn.setAttribute("aria-expanded", "true");
          }
        });
        parent.appendChild(btn);
        var sub = document.createElement("div");
        sub.className = "qm-mega-sublist";
        menu.children.forEach(function (child) {
          sub.appendChild(self.renderMegaItem(child, "qm-mega-item qm-mega-sub",
            mod.key === self.activeModule && child.title === self.activeMenuTitle, mod.key));
        });
        parent.appendChild(sub);
        body.appendChild(parent);
      } else {
        body.appendChild(self.renderMegaItem(menu, "qm-mega-item qm-mega-top",
          mod.key === self.activeModule && menu.title === self.activeMenuTitle, mod.key));
      }
    });
    panel.appendChild(body);
    return panel;
  };

  MenuApp.prototype.attachPanel = function (hostEl, panel, panelId) {
    hostEl.dataset.flyId = panelId;
    panel.dataset.flyFor = panelId;
    panel.classList.add("qm-flyout");
    this.root.appendChild(panel);
  };

  MenuApp.prototype.buildSidebarItems = function (mod, block) {
    var self = this;
    var sub = document.createElement("div");
    sub.className = "qm-mod-items";
    mod.menus.forEach(function (menu) {
      if (menu.isSubMenu && menu.children.length) {
        var grp = document.createElement("div");
        grp.className = "qm-grp";
        var grpBtn = document.createElement("button");
        grpBtn.type = "button";
        grpBtn.className = "qm-grp-btn";
        grpBtn.innerHTML = "<span>" + menu.title + '</span><span class="qm-chev">▸</span>';
        grpBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          grp.classList.toggle("is-open");
        });
        grp.appendChild(grpBtn);
        var list = document.createElement("div");
        list.className = "qm-grp-list";
        menu.children.forEach(function (child) {
          list.appendChild(self.renderLink(child, "qm-item qm-sub-item",
            mod.key === self.activeModule && child.title === self.activeMenuTitle, mod.key));
        });
        grp.appendChild(list);
        sub.appendChild(grp);
      } else {
        sub.appendChild(self.renderLink(menu, "qm-item",
          mod.key === self.activeModule && menu.title === self.activeMenuTitle, mod.key));
      }
    });
    return sub;
  };

  MenuApp.prototype.bindTopMenus = function () {
    var self = this;

    this.root.querySelectorAll(".qm-top-mod-wrap[data-fly-id]").forEach(function (host) {
      var trigger = host.querySelector(".qm-top-mod");
      var panel = self.root.querySelector('.qm-mega[data-fly-for="' + host.dataset.flyId + '"]');
      if (!trigger || !panel) return;

      var showT, hideT;

      function open(pin) {
        clearTimeout(hideT);
        showT = setTimeout(function () {
          hideAllMegas(self.root);
          positionPanel(trigger, panel, null);
          panel.classList.toggle("is-pinned", !!pin);
          host.classList.add("is-open");
        }, pin ? 0 : 40);
      }

      function close() {
        clearTimeout(showT);
        hideT = setTimeout(function () {
          if (panel.classList.contains("is-pinned")) return;
          panel.classList.remove("is-visible", "is-pinned");
          panel.style.display = "";
          host.classList.remove("is-open");
          if (!self.root.querySelector(".qm-mega.is-visible")) {
            document.body.classList.remove("qm-mega-open");
          }
        }, 200);
      }

      host.addEventListener("mouseenter", function () { open(false); });
      host.addEventListener("mouseleave", close);
      panel.addEventListener("mouseenter", function () { clearTimeout(hideT); });
      panel.addEventListener("mouseleave", close);

      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var modKey = host.dataset.flyId.replace(/^mod-/, "");
        self.setModule(modKey);
        if (panel.classList.contains("is-visible") && panel.classList.contains("is-pinned")) {
          panel.classList.remove("is-visible", "is-pinned");
          panel.style.display = "";
          host.classList.remove("is-open");
          if (!self.root.querySelector(".qm-mega.is-visible")) {
            document.body.classList.remove("qm-mega-open");
          }
        } else {
          open(true);
        }
      });
    });

    if (!self._docClickBound) {
      self._docClickBound = true;
      document.addEventListener("click", function (e) {
        if (e.target.closest(".qm-mega, .qm-top-mod-wrap, .qm-theme-wrap, .qm-user-wrap")) return;
        if (e.target.closest(".qm-sidebar:not(.is-collapsed)")) return;
        hideAllMegas(self.root);
      });
    }
  };

  MenuApp.prototype.bindSidebarMenus = function () {
    var self = this;

    this.root.querySelectorAll(".qm-sidebar").forEach(function (sidebar) {
      var collapsed = sidebar.classList.contains("is-collapsed");
      var isMobile = sidebar.classList.contains("qm-mobile-drawer");

      sidebar.querySelectorAll(".qm-mod").forEach(function (block) {
        var modKey = block.dataset.modKey;
        var modBtn = block.querySelector(".qm-mod-btn");
        if (!modBtn || !modKey) return;

        modBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          self.setModule(modKey);

          if (collapsed && !isMobile) {
            var panel = self.root.querySelector('.qm-mega[data-fly-for="mod-' + modKey + '"]');
            if (!panel) return;
            var isOpen = block.classList.contains("is-open");
            hideAllMegas(self.root);
            sidebar.querySelectorAll(".qm-mod.is-open").forEach(function (b) { b.classList.remove("is-open"); });
            if (!isOpen) {
              positionPanel(modBtn, panel, sidebar);
              panel.classList.add("is-pinned");
              block.classList.add("is-open");
            }
            return;
          }

          var wasOpen = block.classList.contains("is-open");
          sidebar.querySelectorAll(".qm-mod.is-open").forEach(function (b) { b.classList.remove("is-open"); });
          if (!wasOpen) block.classList.add("is-open");
        });
      });
    });
  };

  MenuApp.prototype.syncMenuHeight = function () {
    var h = this.root.offsetHeight || 54;
    document.documentElement.style.setProperty("--qm-menu-h", h + "px");
  };

  MenuApp.prototype.renderUserMenu = function (toolsEl) {
    var wrap = document.createElement("div");
    wrap.className = "qm-user-wrap";
    wrap.innerHTML =
      '<button type="button" class="qm-user-btn" aria-haspopup="true" aria-expanded="false" title="User account">' +
      '<span class="qm-avatar qm-avatar-sm">MA</span></button>' +
      '<div class="qm-user-panel" role="menu">' +
      '<div class="qm-user-head">' +
      '<span class="qm-avatar qm-avatar-lg">SR</span>' +
      '<div class="qm-user-head-meta"><strong>S Ramesh</strong>' +
      '<small>ramesh@xyz.com</small>' +
      '<span class="qm-user-role">Account Manager</span></div></div>' +
      '<div class="qm-user-divider"></div>' +
      '<a class="qm-user-link" href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.5-6 8-6s8 2 8 6"/></svg>My Profile</a>' +
      '<a class="qm-user-link" href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>Account Info</a>' +
      '<a class="qm-user-link" href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2"/></svg>Settings &amp; Preferences</a>' +
      '<a class="qm-user-link" href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M13.7 21a2 2 0 01-3.4 0"/></svg>Notifications</a>' +
      '<a class="qm-user-link" href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 015.8 1c0 2-3 2-3 4M12 17h.01"/></svg>Help &amp; Support</a>' +
      '<div class="qm-user-divider"></div>' +
      '<a class="qm-user-link qm-user-logout" href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>Sign out</a>' +
      '</div>';

    var btn = wrap.querySelector(".qm-user-btn");
    var panel = wrap.querySelector(".qm-user-panel");
    var hideT;

    function closePanel() {
      panel.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }

    wrap.addEventListener("mouseenter", function () {
      clearTimeout(hideT);
      panel.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    });
    wrap.addEventListener("mouseleave", function () {
      hideT = setTimeout(closePanel, 180);
    });
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = panel.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    wrap.querySelectorAll(".qm-user-link").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        showToast(a.textContent.trim().replace(/\s+/g, " "));
        closePanel();
      });
    });
    toolsEl.appendChild(wrap);
  };

  MenuApp.prototype.renderThemePicker = function (toolsEl) {
    if (!global.QM_THEMES) return;
    var wrap = document.createElement("div");
    wrap.className = "qm-theme-wrap";
    var current = localStorage.getItem("qm-theme") || "midnight-logistics";
    var currentTheme = global.QM_THEMES[current] || global.QM_THEMES["midnight-logistics"];
    wrap.innerHTML =
      '<button type="button" class="qm-tool-btn qm-theme-btn" title="ERP color theme">' +
      '<span class="qm-theme-dot" style="background:' + currentTheme.swatch[1] + '"></span></button>' +
      '<div class="qm-theme-panel" role="listbox"></div>';
    var panel = wrap.querySelector(".qm-theme-panel");
    Object.keys(global.QM_THEMES).forEach(function (id) {
      var t = global.QM_THEMES[id];
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "qm-theme-opt" + (id === current ? " is-active" : "");
      btn.innerHTML =
        '<span class="qm-theme-sw">' + t.swatch.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join("") +
        '</span><span class="qm-theme-meta"><strong>' + t.name + '</strong><small>' + t.desc + '</small></span>';
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        global.QMapplyTheme(id);
        wrap.querySelector(".qm-theme-dot").style.background = t.swatch[1];
        panel.classList.remove("is-open");
      });
      panel.appendChild(btn);
    });
    wrap.querySelector(".qm-theme-btn").addEventListener("click", function (e) {
      e.stopPropagation();
      panel.classList.toggle("is-open");
    });
    toolsEl.insertBefore(wrap, toolsEl.firstChild);
  };

  MenuApp.prototype.renderSidebar = function (isMobile) {
    var self = this;
    var aside = document.createElement("aside");
    aside.className = "qm-sidebar" + (this.sidebarCollapsed ? " is-collapsed" : "");
    aside.setAttribute("aria-label", "Main navigation");

    var head = document.createElement("div");
    head.className = "qm-sidebar-head";
    head.innerHTML = '<span class="qm-logo">Quick<b>move</b></span>';
    aside.appendChild(head);

    var nav = document.createElement("nav");
    nav.className = "qm-sidebar-nav";

    this.filteredModules().forEach(function (mod) {
      var block = document.createElement("div");
      block.className = "qm-mod";
      block.dataset.modKey = mod.key;
      block.title = mod.displayName;

      var modBtn = document.createElement("button");
      modBtn.type = "button";
      modBtn.className = "qm-mod-btn" + (mod.key === self.activeModule ? " is-active" : "");
      modBtn.innerHTML =
        '<span class="qm-ico">' + iconFor(mod.key) + '</span>' +
        '<span class="qm-mod-label">' + mod.displayName + '</span>' +
        '<span class="qm-chev">▸</span>';
      block.appendChild(modBtn);
      block.appendChild(self.buildSidebarItems(mod, block));

      if (self.sidebarCollapsed && !isMobile) {
        self.attachPanel(block, self.buildModuleMegaPanel(mod), "mod-" + mod.key);
      }

      nav.appendChild(block);
    });

    aside.appendChild(nav);
    return aside;
  };

  MenuApp.prototype.renderTopBar = function () {
    var self = this;
    var bar = document.createElement("header");
    bar.className = "qm-topbar";
    var inner = document.createElement("div");
    inner.className = "qm-topbar-inner";

    var brand = document.createElement("div");
    brand.className = "qm-brand";
    brand.innerHTML =
      '<button type="button" class="qm-hamburger" aria-label="Open menu"><span></span><span></span><span></span></button>' +
      '<span class="qm-logo">Quick<b>move</b></span>';
    brand.querySelector(".qm-hamburger").addEventListener("click", function () {
      self.mobileOpen = !self.mobileOpen;
      document.body.classList.toggle("qm-mobile-open", self.mobileOpen);
    });
    inner.appendChild(brand);

    var mods = document.createElement("nav");
    mods.className = "qm-top-mods";
    mods.setAttribute("aria-label", "Modules");

    this.filteredModules().forEach(function (mod) {
      if (self.layout !== "top") return;
      var wrap = document.createElement("div");
      wrap.className = "qm-top-mod-wrap";
      wrap.dataset.flyId = "mod-" + mod.key;

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "qm-top-mod" + (mod.key === self.activeModule ? " is-active" : "");
      btn.innerHTML =
        '<span class="qm-ico">' + iconFor(mod.key) + '</span>' +
        '<span class="qm-mod-label">' + mod.displayName + '</span>' +
        '<span class="qm-mod-chev">▾</span>';
      wrap.appendChild(btn);
      mods.appendChild(wrap);

      self.attachPanel(wrap, self.buildModuleMegaPanel(mod), "mod-" + mod.key);
    });
    inner.appendChild(mods);

    var tools = document.createElement("div");
    tools.className = "qm-top-tools";
    tools.innerHTML =
      '<div class="qm-search-wrap"><input type="search" class="qm-search" placeholder="Search menus…" aria-label="Search menus"><span class="qm-search-ico">⌕</span></div>' +
      '<button type="button" class="qm-tool-btn" data-layout="left" title="Left sidebar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="18" rx="1"/><rect x="12" y="3" width="9" height="18" rx="1"/></svg></button>' +
      '<button type="button" class="qm-tool-btn" data-layout="top" title="Top menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="5" rx="1"/><rect x="3" y="10" width="18" height="11" rx="1"/></svg></button>' +
      '<button type="button" class="qm-tool-btn qm-collapse-btn" title="Collapse sidebar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 4v16M4 8h11a2 2 0 012 2v4a2 2 0 01-2 2H4"/></svg></button>';

    var search = tools.querySelector(".qm-search");
    search.value = this.searchQuery;
    search.addEventListener("input", function () {
      self.searchQuery = search.value;
      self.render();
    });

    tools.querySelector('[data-layout="left"]').addEventListener("click", function () { self.setLayout("left"); });
    tools.querySelector('[data-layout="top"]').addEventListener("click", function () { self.setLayout("top"); });
    tools.querySelector(".qm-collapse-btn").addEventListener("click", function () {
      self.sidebarCollapsed = !self.sidebarCollapsed;
      localStorage.setItem("qm-sidebar-collapsed", self.sidebarCollapsed ? "1" : "0");
      self.render();
    });

    self.renderThemePicker(tools);
    self.renderUserMenu(tools);
    inner.appendChild(tools);
    bar.appendChild(inner);
    return bar;
  };

  MenuApp.prototype.render = function () {
    if (!this.root) return;
    this.root.innerHTML = "";
    document.body.classList.toggle("qm-layout-left", this.layout === "left");
    document.body.classList.toggle("qm-layout-top", this.layout === "top");
    document.body.classList.toggle("qm-sidebar-collapsed", this.sidebarCollapsed);

    var self = this;
    var isMobile = window.matchMedia("(max-width: 900px)").matches;
    var shell = document.createElement("div");
    shell.className = "qm-shell";

    if (this.layout === "left" && !isMobile) {
      shell.appendChild(this.renderSidebar(false));
    }

    var main = document.createElement("div");
    main.className = "qm-main";
    main.appendChild(this.renderTopBar());
    shell.appendChild(main);
    this.root.appendChild(shell);

    var overlay = document.createElement("div");
    overlay.className = "qm-overlay";
    overlay.addEventListener("click", function () {
      self.mobileOpen = false;
      document.body.classList.remove("qm-mobile-open");
    });
    this.root.appendChild(overlay);

    if (isMobile) {
      var drawer = this.renderSidebar(true);
      drawer.classList.add("qm-mobile-drawer");
      this.root.appendChild(drawer);
    }

    this.bindTopMenus();
    this.bindSidebarMenus();
    requestAnimationFrame(function () { self.syncMenuHeight(); });
  };

  MenuApp.prototype.bindGlobal = function () {
    var self = this;
    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        self.syncMenuHeight();
        if (window.matchMedia("(max-width: 900px)").matches !== self._wasMobile) {
          self._wasMobile = window.matchMedia("(max-width: 900px)").matches;
          self.render();
        }
      }, 150);
    });
    self._wasMobile = window.matchMedia("(max-width: 900px)").matches;

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        hideAllMegas(self.root);
        self.mobileOpen = false;
        document.body.classList.remove("qm-mobile-open");
      }
    });
  };

  function initMenu(options) {
    options = options || {};
    loadXml(function (xml) {
      if (!xml) {
        console.error("Could not load sitemap.xml");
        return;
      }
      var modules = parseSiteMap(xml);
      if (global.QMinitTheme) global.QMinitTheme();
      var layout = localStorage.getItem("qm-menu-layout") || "top";
      document.body.classList.add(layout === "left" ? "qm-layout-left" : "qm-layout-top");
      global.QMMenu = new MenuApp({
        root: document.getElementById("qm-menu-root"),
        modules: modules,
        activeModule: options.activeModule || "Sales",
        activeMenuTitle: options.activeMenuTitle || "Enquiry"
      });
    });
  }

  global.QMMenuApp = MenuApp;
  global.QMparseSiteMap = parseSiteMap;
  global.QMinitMenu = initMenu;
  global.QMshowToast = showToast;
})(window);

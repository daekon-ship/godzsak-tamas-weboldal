/* Godzsák Tamás E.V. — oldal interakciók (vanilla, függőségmentes) */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- Header állapot ---------- */
  var header = $("#siteHeader");
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Mobil menü ---------- */
  var menuToggle = $("#menuToggle");
  var mobileMenu = $("#mobileMenu");
  var lastFocus = null;

  function setMenu(open) {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    var label = menuToggle.querySelector(".menu-toggle-label");
    if (label) label.textContent = open ? label.getAttribute("data-close") : label.getAttribute("data-open");
    document.body.classList.toggle("menu-open", open);
    if (open) {
      lastFocus = document.activeElement;
      mobileMenu.hidden = false;
      var first = mobileMenu.querySelector("a");
      if (first) first.focus();
    } else {
      mobileMenu.hidden = true;
      if (lastFocus) lastFocus.focus();
    }
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });
    $$("a", mobileMenu).forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") setMenu(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1024 && menuToggle.getAttribute("aria-expanded") === "true") setMenu(false);
    });
  }

  /* ---------- Reveal (IntersectionObserver) ---------- */
  var revealEls = $$(".reveal, .rm");
  if ("IntersectionObserver" in window && !reducedMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Előtte / Utána csúszka ---------- */
  var baStage = $(".ba-stage");
  var baRange = $("#baRange");
  if (baStage && baRange) {
    var applyPos = function (v) {
      baStage.style.setProperty("--pos", v + "%");
      baRange.setAttribute("aria-valuetext", v.toFixed(0) + "%");
    };
    baRange.addEventListener("input", function () { applyPos(parseFloat(baRange.value)); });
    applyPos(parseFloat(baRange.value));
  }

  /* ---------- Szolgáltatások: mobil accordion + desktop preview ---------- */
  var svcList = $("#svcList");
  var svcPreview = $("#svcPreview");
  var svcChip = $("#svcPreviewChip");
  var svcNum = $("#svcPreviewNum");
  var svcDesktop = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 901px)");

  if (svcList) {
    var items = $$(".svc-item", svcList);
    items.forEach(function (item) {
      var btn = $(".svc-row", item);
      var panel = $(".svc-panel", item);
      if (!btn || !panel) return;

      var syncAria = function () {
        var isDesktop = svcDesktop.matches;
        btn.setAttribute("aria-expanded", isDesktop ? "true" : String(item.classList.contains("open")));
      };
      syncAria();
      window.addEventListener("resize", syncAria);

      btn.addEventListener("click", function () {
        if (svcDesktop.matches) return;
        var isOpen = item.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(isOpen));
      });

      if (svcPreview) {
        item.addEventListener("mouseenter", function () {
          if (!svcDesktop.matches) return;
          svcPreview.className = "svc-preview ph " + (item.getAttribute("data-tone") || "ph-b") + " show";
          if (svcNum) svcNum.textContent = ($(".svc-num", item) || {}).textContent || "";
          if (svcChip) svcChip.textContent = ($(".svc-num", item) || {}).textContent || "";
          var rect = svcList.getBoundingClientRect();
          var rowRect = btn.getBoundingClientRect();
          var top = rowRect.top - rect.top + rect.height * 0 - 120;
          top = Math.max(0, Math.min(top, rect.height - (svcPreview.offsetHeight || 360)));
          svcPreview.style.top = top + "px";
        });
        svcList.addEventListener("mouseleave", function () {
          svcPreview.classList.remove("show");
        });
      }
    });
  }

  /* ---------- Folyamat progress ---------- */
  var procSection = $("#folyamat");
  var procFill = $("#procFill");
  if (procSection && procFill && !reducedMotion) {
    var ticking = false;
    var updateProc = function () {
      ticking = false;
      var rect = procSection.getBoundingClientRect();
      var vh = window.innerHeight;
      var progress = (vh * 0.75 - rect.top) / (rect.height + vh * 0.2);
      progress = Math.max(0, Math.min(1, progress));
      procFill.style.setProperty("--pp", progress.toFixed(3));
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateProc); }
    }, { passive: true });
    updateProc();
  }

  /* ---------- Craft sáv: drag + finom horizontális mozgás ---------- */
  var craftStrip = $("#craftStrip");
  if (craftStrip) {
    var isDown = false, startX = 0, startScroll = 0, moved = false;

    craftStrip.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch") return;
      isDown = true; moved = false;
      startX = e.clientX;
      startScroll = craftStrip.scrollLeft;
      craftStrip.classList.add("dragging");
    });
    window.addEventListener("pointermove", function (e) {
      if (!isDown) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      craftStrip.scrollLeft = startScroll - dx;
    });
    window.addEventListener("pointerup", function () {
      if (!isDown) return;
      isDown = false;
      craftStrip.classList.remove("dragging");
    });
    craftStrip.addEventListener("click", function (e) {
      if (moved) { e.preventDefault(); moved = false; }
    });

    if (!reducedMotion) {
      var craftTicking = false;
      var updateShift = function () {
        craftTicking = false;
        var rect = craftStrip.getBoundingClientRect();
        var vh = window.innerHeight;
        if (rect.bottom < 0 || rect.top > vh) return;
        var progress = 1 - Math.max(0, Math.min(1, (rect.top + rect.height * 0.4) / vh));
        craftStrip.style.setProperty("--shift", (-progress * 44).toFixed(1) + "px");
      };
      window.addEventListener("scroll", function () {
        if (!craftTicking) { craftTicking = true; requestAnimationFrame(updateShift); }
      }, { passive: true });
      updateShift();
    }
  }

  /* ---------- Mobil sticky sáv ---------- */
  var mbar = $("#mbar");
  var hero = $(".hero");
  if (mbar && hero && "IntersectionObserver" in window) {
    var heroIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        mbar.classList.toggle("show", !entry.isIntersecting);
      });
    }, { rootMargin: "-80px 0px 0px 0px" });
    heroIO.observe(hero);
  } else if (mbar) {
    mbar.classList.add("show");
  }

  /* ---------- Szolgáltatási terület: térkép ↔ lista szinkron ---------- */
  var regionSection = $("#terulet");
  if (regionSection) {
    var points = $$(".region-point", regionSection);
    var cities = $$(".city", regionSection);
    var syncRegion = function (active) {
      points.forEach(function (p) {
        p.classList.toggle("is-dim", !!active && p.getAttribute("data-region") !== active);
      });
      cities.forEach(function (c) {
        c.classList.toggle("is-dim", !!active && c.getAttribute("data-region") !== active);
      });
    };
    points.forEach(function (p) {
      var r = p.getAttribute("data-region");
      p.addEventListener("mouseenter", function () { syncRegion(r); });
      p.addEventListener("mouseleave", function () { syncRegion(null); });
      p.addEventListener("focus", function () { syncRegion(r); }, true);
      p.addEventListener("blur", function () { syncRegion(null); }, true);
    });
    cities.forEach(function (c) {
      var r = c.getAttribute("data-region");
      c.addEventListener("mouseenter", function () { syncRegion(r); });
      c.addEventListener("mouseleave", function () { syncRegion(null); });
    });
  }

  /* ---------- Űrlap: validáció + mailto fallback ---------- */
  var form = $("#quoteForm");
  var status = $("#formStatus");
  if (form && status) {
    var showStatus = function (msg, isError) {
      status.textContent = msg;
      status.classList.toggle("is-error", !!isError);
    };

    var fieldWrap = function (input) { return input.closest(".field"); };
    var setErr = function (input, msg) {
      var wrap = fieldWrap(input);
      if (!wrap) return;
      var old = wrap.querySelector(".err");
      if (old) old.remove();
      wrap.classList.toggle("has-err", !!msg);
      if (msg) {
        var p = document.createElement("span");
        p.className = "err";
        p.textContent = msg;
        wrap.appendChild(p);
      }
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#f-name"), phone = $("#f-phone"), email = $("#f-email");
      var ok = true;

      if (!name.value.trim()) { setErr(name, "Kérjük, add meg a nevedet."); ok = false; } else setErr(name, "");
      if (!phone.value.trim()) { setErr(phone, "Kérjük, add meg a telefonszámodat."); ok = false; } else setErr(phone, "");
      if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        setErr(email, "Az e-mail cím formátuma nem megfelelő."); ok = false;
      } else setErr(email, "");

      if (!ok) {
        showStatus("Kérjük, ellenőrizd a hiányzó mezőket.", true);
        return;
      }

      var works = $$("input[name='work']:checked", form).map(function (c) { return c.value; });
      var lines = [
        "Név: " + name.value.trim(),
        "Telefonszám: " + phone.value.trim(),
        "E-mail: " + (email.value.trim() || "—"),
        "Ingatlan helyszíne: " + ($("#f-loc").value.trim() || "—"),
        "Munka típusa: " + (works.length ? works.join(", ") : "—"),
        "Leírás: " + ($("#f-msg").value.trim() || "—")
      ];
      var subject = "Ajánlatkérés — weboldal";
      var body = lines.join("\n");
      window.location.href = "mailto:tgodzsak@gmail.com?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      showStatus("Az ajánlatkérés az e-mail kliensedben nyílik meg. Gyorsabb út: hívj minket a +36 70 173 13 79 számon.");
    });
  }

  /* ---------- Évszám ---------- */
  var year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();

(function () {
  var shop = window.SHOP || {};
  var number = String(shop.whatsapp || "").replace(/\D/g, "");

  // Every WhatsApp button opens a chat with its own ready-made message.
  document.querySelectorAll("[data-wa]").forEach(function (link) {
    var text = link.getAttribute("data-wa");
    if (number) link.href = "https://wa.me/" + number + (text ? "?text=" + encodeURIComponent(text) : "");
    if (link.hasAttribute("data-wa-display") && shop.whatsappDisplay) link.textContent = shop.whatsappDisplay;
  });

  document.querySelectorAll("[data-email]").forEach(function (link) {
    if (!shop.email) return;
    link.href = "mailto:" + shop.email;
    link.textContent = shop.email;
  });

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Mobile menu
  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.getElementById("nav");
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  menuBtn.addEventListener("click", function () {
    setMenu(!document.body.classList.contains("menu-open"));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) setMenu(false);
  });

  // Solid header once the page is scrolled
  var header = document.querySelector(".header");
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Scent finder: the chosen chips write the WhatsApp message.
  var finder = document.getElementById("finder");
  if (finder) {
    var messageEl = document.getElementById("finder-message");
    var sendLink = document.getElementById("finder-send");
    var bubble = messageEl.parentNode;
    var phrases = {
      for: { me: "It’s for me.", him: "It’s for him.", her: "It’s for her.", gift: "It’s a gift." },
      when: { everyday: "For everyday wear.", work: "For work.", evenings: "For evenings out.", occasions: "For special occasions." },
    };
    var listOf = function (items) {
      return items.length < 2 ? items.join("") : items.slice(0, -1).join(", ") + " and " + items[items.length - 1];
    };
    var buildMessage = function () {
      var picked = function (group) {
        return Array.prototype.map.call(
          finder.querySelectorAll('[data-group="' + group + '"] .chip[aria-pressed="true"]'),
          function (chip) { return chip.getAttribute("data-value"); }
        );
      };
      var notes = picked("notes"), who = picked("for")[0], when = picked("when")[0];
      var lines = ["Hello Chlyn’s Fragrance, I’d like a perfume recommendation."];
      if (notes.length) lines.push("I love " + listOf(notes) + " scents.");
      if (who) lines.push(phrases.for[who]);
      if (when) lines.push(phrases.when[when]);
      lines.push("What would you suggest?");
      return lines.join("\n");
    };
    finder.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      var group = chip.closest("[data-group]");
      var on = chip.getAttribute("aria-pressed") !== "true";
      if (!group.hasAttribute("data-multi")) {
        group.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
      }
      chip.setAttribute("aria-pressed", String(on));
      var text = buildMessage();
      messageEl.textContent = text;
      if (number) sendLink.href = "https://wa.me/" + number + "?text=" + encodeURIComponent(text);
      bubble.classList.remove("pop");
      void bubble.offsetWidth;
      bubble.classList.add("pop");
    });
  }

  // The floating button steps aside while the finder, with its own send button, is on screen.
  var floatBtn = document.querySelector(".wa-float");
  if (finder && floatBtn && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      floatBtn.classList.toggle("is-hidden", entries[0].isIntersecting);
    }, { rootMargin: "-20% 0px -20% 0px" }).observe(finder);
  }

  // Open or closed right now, in Benin time (UTC+1, no daylight saving).
  var status = document.querySelector("[data-status]");
  if (status) {
    var benin = new Date(Date.now() + 3600000);
    var day = benin.getUTCDay(), hour = benin.getUTCHours();
    var open = day !== 0 && hour >= 9 && hour < 19;
    var text;
    if (open) text = "Open now · until 7pm";
    else if (day === 0) text = "Sunday · by appointment";
    else if (hour < 9) text = "Closed · opens at 9am";
    else if (day === 6) text = "Closed · Sunday by appointment";
    else text = "Closed · opens tomorrow at 9am";
    status.classList.toggle("open", open);
    status.querySelector("[data-status-text]").textContent = text;
  }

  // Sections fade in as they come into view. Anything already on screen shows straight away.
  var items = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -5% 0px", threshold: 0.05 });
  items.forEach(function (el) { observer.observe(el); });
})();

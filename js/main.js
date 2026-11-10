/* WEDDING INVITATION OPENING */

const openingScreen =
  document.getElementById("invitationOpening");

const openButton =
  document.getElementById("openInvitation");

const envelope =
  document.getElementById("envelope");


openButton.addEventListener("click", () => {

  // Step 1: Open envelope
  envelope.classList.add("is-open");

  // Step 2: Wait for envelope animation
  setTimeout(() => {

    openingScreen.classList.add("is-open");

    // Prevent opening screen from blocking website
    setTimeout(() => {
      openingScreen.style.display = "none";
    }, 1200);

  }, 900);

});


// wedding Invitation
(function () {
  const header = document.querySelector(".site-header");
  const nav = document.getElementById("site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const countdownEl = document.querySelector(".countdown");
  const completeEl = document.querySelector(".countdown-complete");
  const form = document.getElementById("rsvp-form");
  const successEl = document.getElementById("rsvp-success");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox.querySelector("img");
  const galleryButtons = Array.from(document.querySelectorAll(".gallery-item"));
  const images = galleryButtons.map((btn) => {
    const img = btn.querySelector("img");
    return { src: img.currentSrc || img.src, alt: img.alt };
  });

  let currentIndex = 0;
  let lastFocus = null;

  function headerOffset() {
    return header ? header.offsetHeight : 0;
  }

  function closeNav() {
    nav.classList.remove("open"); 
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  toggle.addEventListener("click", function () {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      const id = this.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset();
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  });

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function renderCountdown() {
    const target = new Date(countdownEl.dataset.target).getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      countdownEl.hidden = true;
      completeEl.hidden = false;
      return false;
    }

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    countdownEl.querySelector('[data-unit="days"]').textContent = pad(Math.floor(diff / day));
    countdownEl.querySelector('[data-unit="hours"]').textContent = pad(
      Math.floor((diff % day) / hour)
    );
    countdownEl.querySelector('[data-unit="minutes"]').textContent = pad(
      Math.floor((diff % hour) / minute)
    );
    countdownEl.querySelector('[data-unit="seconds"]').textContent = pad(
      Math.floor((diff % minute) / second)
    );
    return true;
  }

  if (renderCountdown()) {
    setInterval(renderCountdown, 1000);
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("visible");
    });
  }

  function showError(name, show) {
    const node = form.querySelector('[data-error-for="' + name + '"]');
    if (node) node.hidden = !show;
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
  
  
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const attending = String(data.get("attending") || "");
    const guests = String(data.get("guests") || "1");
    const meal = String(data.get("meal") || "");
    const message = String(data.get("message") || "").trim();

    let valid = true;
    showError("name", !name);
    if (!name) valid = false;
    showError("email", !validEmail(email));
    if (!validEmail(email)) valid = false;
    showError("attending", !attending);
    if (!attending) valid = false;
    showError("meal", !meal);
    if (!meal) valid = false;
    if (!valid) return;

    const submit = form.querySelector(".submit-btn");
    submit.disabled = true;
    submit.textContent = "Sending";

    window.setTimeout(function () {
      const payload = { name, email, attending, guests, meal, message, savedAt: new Date().toISOString() };
      localStorage.setItem("ameliaTheoRsvp", JSON.stringify(payload));
      successEl.hidden = false;
      form.reset();
      form.querySelectorAll(".field-error").forEach(function (el) {
        el.hidden = true;
      });
      submit.disabled = false;
      submit.textContent = "Send reply";
    }, 650);
  });

  function openLightbox(index) {
    currentIndex = index;
    lastFocus = document.activeElement;
    const item = images[currentIndex];
    lightboxImg.src = item.src.replace("w=900", "w=1600");
    lightboxImg.alt = item.alt;
    lightbox.hidden = false;
    lightbox.querySelector(".lightbox-close").focus();
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  function stepLightbox(delta) {
    currentIndex = (currentIndex + delta + images.length) % images.length;
    const item = images[currentIndex];
    lightboxImg.src = item.src.replace("w=900", "w=1600");
    lightboxImg.alt = item.alt;
  }

  galleryButtons.forEach(function (btn, index) {
    btn.addEventListener("click", function () {
      openLightbox(index);
    });
  });

  lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  lightbox.querySelector(".lightbox-prev").addEventListener("click", function () {
    stepLightbox(-1);
  });
  lightbox.querySelector(".lightbox-next").addEventListener("click", function () {
    stepLightbox(1);
  });

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", function (event) {
    if (lightbox.hidden) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") stepLightbox(-1);
    if (event.key === "ArrowRight") stepLightbox(1);
    if (event.key === "Tab") {
      const focusable = lightbox.querySelectorAll("button");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
})();

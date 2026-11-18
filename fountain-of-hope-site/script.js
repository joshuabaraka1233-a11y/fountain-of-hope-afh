
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const hasGSAP =
    window.gsap && window.ScrollTrigger;

  // FOOTER YEAR
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // MOBILE MENU
  const menu = document.querySelector(".menu");
  const navigation = document.querySelector(".navigation");

  menu?.addEventListener("click", () => {
    const open = navigation.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });

  navigation?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menu?.setAttribute("aria-expanded", "false");
    });
  });

  // PAGE PROGRESS
  const pageProgress = document.querySelector(
    ".scroll-progress span"
  );

  function updatePageProgress() {
    const total =
      document.documentElement.scrollHeight - window.innerHeight;

    const amount = total > 0
      ? window.scrollY / total * 100
      : 0;

    if (pageProgress) {
      pageProgress.style.width = `${amount}%`;
    }
  }

  window.addEventListener("scroll", updatePageProgress, {
    passive: true
  });

  updatePageProgress();

  // =========================================
  // IMMERSIVE PHOTO TOUR
  // =========================================

  const photos = [...document.querySelectorAll(".gallery-item")];
  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = lightbox?.querySelector("figure img");
  const lightboxCaption = lightbox?.querySelector("figcaption");

  let currentPhoto = 0;
  let touchStartX = 0;
  let tourThumbnails;
  let tourCounter;
  let tourProgress;

  if (lightbox && photos.length && lightboxImage) {
    const header = document.createElement("div");
    header.className = "tour-header";
    header.textContent = "FOUNTAIN OF HOPE · PHOTO TOUR";
    lightbox.appendChild(header);

    tourCounter = document.createElement("div");
    tourCounter.className = "tour-counter";
    lightbox.appendChild(tourCounter);

    tourProgress = document.createElement("div");
    tourProgress.className = "tour-progress";
    tourProgress.innerHTML = "<span></span>";
    lightbox.appendChild(tourProgress);

    tourThumbnails = document.createElement("div");
    tourThumbnails.className = "tour-thumbnails";

    photos.forEach((photo, index) => {
      const image = photo.querySelector("img");
      const button = document.createElement("button");

      button.className = "tour-thumbnail";
      button.type = "button";
      button.setAttribute("aria-label", `View photo ${index + 1}`);

      const thumbnail = document.createElement("img");
      thumbnail.src = image.src;
      thumbnail.alt = "";

      button.appendChild(thumbnail);
      button.addEventListener("click", () => showPhoto(index));

      tourThumbnails.appendChild(button);
    });

    lightbox.appendChild(tourThumbnails);
  }

  function showPhoto(index) {
    if (!photos.length || !lightboxImage) return;

    currentPhoto = (index + photos.length) % photos.length;

    const selected = photos[currentPhoto];
    const image = selected.querySelector("img");

    lightboxImage.style.opacity = "0";

    window.setTimeout(() => {
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent =
        selected.dataset.caption || image.alt || "";

      lightboxImage.style.opacity = "1";
    }, reducedMotion ? 0 : 180);

    if (tourCounter) {
      tourCounter.innerHTML =
        `<strong>${String(currentPhoto + 1).padStart(2, "0")}</strong> / ${String(photos.length).padStart(2, "0")}`;
    }

    if (tourProgress) {
      tourProgress.querySelector("span").style.width =
        `${((currentPhoto + 1) / photos.length) * 100}%`;
    }

    tourThumbnails?.querySelectorAll(".tour-thumbnail")
      .forEach((thumbnail, i) => {
        thumbnail.classList.toggle("active", i === currentPhoto);
      });
  }

  function openGallery(index) {
    if (!lightbox) return;

    showPhoto(index);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    lightbox.querySelector(".lightbox-close")?.focus();
  }

  function closeGallery() {
    if (!lightbox) return;

    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  photos.forEach((photo, index) => {
    photo.addEventListener("click", () => openGallery(index));
  });

  lightbox?.querySelector(".lightbox-close")
    ?.addEventListener("click", closeGallery);

  lightbox?.querySelector(".lightbox-prev")
    ?.addEventListener("click", () => showPhoto(currentPhoto - 1));

  lightbox?.querySelector(".lightbox-next")
    ?.addEventListener("click", () => showPhoto(currentPhoto + 1));

  lightbox?.addEventListener("click", event => {
    if (event.target === lightbox) closeGallery();
  });

  // KEYBOARD CONTROLS
  document.addEventListener("keydown", event => {
    if (!lightbox?.classList.contains("open")) return;

    if (event.key === "Escape") closeGallery();
    if (event.key === "ArrowRight") showPhoto(currentPhoto + 1);
    if (event.key === "ArrowLeft") showPhoto(currentPhoto - 1);
  });

  // MOBILE SWIPE
  lightbox?.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });

  lightbox?.addEventListener("touchend", event => {
    const difference =
      event.changedTouches[0].screenX - touchStartX;

    if (Math.abs(difference) < 50) return;

    if (difference < 0) showPhoto(currentPhoto + 1);
    else showPhoto(currentPhoto - 1);
  }, { passive: true });

  // Stop here if motion is disabled or GSAP is unavailable.
  if (reducedMotion || !hasGSAP) return;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  gsap.registerPlugin(ScrollTrigger);

  // HERO
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".hero .eyebrow", {
      opacity: 0,
      y: 25,
      duration: .8
    })
    .from(".hero h1", {
      opacity: 0,
      y: 65,
      duration: 1.1
    }, "-=.4")
    .from(".hero-copy > p, .hero-actions", {
      opacity: 0,
      y: 25,
      stagger: .15,
      duration: .8
    }, "-=.5")
    .from(".hero-visual img", {
      scale: 1.14,
      duration: 1.5
    }, "-=1");

  // CINEMATIC STORY
  const cinematic = document.querySelector(".cinematic");

  if (cinematic) {
    const backgrounds = gsap.utils.toArray(
      ".cinematic-background"
    );

    const scenes = gsap.utils.toArray(
      ".cinematic-scene"
    );

    const line = document.querySelector(
      ".cinematic-line span"
    );

    const counter = document.querySelector(
      ".scene-counter"
    );

    if (backgrounds.length >= 3 && scenes.length >= 3) {
      gsap.set(backgrounds, { autoAlpha: 0, scale: 1.15 });
      gsap.set(scenes, { autoAlpha: 0, y: 55 });

      gsap.set(backgrounds[0], { autoAlpha: 1, scale: 1 });
      gsap.set(scenes[0], { autoAlpha: 1, y: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: cinematic,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,

          onUpdate: self => {
            if (line) {
              gsap.set(line, {
                scaleX: self.progress,
                transformOrigin: "left center"
              });
            }

            if (counter) {
              const number = Math.min(
                3,
                Math.floor(self.progress * 3) + 1
              );

              counter.textContent = `0${number} — 03`;
            }
          }
        }
      });

      timeline
        .to(scenes[0], {
          autoAlpha: 0, y: -50, duration: .7
        }, .8)
        .to(backgrounds[0], {
          autoAlpha: 0, scale: 1.25, duration: 1
        }, .8)
        .to(backgrounds[1], {
          autoAlpha: 1, scale: 1, duration: 1
        }, 1)
        .to(scenes[1], {
          autoAlpha: 1, y: 0, duration: .8
        }, 1.1)
        .to(scenes[1], {
          autoAlpha: 0, y: -50, duration: .7
        }, 2.8)
        .to(backgrounds[1], {
          autoAlpha: 0, scale: 1.25, duration: 1
        }, 2.8)
        .to(backgrounds[2], {
          autoAlpha: 1, scale: 1, duration: 1
        }, 3)
        .to(scenes[2], {
          autoAlpha: 1, y: 0, duration: .8
        }, 3.1)
        .to(backgrounds[2], {
          scale: 1.12, duration: 1.5
        }, 4);
    }
  }

  // SECTION HEADINGS
  gsap.utils.toArray(
    ".story-grid h2, .living-heading h2, .gallery-heading h2, .outdoor-copy h2, .contact h2"
  ).forEach(element => {
    gsap.from(element, {
      opacity: 0,
      y: 55,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        once: true
      }
    });
  });

  // STORY COPY
  gsap.from(".story-copy > *", {
    opacity: 0,
    y: 30,
    stagger: .14,
    duration: .8,
    scrollTrigger: {
      trigger: ".story-copy",
      start: "top 82%",
      once: true
    }
  });

  // MANIFESTO
  gsap.from(".manifesto-inner > *", {
    opacity: 0,
    y: 55,
    stagger: .18,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".manifesto",
      start: "top 75%",
      once: true
    }
  });

  // LIVING CARDS
  gsap.from(".living-card", {
    opacity: 0,
    y: 75,
    scale: .95,
    stagger: .2,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".living-grid",
      start: "top 80%",
      once: true
    }
  });

  // IMAGE PARALLAX
  gsap.utils.toArray(
    ".living-card img, .outdoor-image img"
  ).forEach((image, index) => {
    gsap.fromTo(image,
      { scale: 1.16, yPercent: -4 },
      {
        scale: 1,
        yPercent: 4,
        ease: "none",
        scrollTrigger: {
          trigger: image.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      }
    );
  });

  // GALLERY REVEAL
  gsap.from(".gallery-item", {
    opacity: 0,
    y: 65,
    scale: .96,
    stagger: .12,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".gallery-grid",
      start: "top 80%",
      once: true
    }
  });

  // CONTACT CARD
  gsap.from(".contact-card", {
    opacity: 0,
    x: 55,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".contact",
      start: "top 75%",
      once: true
    }
  });

  // FOOTER
  gsap.from(".footer-top, .footer-bottom", {
    opacity: 0,
    y: 25,
    stagger: .18,
    duration: .8,
    scrollTrigger: {
      trigger: "footer",
      start: "top 90%",
      once: true
    }
  });

  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });

});

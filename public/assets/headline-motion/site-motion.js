(() => {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  if (!gsap || reduceMotion) {
    return;
  }

  if (ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  const toArray = gsap.utils.toArray;
  const softEase = "power3.out";
  const traceEase = "sine.out";

  const mark = (targets, className) => {
    toArray(targets).forEach((target) => target.classList.add(className));
  };

  const reveal = (targets, vars = {}) => {
    toArray(targets).forEach((target) => {
      if (!target || target.dataset.hmSiteAnimated) {
        return;
      }

      target.dataset.hmSiteAnimated = "true";
      target.classList.add("hm-motion-soft");

      gsap.fromTo(target, {
        autoAlpha: 0,
        filter: `blur(${vars.blur ?? 14}px)`,
        y: vars.y ?? 38,
      }, {
        autoAlpha: 1,
        clearProps: "visibility",
        duration: vars.duration ?? 0.9,
        ease: vars.ease ?? softEase,
        filter: "blur(0px)",
        scrollTrigger: ScrollTrigger ? {
          trigger: target,
          start: vars.start ?? "top 86%",
          once: true,
        } : undefined,
        y: 0,
      });
    });
  };

  const revealMedia = (targets) => {
    toArray(targets).forEach((target) => {
      if (!target || target.dataset.hmMediaAnimated) {
        return;
      }

      target.dataset.hmMediaAnimated = "true";
      target.classList.add("hm-motion-media");

      gsap.fromTo(target, {
        autoAlpha: 0,
        clipPath: "inset(0 0 18% 0)",
        filter: "blur(18px)",
        scale: 1.08,
      }, {
        autoAlpha: 1,
        clearProps: "visibility",
        clipPath: "inset(0 0 0% 0)",
        duration: 1.05,
        ease: softEase,
        filter: "blur(0px)",
        scale: 1,
        scrollTrigger: ScrollTrigger ? {
          trigger: target,
          start: "top 88%",
          once: true,
        } : undefined,
      });
    });
  };

  const animateFrames = () => {
    toArray(".title-form").forEach((frame) => {
      const corners = frame.querySelectorAll(".topleft, .topright, .bottomleft, .bottomright");

      if (!corners.length) {
        return;
      }

      mark(corners, "hm-motion-frame");

      gsap.fromTo(corners, {
        autoAlpha: 0,
        filter: "blur(7px)",
        rotation: 135,
        scale: 0,
      }, {
        autoAlpha: 1,
        duration: 0.68,
        ease: "back.out(1.8)",
        filter: "blur(0px)",
        rotation: 45,
        scale: 1,
        stagger: { amount: 0.22, from: "edges" },
        scrollTrigger: ScrollTrigger ? {
          trigger: frame,
          start: "top 82%",
          once: true,
        } : undefined,
      });
    });
  };

  const animateHero = () => {
    const nav = document.querySelector(".nav");
    const hpText = toArray(".hpherotextcontainer .projectparagraph");
    const buttons = toArray(".mininav .button");
    const timeline = gsap.timeline({ delay: 0.08, defaults: { ease: softEase } });

    if (nav) {
      timeline.fromTo(nav, {
        autoAlpha: 0,
        filter: "blur(10px)",
        y: -18,
      }, {
        autoAlpha: 1,
        duration: 0.75,
        filter: "blur(0px)",
        y: 0,
      }, 0);
    }

    if (hpText.length) {
      timeline.fromTo(hpText, {
        autoAlpha: 0,
        filter: "blur(12px)",
        y: 16,
      }, {
        autoAlpha: 1,
        duration: 0.86,
        filter: "blur(0px)",
        stagger: 0.1,
        y: 0,
      }, 0.28);
    }

    if (buttons.length) {
      timeline.fromTo(buttons, {
        autoAlpha: 0,
        filter: "blur(12px)",
        y: 18,
      }, {
        autoAlpha: 1,
        duration: 0.7,
        filter: "blur(0px)",
        stagger: { amount: 0.28, from: "center" },
        y: 0,
      }, 0.62);
    }
  };

  const animateProjects = () => {
    revealMedia(".thumbnail, .videothumbnail, .longvideo, .projectvideo, .projectvideolong, .project-image");
    reveal(".projectlink", { blur: 10, duration: 0.74, y: 22, start: "top 90%" });
    reveal(".projectimgmetadata", { blur: 9, duration: 0.7, y: 18, start: "top 92%" });

    toArray(".project").forEach((project) => {
      project.classList.add("hm-project-active");
      const icons = project.querySelectorAll(".project-icons img");

      if (icons.length) {
        gsap.fromTo(icons, {
          autoAlpha: 0,
          filter: "blur(8px)",
          scale: 0.72,
          x: 10,
        }, {
          autoAlpha: 1,
          duration: 0.55,
          ease: softEase,
          filter: "blur(0px)",
          scale: 1,
          scrollTrigger: ScrollTrigger ? {
            trigger: project,
            start: "top 84%",
            once: true,
          } : undefined,
          stagger: 0.08,
          x: 0,
        });
      }
    });
  };

  const animateProjectPages = () => {
    reveal(".aboutproject .projectparagraph", { blur: 13, duration: 0.95, y: 28, start: "top 88%" });
    reveal(".about", { blur: 14, duration: 1, y: 34, start: "top 88%" });
    reveal(".project-footer .hero-footername", { blur: 14, duration: 1, y: 34, start: "top 98%" });
  };

  const bindHover = () => {
    toArray(".project").forEach((project) => {
      const media = project.querySelector(".thumbnail, .videothumbnail, .longvideo");
      const link = project.querySelector(".projectlink");
      const icons = project.querySelectorAll(".project-icons img");

      const enter = () => {
        if (media) {
          gsap.to(media, { duration: 0.55, ease: traceEase, filter: "blur(0px)", scale: 1.018 });
        }

        if (link) {
          gsap.to(link, { duration: 0.38, ease: traceEase, letterSpacing: "0.055em" });
        }

        if (icons.length) {
          gsap.to(icons, { duration: 0.4, ease: softEase, stagger: 0.04, x: -4 });
        }
      };

      const leave = () => {
        if (media) {
          gsap.to(media, { duration: 0.65, ease: softEase, scale: 1 });
        }

        if (link) {
          gsap.to(link, { duration: 0.42, ease: softEase, letterSpacing: "0em" });
        }

        if (icons.length) {
          gsap.to(icons, { duration: 0.42, ease: softEase, x: 0 });
        }
      };

      project.addEventListener("mouseenter", enter);
      project.addEventListener("mouseleave", leave);
      project.addEventListener("focusin", enter);
      project.addEventListener("focusout", leave);
    });
  };

  animateHero();
  animateFrames();
  animateProjects();
  animateProjectPages();
  bindHover();

  window.addEventListener("load", () => {
    ScrollTrigger?.refresh();
  }, { once: true });
})();

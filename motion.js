(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const toArray = (target) => {
    if (!target) return [];
    if (typeof target === "string") return Array.from(document.querySelectorAll(target));
    if (target instanceof Element || target === window || target === document) return [target];
    return Array.from(target);
  };

  const animate = (target, keyframes, options = {}) => {
    const elements = toArray(target);
    const animations = [];

    elements.forEach((element, index) => {
      const delay = (options.delay || 0) + (options.stagger || 0) * index;
      const config = {
        duration: reduceMotion ? 1 : options.duration || 700,
        delay: reduceMotion ? 0 : delay,
        easing: options.easing || "cubic-bezier(.2,.8,.2,1)",
        fill: options.fill || "forwards",
        iterations: options.iterations || 1,
        direction: options.direction || "normal",
      };

      if (typeof element.animate === "function") {
        animations.push(element.animate(keyframes, config));
      } else {
        const lastFrame = Array.isArray(keyframes) ? keyframes[keyframes.length - 1] : keyframes;
        Object.assign(element.style, lastFrame);
      }
    });

    return animations;
  };

  const rafThrottle = (callback) => {
    let frame = null;
    return (...args) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        callback(...args);
      });
    };
  };

  const lerp = (start, end, amount) => start + (end - start) * amount;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const observe = (targets, callback, options = {}) => {
    const elements = toArray(targets);

    if (!("IntersectionObserver" in window) || reduceMotion) {
      elements.forEach((element) => callback(element, null));
      return null;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          callback(entry.target, entry);
          if (options.once !== false) observer.unobserve(entry.target);
        });
      },
      {
        threshold: options.threshold ?? 0.14,
        rootMargin: options.rootMargin || "0px 0px -45px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));
    return observer;
  };

  window.AzielMotion = {
    animate,
    observe,
    rafThrottle,
    lerp,
    clamp,
    reduceMotion,
    toArray,
  };
})();

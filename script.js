const scrambleTargets = document.querySelectorAll(".scramble-text");
const fittedTargets = document.querySelectorAll("[data-fit-max]");
const fittedLineTargets = document.querySelectorAll("[data-fit-lines-max]");
const scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>*+";
const prefersReducedMotion = false;

const fitTextToWidth = (element) => {
  const maxRem = Number(element.dataset.fitMax ?? "3");
  const minRem = Number(element.dataset.fitMin ?? "0.7");
  let low = minRem;
  let high = maxRem;
  let best = minRem;

  while (high - low > 0.01) {
    const mid = (low + high) / 2;
    element.style.fontSize = `${mid}rem`;

    if (element.scrollWidth <= element.clientWidth) {
      best = mid;
      low = mid;
    } else {
      high = mid;
    }
  }

  element.style.fontSize = `${best}rem`;
};

const animateScramble = (element, delay = 0, speed = 40, revealStep = 0.5) => {
  const finalText = element.textContent ?? "";
  const letters = [...finalText];
  let frame = 0;

  window.setTimeout(() => {
    const intervalId = window.setInterval(() => {
      const output = letters
        .map((char, index) => {
          if (char === " ") {
            return " ";
          }

          if (index < frame * revealStep) {
            return char;
          }

          const randomIndex = Math.floor(Math.random() * scrambleChars.length);
          return scrambleChars[randomIndex];
        })
        .join("");

      element.textContent = output;
      fitTextToWidth(element);
      frame += 1;

      if (frame * revealStep > letters.length) {
        window.clearInterval(intervalId);
        element.textContent = finalText;
        fitTextToWidth(element);
      }
    }, speed);
  }, delay);
};

const fitLinesToWidth = (element) => {
  const lines = [...element.querySelectorAll(".contact-copy__line")];

  if (!lines.length) {
    return;
  }

  const maxRem = Number(element.dataset.fitLinesMax ?? "1");
  const minRem = Number(element.dataset.fitLinesMin ?? "0.55");
  let low = minRem;
  let high = maxRem;
  let best = minRem;

  while (high - low > 0.01) {
    const mid = (low + high) / 2;
    element.style.fontSize = `${mid}rem`;

    const widestLine = Math.max(...lines.map((line) => line.scrollWidth));

    if (widestLine <= element.clientWidth) {
      best = mid;
      low = mid;
    } else {
      high = mid;
    }
  }

  element.style.fontSize = `${best}rem`;
};

const syncFittedText = () => {
  fittedTargets.forEach((element) => {
    fitTextToWidth(element);
  });

  fittedLineTargets.forEach((element) => {
    fitLinesToWidth(element);
  });
};

scrambleTargets.forEach((element, index) => {
  if (element.classList.contains("subtitle")) {
    animateScramble(element, index * 140, 28, 0.75);
    return;
  }

  animateScramble(element, index * 220, 46, 0.42);
});

window.addEventListener("resize", syncFittedText);

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(syncFittedText);
}

syncFittedText();

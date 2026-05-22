(function () {
  "use strict";

  const programSelect = document.getElementById("programSelect");
  const daySelector = document.getElementById("daySelector");
  const grid = document.getElementById("exerciseGrid");
  const dayCount = document.getElementById("dayCount");
  const themeToggle = document.getElementById("themeToggle");

  let currentProgram = 0;
  let currentDay = 0;
  let frameToggle = 0; // 0 -> show /0.jpg, 1 -> show /1.jpg

  // --- Theme -----------------------------------------------------------------
  function applyTheme(dark) {
    document.body.classList.toggle("dark", dark);
    themeToggle.textContent = dark ? "☀️" : "🌙";
  }
  themeToggle.addEventListener("click", function () {
    const dark = !document.body.classList.contains("dark");
    applyTheme(dark);
    localStorage.setItem("gym-theme", dark ? "dark" : "light");
  });
  (function initTheme() {
    const saved = localStorage.getItem("gym-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(saved === "dark" || (!saved && prefersDark));
  })();

  // --- Image helpers ---------------------------------------------------------
  function frameUrl(ex, frame) {
    if (ex.gif) return ex.gif; // local override, single asset
    return EX_IMG_BASE + ex.dbId + "/" + frame + ".jpg";
  }

  // Builds a labeled row of muscle chips. `muscles` may be null for "none".
  function muscleGroup(label, muscles, isPrimary) {
    const row = document.createElement("div");
    row.className = "muscle-group";

    const lbl = document.createElement("span");
    lbl.className = "muscle-group-label";
    lbl.textContent = label;
    row.appendChild(lbl);

    const chips = document.createElement("div");
    chips.className = "muscle-chips";
    if (!muscles) {
      const none = document.createElement("span");
      none.className = "muscle-chip muscle-chip-none";
      none.textContent = "—";
      chips.appendChild(none);
    } else {
      muscles.forEach(function (m) {
        const chip = document.createElement("span");
        chip.className = "muscle-chip" + (isPrimary ? " muscle-chip-primary" : "");
        chip.textContent = m;
        chips.appendChild(chip);
      });
    }
    row.appendChild(chips);
    return row;
  }

  // --- Rendering -------------------------------------------------------------
  function renderProgramOptions() {
    programSelect.innerHTML = "";
    PROGRAMS.forEach(function (p, i) {
      const opt = document.createElement("option");
      opt.value = String(i);
      opt.textContent = p.name;
      programSelect.appendChild(opt);
    });
    programSelect.value = String(currentProgram);
  }

  function renderDays() {
    const program = PROGRAMS[currentProgram];
    daySelector.innerHTML = "";
    program.days.forEach(function (day, i) {
      const btn = document.createElement("button");
      btn.textContent = day.name;
      btn.className = i === currentDay ? "active" : "";
      btn.addEventListener("click", function () {
        currentDay = i;
        renderDays();
        renderExercises();
      });
      daySelector.appendChild(btn);
    });
    dayCount.textContent =
      program.days.length + " days · " + program.days[currentDay].exercises.length + " exercises today";
  }

  function renderExercises() {
    const exercises = PROGRAMS[currentProgram].days[currentDay].exercises;
    grid.innerHTML = "";

    exercises.forEach(function (ex) {
      const card = document.createElement("article");
      card.className = "card";

      // Media
      const media = document.createElement("div");
      media.className = "card-media";

      const badge = document.createElement("span");
      badge.className = "muscle-badge";
      badge.textContent = ex.primary;

      const img = document.createElement("img");
      img.alt = ex.name + " demonstration";
      img.loading = "lazy";
      img.dataset.frame0 = frameUrl(ex, 0);
      img.dataset.frame1 = ex.gif ? frameUrl(ex, 0) : frameUrl(ex, 1);
      img.src = frameToggle === 1 ? img.dataset.frame1 : img.dataset.frame0;
      img.onerror = function () {
        // Replace broken image with a neutral placeholder, stop animating it.
        img.onerror = null;
        delete img.dataset.frame0;
        delete img.dataset.frame1;
        img.remove();
        if (!media.querySelector(".placeholder")) {
          const ph = document.createElement("div");
          ph.className = "placeholder";
          ph.textContent = "🏋️";
          media.appendChild(ph);
        }
      };

      media.appendChild(img);
      media.appendChild(badge);

      // Body
      const body = document.createElement("div");
      body.className = "card-body";

      const name = document.createElement("h2");
      name.className = "card-name";
      name.textContent = ex.name;

      const presc = document.createElement("div");
      presc.className = "card-prescription";
      presc.textContent = ex.sets + " × " + ex.reps + " · " + ex.weight;

      const muscles = document.createElement("div");
      muscles.className = "card-muscles";
      muscles.appendChild(muscleGroup("Primary", [ex.primary], true));
      const secondary = ex.secondary && ex.secondary.length ? ex.secondary : null;
      muscles.appendChild(muscleGroup("Secondary", secondary, false));

      const alt = document.createElement("div");
      alt.className = "card-alt";
      alt.innerHTML = "Alternative: <strong></strong>";
      alt.querySelector("strong").textContent = ex.alternative;

      body.appendChild(name);
      body.appendChild(presc);
      body.appendChild(muscles);
      body.appendChild(alt);

      card.appendChild(media);
      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  // Alternate the two frames across all cards to simulate motion.
  setInterval(function () {
    frameToggle = frameToggle === 0 ? 1 : 0;
    const imgs = grid.querySelectorAll("img[data-frame0]");
    imgs.forEach(function (img) {
      const next = frameToggle === 1 ? img.dataset.frame1 : img.dataset.frame0;
      if (next && img.src !== next) img.src = next;
    });
  }, 900);

  // --- Init ------------------------------------------------------------------
  programSelect.addEventListener("change", function () {
    currentProgram = Number(programSelect.value);
    currentDay = 0;
    renderDays();
    renderExercises();
  });

  renderProgramOptions();
  renderDays();
  renderExercises();
})();

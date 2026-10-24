(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // State (persisted per browser in localStorage)
  // ---------------------------------------------------------------------------
  const STORE_KEY = "pt-state-v2";
  const REST_SECONDS = 90;

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
  }
  const saved = load();
  const state = {
    program: Math.min(saved.program || 0, PROGRAMS.length - 1),
    day: saved.day || 0,
    logs: saved.logs || {},   // "p:d" -> { exIndex: [bool per set] }
    swaps: saved.swaps || {}, // "p:d:i" -> true
    view: "today",
    ex: 0,
  };
  if (state.day >= PROGRAMS[state.program].days.length) state.day = 0;

  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        program: state.program, day: state.day, logs: state.logs, swaps: state.swaps,
      }));
    } catch (e) { /* storage unavailable: app still works for this visit */ }
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  const $ = (id) => document.getElementById(id);
  const program = () => PROGRAMS[state.program];
  const day = (d) => program().days[d === undefined ? state.day : d];
  const dayKey = (d) => state.program + ":" + (d === undefined ? state.day : d);

  function setCount(ex) { return parseInt(ex.sets, 10) || 3; }

  function setsDone(d, i) {
    const log = state.logs[dayKey(d)] || {};
    const ex = day(d).exercises[i];
    const arr = log[i] || [];
    const out = [];
    for (let s = 0; s < setCount(ex); s++) out.push(!!arr[s]);
    return out;
  }
  function exDone(d, i) { return setsDone(d, i).every(Boolean); }
  function dayDoneCount(d) {
    return day(d).exercises.filter((_, i) => exDone(d, i)).length;
  }
  function dayDone(d) { return dayDoneCount(d) === day(d).exercises.length; }

  function writeSets(i, arr) {
    const k = dayKey();
    state.logs[k] = state.logs[k] || {};
    state.logs[k][i] = arr;
    save();
  }

  function imgUrl(ex) {
    if (ex.gif) return ex.gif;
    return EX_IMG_BASE + ex.dbId + "/0.jpg";
  }

  function weightParts(w) {
    const m = String(w).match(/^([\d.]+)\s*(\w+)?/);
    if (!m) return { num: "BW", unit: "" };
    return { num: m[1], unit: (m[2] || "").replace(/s$/, "") };
  }

  function focusOf(d) {
    const seen = [];
    day(d).exercises.forEach((e) => {
      if (seen.length < 3 && seen.indexOf(e.primary) === -1 && !/abs|core/i.test(e.primary)) seen.push(e.primary);
    });
    return seen.join(" · ");
  }

  function exName(i) {
    const ex = day().exercises[i];
    return state.swaps[dayKey() + ":" + i] ? ex.alternative : ex.name;
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function svg(html, size) {
    const s = size || 18;
    const span = document.createElement("span");
    span.style.display = "flex";
    span.innerHTML = '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + html + "</svg>";
    return span;
  }
  const CHECK = '<path d="M5 12l5 5 9-10"/>';

  // ---------------------------------------------------------------------------
  // TODAY
  // ---------------------------------------------------------------------------
  function renderProgramSelect() {
    const sel = $("programSelect");
    sel.innerHTML = "";
    PROGRAMS.forEach((p, i) => {
      const o = el("option", null, p.name);
      o.value = String(i);
      sel.appendChild(o);
    });
    sel.value = String(state.program);
  }

  function renderToday() {
    const d = day();
    const n = program().days.length;
    $("dayEyebrow").textContent = "Day " + (state.day + 1) + " of " + n;
    $("dayName").textContent = d.name;
    $("dayFocus").textContent = focusOf();

    const pills = $("dayPills");
    pills.innerHTML = "";
    program().days.forEach((x, i) => {
      const b = el("button", "pill" + (i === state.day ? " active" : ""), x.name);
      b.type = "button";
      if (i === state.day) b.setAttribute("aria-current", "true");
      b.addEventListener("click", () => { state.day = i; save(); renderToday(); });
      pills.appendChild(b);
    });

    const total = d.exercises.length;
    const done = dayDoneCount();
    const pct = Math.round((done / total) * 100);
    $("progressText").textContent = done + " / " + total + " exercises";
    $("progressBar").style.width = pct + "%";
    $("progressPct").textContent = pct + "%";

    const list = $("exList");
    list.innerHTML = "";
    d.exercises.forEach((ex, i) => {
      const isDone = exDone(undefined, i);
      const sets = setsDone(undefined, i);
      const li = el("li", "ex-item" + (isDone ? " done" : ""));

      const check = el("button", "check");
      check.type = "button";
      check.setAttribute("aria-label", (isDone ? "Mark not done: " : "Mark done: ") + exName(i));
      check.setAttribute("aria-pressed", String(isDone));
      if (isDone) check.appendChild(svg(CHECK, 16)); else check.textContent = String(i + 1);
      check.addEventListener("click", () => {
        writeSets(i, sets.map(() => !isDone));
        renderToday();
      });

      const open = el("button", "ex-open");
      open.type = "button";
      const thumb = el("img", "thumb");
      thumb.src = imgUrl(ex);
      thumb.alt = "";
      thumb.loading = "lazy";
      const text = el("span", "ex-text");
      text.appendChild(el("span", "ex-title", exName(i)));
      const meta = el("span", "ex-meta");
      const strong = el("strong", null, ex.sets + " × " + ex.reps);
      meta.appendChild(strong);
      meta.appendChild(document.createTextNode(" · " + ex.weight + " · " + ex.primary));
      text.appendChild(meta);
      const nDone = sets.filter(Boolean).length;
      if (nDone > 0 && !isDone) text.appendChild(el("span", "ex-sets", nDone + " of " + sets.length + " sets done"));
      open.appendChild(thumb);
      open.appendChild(text);
      const chev = svg('<path d="M9 6l6 6-6 6"/>', 18);
      chev.className = "chev";
      chev.firstChild.setAttribute("stroke-width", "2");
      open.appendChild(chev);
      open.addEventListener("click", () => openExercise(i));

      li.appendChild(check);
      li.appendChild(open);
      list.appendChild(li);
    });

    const firstOpen = d.exercises.findIndex((_, i) => !exDone(undefined, i));
    $("startLabel").textContent =
      done === 0 ? "Start workout" :
      firstOpen === -1 ? "Workout complete" : "Continue workout";
  }

  // ---------------------------------------------------------------------------
  // EXERCISE
  // ---------------------------------------------------------------------------
  let restLeft = 0;
  let restTimer = null;

  function startRest(sec) {
    restLeft = sec;
    renderRest();
    clearInterval(restTimer);
    restTimer = setInterval(() => {
      restLeft -= 1;
      if (restLeft <= 0) {
        restLeft = 0;
        clearInterval(restTimer);
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      }
      renderRest();
    }, 1000);
  }
  function stopRest() { restLeft = 0; clearInterval(restTimer); renderRest(); }
  function renderRest() {
    $("restBar").hidden = restLeft <= 0;
    $("restTime").textContent = Math.floor(restLeft / 60) + ":" + String(restLeft % 60).padStart(2, "0");
  }

  function openExercise(i) {
    state.ex = i;
    show("exercise");
    renderExercise();
    window.scrollTo(0, 0);
  }

  function renderExercise() {
    const i = state.ex;
    const ex = day().exercises[i];
    const swapped = !!state.swaps[dayKey() + ":" + i];
    const total = day().exercises.length;

    $("exCounter").textContent = "Exercise " + (i + 1) + " of " + total;
    const img = $("exImg");
    img.src = imgUrl(ex);
    img.alt = ex.name + " demonstration";
    $("exMuscles").textContent = [ex.primary].concat(ex.secondary || []).join(" · ");
    $("exName").textContent = swapped ? ex.alternative : ex.name;

    const t = $("exTarget");
    t.innerHTML = "";
    t.appendChild(document.createTextNode("Target "));
    t.appendChild(el("strong", null, ex.sets + " × " + ex.reps));
    t.appendChild(document.createTextNode(" at "));
    t.appendChild(el("strong", null, ex.weight));
    if (swapped) t.appendChild(document.createTextNode(" · demo shows " + ex.name));

    const rows = $("setRows");
    rows.innerHTML = "";
    const sets = setsDone(undefined, i);
    const w = weightParts(ex.weight);
    sets.forEach((isDone, s) => {
      const row = el("div", "set-row" + (isDone ? " done" : ""));
      row.setAttribute("role", "row");
      const n = el("span", "set-n", String(s + 1)); n.setAttribute("role", "cell");
      const wv = el("span", "set-val", w.num + " "); wv.setAttribute("role", "cell");
      if (w.unit) wv.appendChild(el("small", null, w.unit));
      const rv = el("span", "set-val", ex.reps); rv.setAttribute("role", "cell");
      const cell = el("span"); cell.setAttribute("role", "cell");
      const b = el("button", "set-btn");
      b.type = "button";
      b.setAttribute("aria-label", "Set " + (s + 1) + (isDone ? " done" : " not done"));
      b.setAttribute("aria-pressed", String(isDone));
      b.appendChild(svg(CHECK, 18));
      b.addEventListener("click", () => {
        const next = setsDone(undefined, i);
        next[s] = !next[s];
        writeSets(i, next);
        if (next[s] && !next.every(Boolean)) startRest(REST_SECONDS);
        if (next.every(Boolean)) stopRest();
        renderExercise();
      });
      cell.appendChild(b);
      [n, wv, rv, cell].forEach((c) => row.appendChild(c));
      rows.appendChild(row);
    });

    const st = $("swapText");
    st.innerHTML = "";
    if (swapped) {
      st.appendChild(document.createTextNode("Swapped from "));
      st.appendChild(el("strong", null, ex.name));
      $("swapBtn").textContent = "Undo";
    } else {
      st.appendChild(document.createTextNode("Station busy? "));
      st.appendChild(el("strong", null, ex.alternative));
      $("swapBtn").textContent = "Swap";
    }

    const nextOpen = nextUndone(i);
    $("nextBtn").textContent = nextOpen === -1 ? "Finish workout" : "Next exercise";
  }

  function nextUndone(from) {
    const n = day().exercises.length;
    for (let k = 1; k <= n; k++) {
      const j = (from + k) % n;
      if (!exDone(undefined, j)) return j;
    }
    return -1;
  }

  // ---------------------------------------------------------------------------
  // PROGRAM
  // ---------------------------------------------------------------------------
  function renderProgram() {
    $("progName").textContent = program().name;

    const seg = $("progSegment");
    seg.innerHTML = "";
    PROGRAMS.forEach((p, i) => {
      const b = el("button", null, p.name.replace(/^\d+-Day\s*/, "").replace(/\s*Program$/, "") || p.name);
      b.type = "button";
      b.setAttribute("role", "radio");
      b.setAttribute("aria-checked", String(i === state.program));
      b.title = p.name;
      b.addEventListener("click", () => switchProgram(i));
      seg.appendChild(b);
    });

    const days = program().days;
    let daysDone = 0, exCount = 0, setsLogged = 0;
    days.forEach((d, di) => {
      if (dayDone(di)) daysDone++;
      exCount += d.exercises.length;
      d.exercises.forEach((_, i) => { setsLogged += setsDone(di, i).filter(Boolean).length; });
    });
    $("statDays").textContent = daysDone + "/" + days.length;
    $("statEx").textContent = String(exCount);
    $("statSets").textContent = String(setsLogged);

    const nextDay = days.findIndex((_, di) => !dayDone(di));
    const list = $("dayList");
    list.innerHTML = "";
    days.forEach((d, di) => {
      const isDone = dayDone(di);
      const isNext = di === nextDay;
      const li = el("li");
      const b = el("button", "day-card" + (isDone ? " done" : "") + (isNext ? " next" : ""));
      b.type = "button";
      const badge = el("span", "day-badge");
      if (isDone) badge.appendChild(svg(CHECK, 16)); else badge.textContent = String(di + 1);
      const text = el("span", "day-text");
      const title = el("span", "day-title", d.name);
      if (isNext) title.appendChild(el("span", "tag", "Up next"));
      text.appendChild(title);
      text.appendChild(el("span", "muted small", focusOf(di) + " · " + d.exercises.length + " exercises"));
      b.appendChild(badge);
      b.appendChild(text);
      b.addEventListener("click", () => { state.day = di; save(); show("today"); });
      li.appendChild(b);
      list.appendChild(li);
    });
  }

  function switchProgram(i) {
    state.program = i;
    state.day = 0;
    save();
    $("programSelect").value = String(i);
    render();
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------
  function show(view) {
    state.view = view;
    $("viewToday").hidden = view !== "today";
    $("viewExercise").hidden = view !== "exercise";
    $("viewProgram").hidden = view !== "program";
    document.querySelector(".app").classList.toggle("in-exercise", view === "exercise");
    document.querySelectorAll(".tab").forEach((t) => {
      const on = t.dataset.tab === view;
      t.classList.toggle("active", on);
      if (on) t.setAttribute("aria-current", "page"); else t.removeAttribute("aria-current");
    });
    if (view !== "exercise") stopRest();
    render();
  }

  function render() {
    if (state.view === "today") renderToday();
    else if (state.view === "program") renderProgram();
    else renderExercise();
  }

  // ---------------------------------------------------------------------------
  // Wiring
  // ---------------------------------------------------------------------------
  $("programSelect").addEventListener("change", (e) => switchProgram(Number(e.target.value)));
  $("resetDay").addEventListener("click", () => {
    if (!dayDoneCount() && !Object.keys(state.logs[dayKey()] || {}).length) return;
    delete state.logs[dayKey()];
    save();
    renderToday();
  });
  $("startBtn").addEventListener("click", () => {
    const first = day().exercises.findIndex((_, i) => !exDone(undefined, i));
    if (first === -1) { show("program"); return; }
    openExercise(first);
  });
  $("backBtn").addEventListener("click", () => show("today"));
  $("restSkip").addEventListener("click", stopRest);
  $("restAdd").addEventListener("click", () => { restLeft += 30; renderRest(); });
  $("swapBtn").addEventListener("click", () => {
    const k = dayKey() + ":" + state.ex;
    if (state.swaps[k]) delete state.swaps[k]; else state.swaps[k] = true;
    save();
    renderExercise();
  });
  $("nextBtn").addEventListener("click", () => {
    const j = nextUndone(state.ex);
    if (j === -1) show("today"); else openExercise(j);
  });
  document.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => show(t.dataset.tab)));

  renderProgramSelect();
  show("today");
})();

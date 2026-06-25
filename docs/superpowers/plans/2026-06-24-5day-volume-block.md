# 5-Day Volume Block Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new hypertrophy-focused 5-day PPL/PPL program ("5-Day Volume Block") to the existing personal trainer reference app.

**Architecture:** The app is fully data-driven — the UI reads from the `PROGRAMS` array in `programs.js` and renders everything automatically. Adding a new program is a single append to that array. No HTML, CSS, or JS logic changes are needed.

**Tech Stack:** Vanilla JS, Vite 5, free-exercise-db (MIT) for demo images via raw GitHub URLs.

## Global Constraints

- All exercises must be distinct from those in the existing `"five-day"` and `"five-day-cut"` programs
- `dbId` maps to a folder in `https://github.com/yuhonas/free-exercise-db/tree/main/exercises/` — broken images fall back to a 🏋️ placeholder automatically, so an imperfect `dbId` is acceptable
- `gif: null` unless a local asset in `/assets/` overrides the dbId frames
- New program `id` must be `"five-day-volume"`

---

### Task 1: Add 5-Day Volume Block to programs.js

**Files:**
- Modify: `programs.js` — append new program object to the `PROGRAMS` array

**Interfaces:**
- Consumes: existing `PROGRAMS` array and `EX_IMG_BASE` constant already defined in `programs.js`
- Produces: `PROGRAMS[2]` — a new program object the app picks up automatically via `PROGRAMS.forEach` in `app.js`

- [ ] **Step 1: Open programs.js and append the new program**

In `programs.js`, after the closing `},` of the `"five-day-cut"` object (line 136) and before the closing `];` (line 137), add a comma after line 136 if not already there, then append:

```js
  {
    id: "five-day-volume",
    name: "5-Day Volume Block",
    days: [
      {
        name: "Push A",
        exercises: [
          { name: "Decline Barbell Bench Press", sets: "4", reps: "6-8", weight: "155 lbs", primary: "Chest", secondary: ["Triceps", "Shoulders"], alternative: "Decline DB Press", dbId: "Decline_Barbell_Bench_Press", gif: null },
          { name: "Pec Deck Machine Fly", sets: "3", reps: "12-15", weight: "100 lbs", primary: "Chest", secondary: [], alternative: "Cable Crossover", dbId: "Pec_Deck_Flyes", gif: null },
          { name: "EZ Bar Skull Crushers", sets: "3", reps: "10-12", weight: "65 lbs", primary: "Triceps", secondary: [], alternative: "Overhead Cable Extension", dbId: "Skull_Crusher", gif: null },
          { name: "Machine Lateral Raise", sets: "3", reps: "15-20", weight: "60 lbs", primary: "Side Delts", secondary: [], alternative: "Cable Lateral Raise", dbId: "Side_Lateral_Raise", gif: null },
          { name: "Smith Machine Overhead Press", sets: "3", reps: "10-12", weight: "95 lbs", primary: "Shoulders", secondary: ["Triceps"], alternative: "DB Shoulder Press", dbId: "Smith_Machine_Overhead_Press", gif: null },
          { name: "Weighted Decline Sit-Up", sets: "3", reps: "15-20", weight: "25 lbs", primary: "Abs", secondary: ["Hip Flexors"], alternative: "Crunch", dbId: "Decline_Crunch", gif: null },
        ],
      },
      {
        name: "Pull A",
        exercises: [
          { name: "Conventional Deadlift", sets: "4", reps: "4-6", weight: "275 lbs", primary: "Back", secondary: ["Hamstrings", "Glutes", "Traps"], alternative: "Trap Bar Deadlift", dbId: "Barbell_Deadlift", gif: null },
          { name: "T-Bar Row", sets: "4", reps: "8-10", weight: "135 lbs", primary: "Back", secondary: ["Lats", "Biceps", "Rear Delts"], alternative: "Chest-Supported Row", dbId: "T-Bar_Row", gif: null },
          { name: "Reverse Grip Lat Pulldown", sets: "3", reps: "12", weight: "120 lbs", primary: "Lats", secondary: ["Biceps", "Mid-Back"], alternative: "Neutral Grip Pulldown", dbId: "Underhand_Cable_Pulldowns", gif: null },
          { name: "Cable Rear Delt Fly", sets: "3", reps: "15", weight: "20 lbs", primary: "Rear Delts", secondary: ["Mid-Back"], alternative: "Reverse Pec Deck", dbId: "Rear_Delt_Fly", gif: null },
          { name: "EZ Bar Preacher Curl", sets: "4", reps: "10-12", weight: "55 lbs", primary: "Biceps", secondary: ["Forearms"], alternative: "Machine Preacher Curl", dbId: "EZ_Bar_Preacher_Curl", gif: null },
          { name: "V-Ups", sets: "3", reps: "15", weight: "Bodyweight", primary: "Abs", secondary: ["Hip Flexors"], alternative: "Leg Raise", dbId: "V_Up", gif: null },
        ],
      },
      {
        name: "Legs",
        exercises: [
          { name: "Hack Squat", sets: "4", reps: "8-10", weight: "270 lbs", primary: "Quads", secondary: ["Glutes", "Hamstrings"], alternative: "Leg Press", dbId: "Hack_Squat", gif: null },
          { name: "Sumo Deadlift", sets: "4", reps: "6-8", weight: "225 lbs", primary: "Hamstrings", secondary: ["Glutes", "Inner Thighs", "Lower Back"], alternative: "Romanian Deadlift", dbId: "Sumo_Deadlift", gif: null },
          { name: "Bulgarian Split Squat", sets: "3", reps: "10-12/side", weight: "45 lbs", primary: "Quads", secondary: ["Glutes", "Hamstrings"], alternative: "Reverse Lunge", dbId: "Dumbbell_Bulgarian_Split_Squat", gif: null },
          { name: "Lying Leg Curl", sets: "3", reps: "12-15", weight: "90 lbs", primary: "Hamstrings", secondary: [], alternative: "Seated Leg Curl", dbId: "Lying_Leg_Curls", gif: null },
          { name: "Seated Calf Raise", sets: "4", reps: "15-20", weight: "90 lbs", primary: "Calves", secondary: [], alternative: "Standing Calf Raise", dbId: "Seated_Calf_Raise", gif: null },
          { name: "Dead Bug", sets: "3", reps: "10", weight: "Bodyweight", primary: "Core", secondary: ["Shoulders", "Lower Back"], alternative: "Bird Dog", dbId: "Dead_Bug", gif: null },
        ],
      },
      {
        name: "Push B",
        exercises: [
          { name: "Barbell Push Press", sets: "4", reps: "6-8", weight: "115 lbs", primary: "Shoulders", secondary: ["Triceps", "Upper Chest"], alternative: "Seated DB Press", dbId: "Push_Press", gif: null },
          { name: "Close-Grip Bench Press", sets: "4", reps: "8-10", weight: "135 lbs", primary: "Triceps", secondary: ["Chest", "Shoulders"], alternative: "Close-Grip Smith Press", dbId: "Close-Grip_Barbell_Bench_Press", gif: null },
          { name: "Cable Lateral Raise", sets: "3", reps: "15-20", weight: "15 lbs", primary: "Side Delts", secondary: [], alternative: "DB Lateral Raise", dbId: "Cable_Lateral_Raise", gif: null },
          { name: "Bent-Over DB Rear Delt Raise", sets: "3", reps: "15", weight: "20 lbs", primary: "Rear Delts", secondary: ["Mid-Back"], alternative: "Reverse Pec Deck", dbId: "Bent_Over_Rear_Delt_Raise", gif: null },
          { name: "Tricep Kickback", sets: "3", reps: "12", weight: "25 lbs", primary: "Triceps", secondary: [], alternative: "Cable Kickback", dbId: "Dumbbell_Tricep_Kickback", gif: null },
          { name: "Side Plank", sets: "3", reps: "45 sec/side", weight: "Bodyweight", primary: "Obliques", secondary: ["Core", "Shoulders"], alternative: "Pallof Press", dbId: "Side_Plank", gif: null },
        ],
      },
      {
        name: "Pull B",
        exercises: [
          { name: "Pendlay Row", sets: "4", reps: "5-6", weight: "145 lbs", primary: "Back", secondary: ["Lats", "Biceps", "Rear Delts"], alternative: "Barbell Row", dbId: "Pendlay_Row", gif: null },
          { name: "Chest-Supported DB Row", sets: "3", reps: "12", weight: "55 lbs", primary: "Back", secondary: ["Lats", "Rear Delts"], alternative: "Machine Row", dbId: "Incline_Dumbbell_Row", gif: null },
          { name: "Neutral Grip Lat Pulldown", sets: "3", reps: "12", weight: "120 lbs", primary: "Lats", secondary: ["Biceps", "Mid-Back"], alternative: "Wide Grip Pulldown", dbId: "Close-Grip_Front_Lat_Pulldown", gif: null },
          { name: "Cable Rope Curl", sets: "3", reps: "12-15", weight: "40 lbs", primary: "Biceps", secondary: [], alternative: "EZ Bar Curl", dbId: "Rope_Hammer_Curl", gif: null },
          { name: "Zottman Curl", sets: "3", reps: "10", weight: "30 lbs", primary: "Biceps", secondary: ["Forearms"], alternative: "Reverse Curl", dbId: "Zottman_Curl", gif: null },
          { name: "Oblique Crunch", sets: "3", reps: "20/side", weight: "Bodyweight", primary: "Obliques", secondary: ["Abs"], alternative: "Russian Twist", dbId: "Oblique_Crunch", gif: null },
        ],
      },
    ],
  },
```

- [ ] **Step 2: Start the dev server and verify the program appears**

```bash
npm run dev
```

Open the app in a browser. In the program selector dropdown, confirm **"5-Day Volume Block"** appears as the third option alongside the existing two programs.

- [ ] **Step 3: Verify all 5 days render correctly**

Click through each day tab and confirm:
- **Push A** — 6 exercises, Decline Barbell Bench Press is first
- **Pull A** — 6 exercises, Conventional Deadlift is first
- **Legs** — 6 exercises, Hack Squat is first
- **Push B** — 6 exercises, Barbell Push Press is first
- **Pull B** — 6 exercises, Pendlay Row is first

Cards with no matching `dbId` in free-exercise-db will show the 🏋️ placeholder — that is expected and fine. Confirm no JS errors in the browser console.

- [ ] **Step 4: Commit**

```bash
git add programs.js
git commit -m "Add 5-day volume block program"
```

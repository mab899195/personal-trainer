// Exercise demonstration images come from the free-exercise-db project (MIT license).
// Each entry has two frames (0.jpg = start, 1.jpg = end) that we alternate to fake motion.
const EX_IMG_BASE =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";

// To add a new program, append another object to this array — the UI is data-driven.
// Per exercise:
//   dbId       -> folder in free-exercise-db (resolves to demo images)
//   gif        -> optional local file in /assets (e.g. "assets/bench.gif").
//                 When set, it overrides the dbId frames.
//   primary    -> main muscle worked (shown as the badge)
//   secondary  -> array of assisting muscles (empty for isolation lifts)
//   alternative-> a same-muscle swap for when the station is busy
const PROGRAMS = [
  {
    id: "five-day",
    name: "5-Day Gym Program",
    days: [
      {
        name: "Push A",
        exercises: [
          { name: "Barbell Flat Bench Press", sets: "4", reps: "6-8", weight: "185 lbs", primary: "Chest", secondary: ["Shoulders", "Triceps"], alternative: "Dumbbell Bench Press", dbId: "Barbell_Bench_Press_-_Medium_Grip", gif: null },
          { name: "Standing Overhead Press", sets: "4", reps: "8-10", weight: "95 lbs", primary: "Shoulders", secondary: ["Triceps"], alternative: "Seated Dumbbell Press", dbId: "Standing_Military_Press", gif: null },
          { name: "Incline Dumbbell Press", sets: "3", reps: "10-12", weight: "60 lbs", primary: "Upper Chest", secondary: ["Shoulders", "Triceps"], alternative: "Incline Machine Press", dbId: "Incline_Dumbbell_Press", gif: null },
          { name: "Cable Tricep Pushdowns", sets: "4", reps: "12-15", weight: "60 lbs", primary: "Triceps", secondary: [], alternative: "Overhead Rope Extension", dbId: "Triceps_Pushdown", gif: null },
          { name: "Lateral Raises", sets: "3", reps: "15-20", weight: "20 lbs", primary: "Side Delts", secondary: [], alternative: "Cable Lateral Raise", dbId: "Side_Lateral_Raise", gif: null },
          { name: "Hanging Leg Raises", sets: "3", reps: "12-15", weight: "Bodyweight", primary: "Abs", secondary: ["Hip Flexors"], alternative: "Captain's Chair Leg Raise", dbId: "Hanging_Leg_Raise", gif: null },
        ],
      },
      {
        name: "Pull A",
        exercises: [
          { name: "Bent Over Barbell Rows", sets: "4", reps: "8-10", weight: "135 lbs", primary: "Back", secondary: ["Lats", "Biceps", "Rear Delts"], alternative: "Chest-Supported Row", dbId: "Bent_Over_Barbell_Row", gif: null },
          { name: "Lat Pulldowns", sets: "4", reps: "10-12", weight: "140 lbs", primary: "Lats", secondary: ["Biceps", "Mid-Back", "Rear Delts"], alternative: "Assisted Pull-Up", dbId: "Wide-Grip_Lat_Pulldown", gif: null },
          { name: "Seated Cable Rows", sets: "3", reps: "12", weight: "120 lbs", primary: "Mid-Back", secondary: ["Lats", "Biceps", "Rear Delts"], alternative: "Machine Row", dbId: "Seated_Cable_Rows", gif: null },
          { name: "Face Pulls", sets: "3", reps: "15-20", weight: "40 lbs", primary: "Rear Delts", secondary: ["Mid-Back"], alternative: "Reverse Pec Deck", dbId: "Face_Pull", gif: null },
          { name: "Standing Barbell Curls", sets: "4", reps: "10", weight: "65 lbs", primary: "Biceps", secondary: ["Forearms"], alternative: "EZ-Bar Curl", dbId: "Barbell_Curl", gif: null },
          { name: "Cable Crunches", sets: "3", reps: "15-20", weight: "60 lbs", primary: "Abs", secondary: [], alternative: "Machine Crunch", dbId: "Cable_Crunch", gif: null },
        ],
      },
      {
        name: "Legs",
        exercises: [
          { name: "Barbell Back Squats", sets: "4", reps: "6-8", weight: "225 lbs", primary: "Quads", secondary: ["Glutes", "Hamstrings", "Calves", "Lower Back"], alternative: "Hack Squat", dbId: "Barbell_Squat", gif: null },
          { name: "Romanian Deadlifts", sets: "4", reps: "8-10", weight: "185 lbs", primary: "Hamstrings", secondary: ["Glutes", "Lower Back", "Calves"], alternative: "Lying Leg Curl", dbId: "Romanian_Deadlift", gif: null },
          { name: "Leg Press", sets: "3", reps: "12-15", weight: "360 lbs", primary: "Quads", secondary: ["Glutes", "Hamstrings", "Calves"], alternative: "Goblet Squat", dbId: "Leg_Press", gif: null },
          { name: "Leg Extensions", sets: "3", reps: "15-20", weight: "110 lbs", primary: "Quads", secondary: [], alternative: "Sissy Squat", dbId: "Leg_Extensions", gif: null },
          { name: "Standing Calf Raises", sets: "4", reps: "15-20", weight: "180 lbs", primary: "Calves", secondary: [], alternative: "Seated Calf Raise", dbId: "Standing_Calf_Raises", gif: null },
          { name: "Plank", sets: "3", reps: "60 sec", weight: "Bodyweight", primary: "Core", secondary: ["Shoulders", "Glutes"], alternative: "Dead Bug", dbId: "Plank", gif: null },
        ],
      },
      {
        name: "Push B",
        exercises: [
          { name: "Incline Barbell Bench Press", sets: "4", reps: "8-10", weight: "135 lbs", primary: "Upper Chest", secondary: ["Shoulders", "Triceps"], alternative: "Incline Dumbbell Press", dbId: "Barbell_Incline_Bench_Press_-_Medium_Grip", gif: null },
          { name: "Dumbbell Shoulder Press", sets: "4", reps: "10-12", weight: "50 lbs", primary: "Shoulders", secondary: ["Triceps"], alternative: "Machine Shoulder Press", dbId: "Dumbbell_Shoulder_Press", gif: null },
          { name: "Dips", sets: "3", reps: "To Failure", weight: "Bodyweight", primary: "Chest", secondary: ["Triceps", "Shoulders"], alternative: "Assisted Dips", dbId: "Dips_-_Chest_Version", gif: null },
          { name: "Cable Flyes", sets: "3", reps: "15", weight: "30 lbs", primary: "Chest", secondary: [], alternative: "Pec Deck", dbId: "Flat_Bench_Cable_Flyes", gif: null },
          { name: "Overhead Dumbbell Extension", sets: "3", reps: "12", weight: "55 lbs", primary: "Triceps", secondary: [], alternative: "Rope Overhead Extension", dbId: "Standing_Dumbbell_Triceps_Extension", gif: null },
          { name: "Ab Wheel Rollouts", sets: "3", reps: "10-12", weight: "Bodyweight", primary: "Abs", secondary: ["Shoulders", "Lower Back"], alternative: "Cable Crunch", dbId: "Ab_Roller", gif: null },
        ],
      },
      {
        name: "Pull B",
        exercises: [
          { name: "Pull-Ups", sets: "4", reps: "To Failure", weight: "Bodyweight", primary: "Lats", secondary: ["Biceps", "Mid-Back"], alternative: "Lat Pulldown", dbId: "Pullups", gif: null },
          { name: "Single Arm Dumbbell Row", sets: "4", reps: "10-12", weight: "60 lbs", primary: "Back", secondary: ["Lats", "Biceps", "Rear Delts"], alternative: "Seated Cable Row", dbId: "One-Arm_Dumbbell_Row", gif: null },
          { name: "Straight Arm Lat Pulldowns", sets: "3", reps: "15", weight: "50 lbs", primary: "Lats", secondary: [], alternative: "Dumbbell Pullover", dbId: "Straight-Arm_Pulldown", gif: null },
          { name: "Dumbbell Shrugs", sets: "3", reps: "15", weight: "70 lbs", primary: "Traps", secondary: [], alternative: "Barbell Shrug", dbId: "Dumbbell_Shrug", gif: null },
          { name: "Dumbbell Hammer Curls", sets: "4", reps: "12", weight: "35 lbs", primary: "Biceps", secondary: ["Forearms"], alternative: "Cable Hammer Curls", dbId: "Hammer_Curls", gif: null },
          { name: "Bicycle Crunches", sets: "3", reps: "20 / side", weight: "Bodyweight", primary: "Abs", secondary: ["Obliques"], alternative: "Russian Twist", dbId: "Air_Bike", gif: null },
        ],
      },
    ],
  },
  {
    id: "five-day-cut",
    name: "5-Day Cut Program",
    days: [
      {
        name: "Push A",
        exercises: [
          { name: "Barbell Flat Bench Press", sets: "4", reps: "6-8", weight: "165 lbs", primary: "Chest", secondary: ["Shoulders", "Triceps"], alternative: "Dumbbell Bench Press", dbId: "Barbell_Bench_Press_-_Medium_Grip", gif: null },
          { name: "Standing Overhead Press", sets: "4", reps: "8-10", weight: "85 lbs", primary: "Shoulders", secondary: ["Triceps"], alternative: "Seated Dumbbell Press", dbId: "Standing_Military_Press", gif: null },
          { name: "Incline Dumbbell Press", sets: "3", reps: "10-12", weight: "55 lbs", primary: "Upper Chest", secondary: ["Shoulders", "Triceps"], alternative: "Incline Machine Press", dbId: "Incline_Dumbbell_Press", gif: null },
          { name: "Cable Tricep Pushdowns", sets: "4", reps: "12-15", weight: "55 lbs", primary: "Triceps", secondary: [], alternative: "Overhead Rope Extension", dbId: "Triceps_Pushdown", gif: null },
          { name: "Arnold Press", sets: "3", reps: "15-20", weight: "30 lbs", primary: "Shoulders", secondary: ["Triceps", "Upper Chest"], alternative: "Dumbbell Lateral Raise", dbId: "Arnold_Dumbbell_Press", gif: null },
          { name: "Mountain Climbers", sets: "3", reps: "12-15", weight: "Bodyweight", primary: "Abs", secondary: ["Hip Flexors", "Quads", "Shoulders"], alternative: "High Knees", dbId: "Mountain_Climbers", gif: null },
        ],
      },
      {
        name: "Pull A",
        exercises: [
          { name: "Bent Over Barbell Rows", sets: "4", reps: "8-10", weight: "120 lbs", primary: "Back", secondary: ["Lats", "Biceps", "Rear Delts"], alternative: "Chest-Supported Row", dbId: "Bent_Over_Barbell_Row", gif: null },
          { name: "Lat Pulldowns", sets: "4", reps: "10-12", weight: "125 lbs", primary: "Lats", secondary: ["Biceps", "Mid-Back", "Rear Delts"], alternative: "Assisted Pull-Up", dbId: "Wide-Grip_Lat_Pulldown", gif: null },
          { name: "Seated Cable Rows", sets: "3", reps: "12", weight: "105 lbs", primary: "Mid-Back", secondary: ["Lats", "Biceps", "Rear Delts"], alternative: "Machine Row", dbId: "Seated_Cable_Rows", gif: null },
          { name: "Face Pulls", sets: "3", reps: "15-20", weight: "35 lbs", primary: "Rear Delts", secondary: ["Mid-Back"], alternative: "Reverse Pec Deck", dbId: "Face_Pull", gif: null },
          { name: "Incline Dumbbell Curls", sets: "4", reps: "10", weight: "25 lbs", primary: "Biceps", secondary: ["Forearms"], alternative: "Cable Curl", dbId: "Incline_Dumbbell_Curl", gif: null },
          { name: "Russian Twists", sets: "3", reps: "15-20", weight: "25 lbs", primary: "Abs", secondary: ["Obliques"], alternative: "Bicycle Crunches", dbId: "Russian_Twist", gif: null },
        ],
      },
      {
        name: "Legs",
        exercises: [
          { name: "Barbell Back Squats", sets: "4", reps: "6-8", weight: "205 lbs", primary: "Quads", secondary: ["Glutes", "Hamstrings", "Calves", "Lower Back"], alternative: "Hack Squat", dbId: "Barbell_Squat", gif: null },
          { name: "Romanian Deadlifts", sets: "4", reps: "8-10", weight: "165 lbs", primary: "Hamstrings", secondary: ["Glutes", "Lower Back", "Calves"], alternative: "Lying Leg Curl", dbId: "Romanian_Deadlift", gif: null },
          { name: "Leg Press", sets: "3", reps: "12-15", weight: "320 lbs", primary: "Quads", secondary: ["Glutes", "Hamstrings", "Calves"], alternative: "Goblet Squat", dbId: "Leg_Press", gif: null },
          { name: "Dumbbell Lunges", sets: "3", reps: "15-20", weight: "35 lbs ea.", primary: "Quads", secondary: ["Glutes", "Hamstrings", "Calves"], alternative: "Bulgarian Split Squat", dbId: "Dumbbell_Lunges", gif: null },
          { name: "Standing Calf Raises", sets: "4", reps: "15-20", weight: "160 lbs", primary: "Calves", secondary: [], alternative: "Seated Calf Raise", dbId: "Standing_Calf_Raises", gif: null },
          { name: "Split Jumps", sets: "3", reps: "12-15", weight: "Bodyweight", primary: "Quads", secondary: ["Glutes", "Calves", "Hip Flexors"], alternative: "Box Jump", dbId: "Split_Jump", gif: null },
        ],
      },
      {
        name: "Push B",
        exercises: [
          { name: "Incline Barbell Bench Press", sets: "4", reps: "8-10", weight: "120 lbs", primary: "Upper Chest", secondary: ["Shoulders", "Triceps"], alternative: "Incline Dumbbell Press", dbId: "Barbell_Incline_Bench_Press_-_Medium_Grip", gif: null },
          { name: "Dumbbell Shoulder Press", sets: "4", reps: "10-12", weight: "45 lbs", primary: "Shoulders", secondary: ["Triceps"], alternative: "Machine Shoulder Press", dbId: "Dumbbell_Shoulder_Press", gif: null },
          { name: "Dips", sets: "3", reps: "To Failure", weight: "Bodyweight", primary: "Chest", secondary: ["Triceps", "Shoulders"], alternative: "Assisted Dips", dbId: "Dips_-_Chest_Version", gif: null },
          { name: "Dumbbell Pullover", sets: "3", reps: "15", weight: "45 lbs", primary: "Chest", secondary: ["Lats", "Serratus"], alternative: "Cable Pullover", dbId: "Bent-Arm_Dumbbell_Pullover", gif: null },
          { name: "Overhead Dumbbell Extension", sets: "3", reps: "12", weight: "50 lbs", primary: "Triceps", secondary: [], alternative: "Rope Overhead Extension", dbId: "Standing_Dumbbell_Triceps_Extension", gif: null },
          { name: "Jackknife Sit-Ups", sets: "3", reps: "10-12", weight: "Bodyweight", primary: "Abs", secondary: ["Hip Flexors"], alternative: "V-Up", dbId: "Jackknife_Sit-Up", gif: null },
        ],
      },
      {
        name: "Pull B",
        exercises: [
          { name: "Pull-Ups", sets: "4", reps: "To Failure", weight: "Bodyweight", primary: "Lats", secondary: ["Biceps", "Mid-Back"], alternative: "Lat Pulldown", dbId: "Pullups", gif: null },
          { name: "Single Arm Dumbbell Row", sets: "4", reps: "10-12", weight: "55 lbs", primary: "Back", secondary: ["Lats", "Biceps", "Rear Delts"], alternative: "Seated Cable Row", dbId: "One-Arm_Dumbbell_Row", gif: null },
          { name: "Straight Arm Lat Pulldowns", sets: "3", reps: "15", weight: "45 lbs", primary: "Lats", secondary: [], alternative: "Dumbbell Pullover", dbId: "Straight-Arm_Pulldown", gif: null },
          { name: "Barbell Upright Rows", sets: "3", reps: "15", weight: "65 lbs", primary: "Traps", secondary: ["Shoulders", "Biceps"], alternative: "Dumbbell Shrug", dbId: "Upright_Barbell_Row", gif: null },
          { name: "Dumbbell Hammer Curls", sets: "4", reps: "12", weight: "30 lbs", primary: "Biceps", secondary: ["Forearms"], alternative: "Cable Hammer Curls", dbId: "Hammer_Curls", gif: null },
          { name: "Reverse Crunches", sets: "3", reps: "20", weight: "Bodyweight", primary: "Abs", secondary: ["Hip Flexors"], alternative: "Hanging Knee Raise", dbId: "Reverse_Crunch", gif: null },
        ],
      },
    ],
  },
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
];

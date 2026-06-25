# 5-Day Volume Block Program — Design Spec

**Date:** 2026-06-24  
**Type:** New program entry in `programs.js`

## Overview

A hypertrophy-focused 5-day Push/Pull/Legs/Push/Pull program. Every exercise is distinct from the existing "5-Day Gym Program" and "5-Day Cut Program". Each day leads with a heavy compound lift not used in either existing program, followed by accessories targeting volume and isolation.

## Program ID & Name

- `id`: `"five-day-volume"`
- `name`: `"5-Day Volume Block"`

## Split Structure

| Day | Focus | Lead Compound |
|---|---|---|
| Push A | Chest primary | Decline Barbell Bench Press |
| Pull A | Back primary | Conventional Deadlift |
| Legs | Quads primary | Hack Squat |
| Push B | Shoulders primary | Barbell Push Press |
| Pull B | Back/Biceps | Pendlay Row |

## Exercises by Day

### Push A
| Exercise | Sets | Reps | Weight | Primary | Secondary | Alternative |
|---|---|---|---|---|---|---|
| Decline Barbell Bench Press | 4 | 6-8 | 155 lbs | Chest | Triceps, Shoulders | Decline DB Press |
| Pec Deck Machine Fly | 3 | 12-15 | 100 lbs | Chest | — | Cable Crossover |
| EZ Bar Skull Crushers | 3 | 10-12 | 65 lbs | Triceps | — | Overhead Cable Extension |
| Machine Lateral Raise | 3 | 15-20 | 60 lbs | Side Delts | — | Cable Lateral Raise |
| Smith Machine Overhead Press | 3 | 10-12 | 95 lbs | Shoulders | Triceps | DB Shoulder Press |
| Weighted Decline Sit-Up | 3 | 15-20 | 25 lbs | Abs | Hip Flexors | Crunch |

### Pull A
| Exercise | Sets | Reps | Weight | Primary | Secondary | Alternative |
|---|---|---|---|---|---|---|
| Conventional Deadlift | 4 | 4-6 | 275 lbs | Back | Hamstrings, Glutes, Traps | Trap Bar Deadlift |
| T-Bar Row | 4 | 8-10 | 135 lbs | Back | Lats, Biceps, Rear Delts | Chest-Supported Row |
| Reverse Grip Lat Pulldown | 3 | 12 | 120 lbs | Lats | Biceps, Mid-Back | Neutral Grip Pulldown |
| Cable Rear Delt Fly | 3 | 15 | 20 lbs | Rear Delts | Mid-Back | Reverse Pec Deck |
| EZ Bar Preacher Curl | 4 | 10-12 | 55 lbs | Biceps | Forearms | Machine Preacher Curl |
| V-Ups | 3 | 15 | Bodyweight | Abs | Hip Flexors | Leg Raise |

### Legs
| Exercise | Sets | Reps | Weight | Primary | Secondary | Alternative |
|---|---|---|---|---|---|---|
| Hack Squat | 4 | 8-10 | 270 lbs | Quads | Glutes, Hamstrings | Leg Press |
| Sumo Deadlift | 4 | 6-8 | 225 lbs | Hamstrings | Glutes, Inner Thighs, Lower Back | Romanian Deadlift |
| Bulgarian Split Squat | 3 | 10-12/side | 45 lbs | Quads | Glutes, Hamstrings | Reverse Lunge |
| Lying Leg Curl | 3 | 12-15 | 90 lbs | Hamstrings | — | Seated Leg Curl |
| Seated Calf Raise | 4 | 15-20 | 90 lbs | Calves | — | Standing Calf Raise |
| Dead Bug | 3 | 10 | Bodyweight | Core | Shoulders, Lower Back | Bird Dog |

### Push B
| Exercise | Sets | Reps | Weight | Primary | Secondary | Alternative |
|---|---|---|---|---|---|---|
| Barbell Push Press | 4 | 6-8 | 115 lbs | Shoulders | Triceps, Upper Chest | Seated DB Press |
| Close-Grip Bench Press | 4 | 8-10 | 135 lbs | Triceps | Chest, Shoulders | Close-Grip Smith Press |
| Cable Lateral Raise | 3 | 15-20 | 15 lbs | Side Delts | — | DB Lateral Raise |
| Bent-Over DB Rear Delt Raise | 3 | 15 | 20 lbs | Rear Delts | Mid-Back | Reverse Pec Deck |
| Tricep Kickback | 3 | 12 | 25 lbs | Triceps | — | Cable Kickback |
| Side Plank | 3 | 45 sec/side | Bodyweight | Obliques | Core, Shoulders | Pallof Press |

### Pull B
| Exercise | Sets | Reps | Weight | Primary | Secondary | Alternative |
|---|---|---|---|---|---|---|
| Pendlay Row | 4 | 5-6 | 145 lbs | Back | Lats, Biceps, Rear Delts | Barbell Row |
| Chest-Supported DB Row | 3 | 12 | 55 lbs | Back | Lats, Rear Delts | Machine Row |
| Neutral Grip Lat Pulldown | 3 | 12 | 120 lbs | Lats | Biceps, Mid-Back | Wide Grip Pulldown |
| Cable Rope Curl | 3 | 12-15 | 40 lbs | Biceps | — | EZ Bar Curl |
| Zottman Curl | 3 | 10 | 30 lbs | Biceps | Forearms | Reverse Curl |
| Oblique Crunch | 3 | 20/side | Bodyweight | Obliques | Abs | Russian Twist |

## Implementation

Single change: append a new object to the `PROGRAMS` array in `programs.js`. Each exercise needs a `dbId` resolved from the [free-exercise-db](https://github.com/yuhonas/free-exercise-db) for demo images. Where no matching `dbId` exists, set `gif: null` and leave `dbId` as a close match or empty string.

No UI changes required — the app is fully data-driven.

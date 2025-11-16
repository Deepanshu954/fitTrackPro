# FitTrack Pro - Vanilla JS Edition

A modern fitness tracking dashboard built with pure HTML, CSS, and JavaScript (ES6+).

## Features

- **Dashboard**: Live clock, wellness metrics with animated progress circles
- **Activities**: Track workouts with filtering by time of day
- **Meals**: Plan daily meals organized by breakfast, lunch, and dinner
- **Insights**: Weekly activity charts and data summary with download/reset options
- **Goals**: Set daily goals and log/edit steps, calories burned, and water intake

## Technical Stack

- HTML5
- CSS3 (Custom design system, animations, responsive)
- Vanilla JavaScript (ES6+)
- LocalStorage for data persistence

## File Structure

```
fitTrackPro/
├── index.html
├── README.md
├── css/
│   └── styles.css
├── js/
│   ├── activities.js
│   ├── dashboard.js
│   ├── goals.js
│   ├── insights.js
│   ├── meals.js
│   ├── overlays.js
│   ├── storage.js
│   └── theme.js
└── pages/
    ├── activities.html
    ├── goals.html
    ├── insights.html
    └── meals.html
```

## Usage

1. Open `index.html` in any modern web browser
2. No build process or server required
3. Works entirely offline after initial load
4. Data persists in browser localStorage

## Features Breakdown

### Progress Circles
Animated SVG circles showing:
- Steps taken (goal configurable)
- Calories burned (goal configurable)
- Water intake (goal configurable)

### Goals & Daily Logs
- Set daily goals for steps, calories, and water
- Add, edit, and delete daily logs for each category
- Sync logs to dashboard wellness metrics

### Activity Tracking
- Add activities with name, duration, calories
- Filter by morning/afternoon/evening
- Delete activities
- Form validation

### Meal Planning
- Organized by meal type
- Add/remove meals dynamically
- Calorie tracking per meal and total
- Custom modal forms

### Insights
- Bar chart visualizations (pure CSS/JS)
- Weekly activity and calorie trends
- Download data as JSON
- Reset all data option

## Browser Compatibility

Works in all modern browsers supporting:
- ES6 JavaScript
- CSS Grid & Flexbox
- LocalStorage API

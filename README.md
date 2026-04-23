# Election Process Assistant 🗳️

A production-ready "Election Process Assistant" web app for a global civic-tech challenge. Designed as a smart, orange-themed civic guide to simplify voting processes for everyone.

## Vertical
**Civic Tech**
Empowering citizens through accessible, intuitive, and modern technology.

## Approach
**Logic-Driven**
The application avoids heavy natural language processing backends in favor of a fast, local **Smart Intent Engine** that runs purely in the browser. It intelligently routes user inputs (e.g. eligibility checks, steps to vote, timelines, and interactive quizzes) to deliver immediate, contextual responses.

## How it works
The `app.js` features an Intent Mapping engine:
- User types (or speaks via the Web Speech API) a query.
- `getIntent(text)` uses regex and keyword matching to determine the user's need.
- Context-aware logic checks age inputs (`< 18` = Ineligible, `>= 18` = Triggers animated Registration Checklist).
- Users can visualize the election stages using a Chart.js-powered interactive timeline.
- A "Find Polling Station" button directly integrates with Google Maps Search queries.
- A mock Google Sheets API fetches "local dates" synchronously for quick feedback.
- A built-in Quiz Mode tests civic knowledge and tracks scores.

## Assumptions & Constraints
- **Size constraint**: The entire application is well under 1MB (Total size ~10KB).
- **Frameworkless**: Written in pure Vanilla JS and CSS for maximum performance and portability.
- **Dependencies**: Only relies on the `Chart.js` CDN for data visualization.
- **Accessibility**: Includes a High-Contrast mode toggle, Voice Input capability, and semantic ARIA labels across the interface.

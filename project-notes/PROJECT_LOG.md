# Project log

Keep this up to date as you go — a few lines per work session is enough. It's much harder to reconstruct at the end.

**Team name:**
**Startup name:** Sprout
**Live site link:**

---

## Work sessions

Copy this block for each session.

### Session — 2026-11-02 — driver: not recorded

- **Goal for this session:** Turn the generic starter site into a plant-watering and sitter-marketplace prototype.
- **Key prompts we gave Copilot** (paste the important ones):
  1. Build an app to remember when to water plants, add and remove plants, and prioritize watering; advise on ads versus a plant-sitter feature.
  2. Implement the working plant dashboard and a clearly demo-only sitter marketplace.
- **What worked:** Plant cards sort by due date, watering updates the schedule, plant changes persist in this browser, and the business model advice is visible in the app.
- **What broke, and how we fixed it:** No errors found in the edited files; manual browser verification remains.
- **Committed?** no — commit message: not applicable

### Session — 2026-11-02 — driver: not recorded

- **Goal for this session:** Add more useful plant-care tools beyond the basic watering dashboard.
- **Key prompts we gave Copilot** (paste the important ones):
  1. Add care history, reminders, filters, and plant details to make the app more useful.
  2. Add searchable watering filters, editable care details, and a per-plant watering journal.
- **What worked:** Plant collections can be searched and filtered by urgency; plant schedules and notes can be edited; watering dates are kept in a local care journal.
- **What broke, and how we fixed it:** Browser automation was unavailable. Fixed hidden-state styling and reset filters when adding a plant so new plants remain visible.
- **Committed?** no — commit message: not applicable

### Session — [date] — driver: [first name]

- **Goal for this session:**
- **Key prompts we gave Copilot** (paste the important ones):
  1.
  2.
- **What worked:**
- **What broke, and how we fixed it:**
- **Committed?** yes / no — commit message:

---

## Things that broke (running list)

| Date | What went wrong | What we tried | What finally fixed it |
|---|---|---|---|
| | | | |

## What a real version would need

Everything we wanted but faked or left out — real logins, a real database, payments, security, moderation, an app, staff, etc. For each one, say **why** it's needed and roughly **how hard or expensive** you think it would be.

| Feature we faked or skipped | Why a real company would need it | How hard / expensive? |
|---|---|---|
| Push notifications and accounts | Reminders should reach users away from the open website, and accounts would sync plant data across devices. | Medium; needs a backend, secure accounts, notification permissions, and ongoing operations. |
| Plant-sitter booking and payments | Profiles and booking requests are demo-only; a real service needs reliable scheduling, payment handling, and dispute support. | High; requires payment-provider integration, customer support, and local marketplace operations. |
| Sitter identity and safety checks | Users need confidence before letting a sitter into their home. | High; requires a verification process, privacy controls, and clear safety policies. |
| | | |

## Reflection (fill in at the end)

1. What surprised you most about building software with AI?
2. Which parts were easy, and which were hard? Why do you think that is?
3. If a competitor had the same AI tool, how long would it take them to copy your site?

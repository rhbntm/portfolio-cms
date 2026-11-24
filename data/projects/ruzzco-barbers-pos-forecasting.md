---
id: 7
title: "Ruzzco Barbers POS & Forecasting"
slug: "ruzzco-barbers-pos-forecasting"
summary: "Capstone project: an offline-first point-of-sale and customer-count forecast for a Caloocan barbershop. I led a five-member team."
tech_stack:
  - "Next.js 16, React 19, TypeScript, Prisma, MySQL, Dexie (IndexedDB), FastAPI, scikit-learn, Docker"
image_url: "https://raw.githubusercontent.com/rhbntm/portfolio-cms/main/data/images/projects/1795448707205-Ruzzco-dashboard.png"
github_url: "https://github.com/rhbntm/ruzzco-system"
live_url: null
sort_order: 1
created_at: "2026-11-23T15:45:26.972518+00:00"
updated_at: "2026-11-23T15:45:26.972518+00:00"
---

My BSIT capstone at Systems Plus Computer College: a point-of-sale and sales forecast for Ruzzco Barbers in Caloocan. I'm the lead developer on a five-member team.


## The problem

The shop records sales in paper logbooks. That makes it hard to credit each sale to the right barber, settle commissions, count the drawer at day's end, or plan ahead.


## What I built

- Offline-first POS: barbers record sales on assigned phones. Sales are saved on the phone first (IndexedDB) and sent to the server when the connection returns. Each sale is validated on its own, so one bad sale never blocks the rest, and retries never create duplicates.
- Money handling: every sale is attributed to the barber assigned to that phone at the time of sale, and commissions are saved with the sale. There is an end-of-day cash reconciliation and a barber payout ledger, plus an owner dashboard. PayMongo QR payments run in test mode with safeguards against charging a sale twice.
- Forecasting: a FastAPI and scikit-learn service predicts daily customer counts from digitized logbook records, and revenue is derived from that.


## The key decision: fix attribution at sale time

Phones can be reassigned between barbers. Tying each sale to its assignment, not to whoever holds the phone now, means a reassignment can never rewrite past commissions.


## Forecasting result

I compared Random Forest with simple baselines over four held-out weeks (Oct 2–29, 2026). Random Forest averaged 5.2 customers/day of error. The simple average scored 5.2, a weekday average 4.7, and a naive baseline 4.4. With only about a month of test data, the simple baselines were as good or better, so I report that and don't claim the model wins.

## What I'd change

- Gather requirements more thoroughly. I moved into building before I fully understood how the shop actually runs.
- Show the client working software every sprint. Our paper uses an incremental, iterative SDLC, but iteration without periodic client feedback is just a series of builds. I should have demoed updates regularly and acted on what the owner said.
- Say so when something isn't right. I knew the v1 front-end design wasn't up to standard. I kept it so the effort behind it wouldn't be wasted, and it became the biggest critique of our system design. Being non-confrontational cost the project more than an honest conversation would have. Next time I raise the issue early, even when it's uncomfortable.

---
id: 1
title: "JR Inventory Management System"
slug: "jr-inventory-management-system"
summary: "A stock and pricing system I built for my friend's ukay (secondhand clothing) live-selling business. The owner used it on his phone to count and price incoming"
tech_stack:
  - "Next.js 16"
  - "React 19"
  - "TypeScript"
  - "Prisma"
  - "PostgreSQL"
  - "Next-Auth v4"
image_url: "https://raw.githubusercontent.com/rhbntm/portfolio-cms/main/data/images/projects/1780483599821-Screenshot_2026-06-03_184323.png"
github_url: "https://github.com/rhbntm/jr-inventory"
live_url: null
sort_order: 1
created_at: "2026-04-21T09:53:25.580509+00:00"
updated_at: "2026-04-21T09:53:25.580509+00:00"
---

A stock and pricing system I built for my friend's ukay (secondhand clothing) live-selling business. The owner used it on his phone to count and price incoming batches.

## The problem

In November 2025 my friend started live selling, with him hosting on camera and me running the backstage as admin. Everything ran on paper: when a buyer commented "mine" on an item, I wrote their name on paper tape, stuck it on the item, and screenshotted the comment as proof.

Paper kept up during the live, but not after it. Matching claims to checkouts took 15–30 minutes, and how much stock was left was a guess. New batches were worse: supplier counts are only estimates, so every batch was tallied in a notebook and each item was priced by hand with the owner's formula.

## What I built

- **v1 (Laravel + Filament, Nov 2025):** built during a one-week exam break and in use by day 3, on a laptop.
- **v2 (Next.js, Prisma, PostgreSQL, Docker on a VPS):** a phone-first rebuild. To count a batch, the owner picks up each item, checks it for damage and price tier, and taps +1 (or +1 "damaged"). When the batch is counted, the system applies his pricing formula to every item.

## The key decision: phone-first

The owner wasn't using v1. His laptop was slow and he isn't technical, so instead of adding features, I moved the system onto the device he already used every day. That change is what got him using it.

## Result

Batch counting replaced the notebook, and pricing went from hand calculation to automatic. After-live reconciliation got faster too, though most of the value came from batch intake.

The system is no longer in daily use. The business moved from ukay to regular stock and stopped live selling, so the workflow it was built around went away.

## What I'd change

- **Find the cause before rewriting.** v1's slow page loads came from my own development setup, not from Laravel. Next time I'd profile first.
- **Design around the real user from day one,** not after he stops using it.
- **Expect the process to change.** The system encoded one workflow, grading secondhand items, and stopped fitting when the business did.

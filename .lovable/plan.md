

## Add Predictive Signal Strength to Genome Sub-Pages

Enhance the signal cards on each Genome category sub-page (starting with "Executive Access & Recognition") to show how predictive each signal is for identifying future VP+ leaders, based on analysis of 62 Accelerate-tier candidates.

---

### What Changes

**1. New data field: `predictiveStrength`**

Each behavior/signal in `SignalCategoryPage.tsx` gets a new numeric field representing the percentage of Accelerate-tier candidates who show that signal. This drives a HIGH / MED / LOW label:

- HIGH: 70%+ (appears in most future VP+ leaders)
- MED: 40-69% (meaningful but not universal)
- LOW: under 40% (present but less common)

Example for Executive Access & Recognition:

| Signal | Predictive % | Level |
|---|---|---|
| CEO/C-Suite Direct Access | 95% | HIGH |
| SVP Recognition + Global Scope | 97% | HIGH |
| Multiple VP Sources | 85% | HIGH |
| Senior Leadership Visit Hosting | 68% | MED |
| CFO + Vision Alignment | 69% | MED |
| Regional President Access | 60% | MED |

**2. Redesigned signal cards**

Each card gets a visual predictive strength indicator integrated into the existing card aesthetic:

- **Top-right corner**: A small strength ring (reusing the existing `StrengthRing` component) showing the predictive percentage, colored by the category brand color
- **Below the signal icon**: A strength pill badge showing "High Predictive", "Medium Predictive", or "Low Predictive" with color-coded styling (green/amber/slate)
- **Micro-bar visual**: A 5-bar ascending histogram (matching the established data visualization pattern) replaces the plain insight section, with the semantic label (Strong/Medium/Low) beside it

The card layout stays the same: icon top-left, title, description, then a refined bottom section showing the predictive indicator with a one-line contextual sentence like "Appears in 95% of future VP+ leaders".

**3. Section header context**

Above the signal cards grid, add a subtle explanatory line:

> "Predictive strength shows how often each signal appears in leaders who advanced to VP+"

Styled as `text-[11px] uppercase tracking-widest text-muted-foreground` matching existing label patterns.

---

### Visual Card Layout (Revised)

```text
+------------------------------------------+
|  [Signal Icon]          [StrengthRing 95] |
|                                           |
|  CEO/C-Suite Direct Access                |
|  Direct recognition and visibility...     |
|                                           |
|  ┌─ High Predictive ─┐                   |
|  │  ▁ ▂ ▃ ▅ █        │  Strong           |
|  └────────────────────┘                   |
|  Appears in 95% of future VP+ leaders    |
+------------------------------------------+
```

---

### Technical Details

**File: `src/components/dashboard/SignalCategoryPage.tsx`**

1. Add `predictiveStrength: number` to the `Behavior` interface
2. Populate `predictiveStrength` values for all signals across all 6 categories using the PDF data (mapped from the Genome taxonomy to the existing signal names)
3. Update the card rendering in the `TabsContent value="overview"` section to include:
   - The `StrengthRing` component (imported from `./StrengthRing`) in the top-right corner
   - A predictive level pill badge below the icon
   - The micro-bar visual in the bottom section with the percentage context line
4. Add the helper function `getPredictiveLevel(pct: number)` returning `{ label, color, bgColor }`

**No new files or dependencies needed** -- reuses existing `StrengthRing` and micro-bar patterns already in the codebase.


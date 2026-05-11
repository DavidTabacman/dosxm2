# V4 Live Portraits — Problem definition (debugging brief)

**Status:** Unresolved · **Last update:** 2026-05-11 · **Live URL:** `/v4`
**Linked artefacts:** [BRD](v4_live_portraits.md) · [Plan](../.claude/plans/create-a-detailed-plan-sequential-wilkes.md)

---

## 1. What we were asked to build

In the El Diferencial strip of the `/v4` page, the two founder portraits should appear **alive** — quietly breathing, with constant subtle motion. The intent is editorial / cinemagraph-style ambient motion (not a full video, not a hover trick). The viewer should feel the photographs are present, not freeze-frame.

Stakeholder language: *"I want the pictures of the founder move a little constantly, making the effect like the pictures are live."*

## 2. The visible bug

Despite three implementation passes (see §6) and confirmed-correct DevTools telemetry, **the user does not perceive any motion on the portraits** when looking at the live site. The only motion they see is the existing hover lift on the photo card (`.portraitFrame` translates up by 4px on `:hover`).

User report verbatim: *"I still don't see any effect, only the box moving when mouse over."*

## 3. Technical status — every layer reports healthy

Diagnostic console logs were added to [V4Diferencial.tsx](../src/components/v4/V4Diferencial.tsx) in commit `6e20349`. They run on every mount, snapshot the CSS/DOM/animation state, and then sample computed `transform` matrices every 1s for 10 ticks. On the latest deploy (`a8392ed`) the logs report:

| Check | Result |
|---|---|
| Browser | Chrome 148 (Windows 10, 1280×551) |
| `prefers-reduced-motion` | `false` |
| `CSS.supports('animation-timeline: view()')` | `true` |
| Mobile breakpoint active (≤600px) | `false` |
| CSS module class resolved (`styles.portraitBreath`) | `V4Diferencial-module__L29-0W__portraitBreath` |
| `.portraitBreath` elements in DOM | `2` (one per founder) |
| Wrapper offset size | `253 × 337 px` |
| `animation-name` resolved | `…__v4PortraitBreath` and `…__v4PortraitBreathAlt` |
| `animation-duration` | `8s` |
| `animation-delay` | `0s` / `-4s` (opposing phase) |
| `animation-iteration-count` | `infinite` |
| `animation-play-state` | `running` |
| `will-change` | `transform` |
| `getAnimations().length` | `1` per wrapper |
| `transform` matrix sample at peak (wrapper A) | `matrix(1.1, 0, 0, 1.1, 8.35, 7.42)` — scale 1.10 + translate (+8.35px, +7.42px) |
| Same at trough | `matrix(1, 0, 0, 1, -7.59, -6.75)` — scale 1.0 + translate (-7.6px, -6.7px) |

**Conclusion: the animation is running, hitting its full keyframe range, and applying the correct transforms to the correct DOM elements every frame.**

The displacement is real, not theoretical — the matrix values are advancing through the entire designed range, ~3 px/sec average drift, ~25px peak scale-delta on a 253px-wide frame.

## 4. Where the gap is

The motion happens on `.portraitBreath`, which is a `position: absolute; inset: 0` wrapper **inside** the `.portraitFrame`. The frame has `overflow: hidden`. So the visual result of the breath transform is:

- The **image content** inside the frame slides and zooms (~8px shift, 10% scale) every cycle.
- The **frame itself** (with its drop shadow, border-radius, gradient overlay, and "BORJA / PABLO" name tag) **does not move at all**.

The user's eye treats the frame as the "thing on the page" — a static photograph card. The motion within the frame is content drift behind a static aperture. Apparently, **at this amplitude and within a clipped frame, the motion is not being read as the card being "alive"** — only as imperceptible content shifting (or, given the user's report, as fully invisible).

The hover transform that the user *can* see (`translateY(-4px)`) is applied to the **frame itself** — the whole card lifts. That kind of "the whole thing moves" motion is exactly what the user is reading as "the box moving."

## 5. Implementation architecture (for an outside reader)

### File layout

```
src/components/v4/
├── V4Diferencial.tsx                  # JSX + diagnostic useEffect
├── V4Diferencial.module.css           # all V4-section-local styles
└── v4-animations.module.css           # SHARED entrance utilities (reveal/stagger)
                                       #   ⚠ keyframes here would leak to FAB portraits
src/__tests__/v4/
├── V4Diferencial.test.tsx             # render-time DOM tests
├── V4LivePortraits.css.test.ts        # CSS-source assertions for breath
├── V4Page.test.tsx                    # integration test for detach flow
└── v4-breakpoints.test.ts             # enforces allowed breakpoints {400,600,768,769,1024}
```

### Current DOM structure (relevant fragment)

```
.portraits                            ← grid container (2 columns)
└─ .portraitFrame                     ← position: relative; overflow: hidden;
                                        aspect-ratio: 3/4; box-shadow;
                                        :hover → translateY(-4px)   ← USER CAN SEE THIS
   ├─ .portraitBreath                 ← position: absolute; inset: 0;
   │                                    animation: v4PortraitBreath 8s infinite alternate;
   │                                    will-change: transform        ← USER CAN'T SEE THIS
   │  └─ <img class="portrait" />     ← width:100%; height:100%; object-fit: cover;
   │                                    OWN animation: scroll-driven Ken Burns
   │                                    (animation-timeline: view())
   ├─ <span class="portraitName" />   ← "BORJA" / "PABLO" caption (static)
   └─ ::after                          ← gradient overlay (static)
```

### CSS used for breath (current values, commit `a8392ed`)

```css
.portraitBreath {
  position: absolute;
  inset: 0;
  will-change: transform;
  animation: v4PortraitBreath 8s ease-in-out infinite alternate;
}
.portraitFrame:nth-of-type(2) .portraitBreath {
  animation-name: v4PortraitBreathAlt;
  animation-delay: -4s;   /* half-period offset → opposing phases */
}

@keyframes v4PortraitBreath {
  from { transform: scale(1)    translate3d(-3%, -2%, 0); }
  to   { transform: scale(1.10) translate3d( 3%,  2%, 0); }
}
@keyframes v4PortraitBreathAlt {
  from { transform: scale(1.10) translate3d( 3%, -2%, 0); }
  to   { transform: scale(1)    translate3d(-3%,  2%, 0); }
}
/* mobile @media (max-width: 600px) → half amplitudes */
/* prefers-reduced-motion: reduce → kills the animation + clears will-change */
```

### Concurrent animations on the inner `<img>`

The inner `.portrait` (the `<img>` itself) **also** carries its own animation:
- Fallback browsers: ambient Ken Burns (scale 1.02→1.12, translate ~±2%, 8s alternate).
- Modern browsers (this user, Chrome 148): **scroll-driven** `v4PortraitScroll` via `animation-timeline: view()` and `animation-range: cover 0% cover 100%`. At idle (no scrolling), this freezes the img at an interpolated state (~scale 1.07, translate 0) — so at the moment the user is looking, the img itself is static and only the wrapper around it is animating.

Transforms compose multiplicatively: total visible scale = wrapper × img = up to `1.10 × 1.07 ≈ 1.18`.

## 6. Solutions tried so far (and the iteration loop)

| Pass | Commit | Change | Outcome |
|---|---|---|---|
| 1 | `dc10972` | Initial breath: scale 1.00→1.03, translate ±0.6%/±0.4%, period 10s, delay -5s. Caps copied from the BRD draft. | Effect "not visible to user." Diagnostic confirmed animation was running but motion was ~1.3 px/sec — below the conscious motion-perception floor. |
| 2 | `d6699cc` | Doubled amplitudes: scale 1.00→1.06, translate ±1.2%/±0.8%. Same 10s period. | Still "not visible." Diagnostic showed transforms now reaching `matrix(1.06, …, 3.2, 2.9)` — actual motion of ~3.2px peak translate, 15px width-delta at peak scale. Still reported as imperceptible. |
| 3 | `a8392ed` | Aggressive bump: scale 1.00→1.10, translate ±3%/±2%, period 8s, delay -4s. Mobile halved. | Diagnostic confirms transforms now reaching `matrix(1.10, …, 8.35, 7.42)` — ~8px translate peak, 25px width-delta at peak scale. **Still reported as imperceptible** by user. Only the hover-lift on the frame is visible to them. |

Each pass kept the diagnostic logs in place (chore commit `6e20349`) so we can confirm the runtime state matches the source.

## 7. Hypothesis matrix — why the gap persists

Ranked roughly by likelihood given the data:

### H1 — *Frame-vs-content perception gap* (most likely)
The user reads the photo card (frame + shadow + caption) as a unitary "object." Motion that happens *inside* a clipped frame, while the frame itself stays put, doesn't read as the object moving — it reads at best as the image being slightly off-register, and at worst as completely invisible.

The hover transform, by contrast, moves the **whole frame** (translate -4px on `.portraitFrame`). That's the only motion the user reports seeing. This suggests the user's perception system is locked onto the frame as the meaningful unit.

**Fix:** move the breath animation from `.portraitBreath` (inside the frame) to either the `.portraitFrame` itself (using individual transform properties so hover still works) or to a new wrapper *around* the frame. Then the entire photo card breathes — shadow, caption, gradient, all move together.

### H2 — *Amplitude still below user threshold*
Less likely given we're now at scale 1.10 / 8px translate / 4s ramps, but possible if the user is on a high-DPI display where 8px is visually small. Could bump to scale 1.15 / translate ±5%, but at some point this becomes the "twitchy" failure mode the BRD warns about.

### H3 — *Browser is rate-limiting or compositing oddly*
Chrome 148 is the very latest, and `animation-timeline: view()` is comparatively new. Theoretically a compositor bug where a parent layer's transform isn't propagating to a child layer that has its own `will-change: transform`. Low probability — Chrome's compositor handles this correctly in all standard cases, and the matrix values logged are computed by the same layout pipeline that renders to pixels.

### H4 — *User isn't watching long enough to perceive a 4s ramp*
With `ease-in-out`, the easing curve spends much of its time near the extremes, so the motion is fastest in the *middle* of the 4-second half-cycle. If the user glances at the photos for under 1s, they may catch a phase where motion is slow. Speeding up the period (4–6s) would help, but again risks twitchiness.

### H5 — *Tab is throttling animations in the background*
Modern browsers throttle animations in inactive tabs to save battery. If the tab is open but not focused while the user is verifying, animations may run at 1–10 fps. Unlikely while actively testing, but a known cause of "I can't see the animation."

### H6 — *Cache or CDN serving stale assets*
Ruled out — the diagnostic logs report the latest `animation-duration: 8s` and `animation-delay: -4s` values, which only exist in `a8392ed`.

## 8. What else an outside reader needs to know

- **No Storybook**, no visual regression infrastructure. Verification is the live site + Vitest CSS-source assertions.
- **Stack:** Next.js 16.2.1 (pages router, Turbopack), CSS Modules (per-file `@keyframes` hashing — that's why the diagnostic shows `__v4PortraitBreath` not `v4PortraitBreath`).
- **Deploy:** Push to `main` → Firebase App Hosting rebuilds automatically (2–5 min). The user has hard-refreshed and the live logs prove the latest code is running.
- **Coordinated UX:** when the user scrolls past the section, the page sets `portraitsDetached=true` and the portraits fade out while a WhatsApp FAB rises into their place (100 ms entrance delay). The breath continues underneath the fade — no current evidence this interferes.
- **Reduced motion is respected:** under `prefers-reduced-motion: reduce`, the breath is `animation: none` and `will-change: auto`. The user's setting is OFF, so this isn't masking the effect.
- **The inner `<img>` has its own animation** (scroll-driven Ken Burns in modern browsers, ambient Ken Burns in fallback). It composes with the breath at the GPU compositor level. Diagnostic confirms the breath wrapper's matrix is correct regardless of the inner animation.
- **Breakpoint contract:** [v4-breakpoints.test.ts](../src/__tests__/v4/v4-breakpoints.test.ts) enforces `{400, 600, 768, 769, 1024}px` as the only allowed media-query values. The breath's mobile rule lives at `600px`.
- **The diagnostic logs are still in place** under tag `[V4-Diferencial Breath DIAG]` — they will be removed once the effect is visually confirmed.

## 9. Proposed next step

Based on H1 (the highest-likelihood hypothesis), the next pass should:

1. **Move the breath animation off the inner wrapper and onto the photo card itself.** Two viable approaches:
   - **(a) Outer wrapper around the frame.** New `<div class="portraitOuter">` wraps `.portraitFrame`. Breath animation lives on `.portraitOuter`. The frame keeps its hover transform (no conflict because they're different elements). Cleanest, predictable, no CSS surprises.
   - **(b) Individual transform properties.** Animation uses `scale: …; translate: …;` (the individual CSS properties, not the `transform` shorthand). The `:hover` rule uses `translate: 0 -4px`. Modern browsers compose these independently (Chrome 104+, Safari 14.1+, Firefox 72+). Slightly more elegant CSS, slightly riskier browser support.

2. Once the whole card visibly breathes, **consider dialing the amplitude back down**. With the frame moving as a unit, scale 1.03–1.05 and translate ±1% should be plenty — possibly even more than enough. The current amplitudes were tuned for the "motion within a static frame" scenario and would likely feel excessive once the frame itself moves.

3. **Keep the diagnostic logs until visual confirmation.** Remove them in a single follow-up commit.

The intermediate possibility — that H2 or H3 are actually the cause and frame-level motion would only mask the deeper issue — is worth being aware of but unlikely given the matrix telemetry. If H1's fix doesn't resolve the perception gap, the next debugging step is a screen recording from the user's machine, not more code changes.

## 10. References

- Original BRD: [prds/v4_live_portraits.md](v4_live_portraits.md)
- Approved plan: [.claude/plans/create-a-detailed-plan-sequential-wilkes.md](../.claude/plans/create-a-detailed-plan-sequential-wilkes.md)
- Source: [src/components/v4/V4Diferencial.tsx](../src/components/v4/V4Diferencial.tsx), [src/components/v4/V4Diferencial.module.css](../src/components/v4/V4Diferencial.module.css)
- Tests: [src/__tests__/v4/V4LivePortraits.css.test.ts](../src/__tests__/v4/V4LivePortraits.css.test.ts), [src/__tests__/v4/V4Diferencial.test.tsx](../src/__tests__/v4/V4Diferencial.test.tsx)
- Commit history: `dc10972 → 6e20349 → d6699cc → a8392ed` on `main`

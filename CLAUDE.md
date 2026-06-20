# AGN PORTFOLIO — MASTER BUILD BRIEF
**For use with Claude Code inside VS Code**
**Project:** Adam Glenn Nicholson Portfolio Site
**Owner:** Adam Glenn Nicholson

---

## HOW TO USE THIS FILE

Save this file as `CLAUDE.md` in the root of the `agn-portfolio` repository. Claude Code will automatically read it as project context. Alternatively, paste its contents directly into a Claude Code session as your first message.

Work through the phases in order. After each phase, **stop, summarize what changed, and ask the user to verify in the browser before continuing to the next phase.** Do not attempt all phases in a single uninterrupted run — this site is live and must not break.

---

## 1. CRITICAL CONSTRAINTS — READ FIRST

These are non-negotiable. Violating any of these is a failed build, even if the code runs.

1. **Hosting:** This site is a static site deployed on Render's free tier. **No backend service, no Node server, no paid Render tier.** Every feature must run entirely in the browser (HTML/CSS/vanilla JS, or CDN-loaded libraries like Three.js). If a feature is technically impossible without a backend, flag it and stop — do not silently add a server.

2. **AI Chat Widget:** The chat widget (`js/chat.js`) is intentionally in "offline placeholder" mode due to CORS restrictions on the Anthropic API from browsers. **Do not attempt to re-enable live AI chat or add a Cloudflare Worker** unless explicitly instructed in a future session. Leave `chat.js` as-is.

3. **Brand voice — this is the most important constraint on this entire project:**
   - This site must **never** read as a job-seeking signal, a resume, or an advertisement for any company (including Dal-Tile, Vallourec, or any hypothetical future employer/venture).
   - Coworkers and managers will view this site. Nothing should imply availability for other roles, nothing should solicit business, nothing should look like a sales pitch.
   - The framing throughout is: *this is me, this is how I think, this is how I operate* — never *hire me* or *buy this*.
   - When in doubt about whether a piece of copy crosses this line, default to leaving it out and flag it for the user to review.

4. **Visual identity — "Arc Reactor" aesthetic, already established. Do not deviate.**
   - Color system is defined in `css/style.css` under `:root`. Primary accent is electric blue (`--blue: #00aaff`), secondary is cyan (`--cyan: #00eeff`), backgrounds are near-black navy (`--dark`, `--dark-2`, `--dark-3`, `--panel`, `--panel-2`).
   - Fonts: `Orbitron` (display/headlines), `Share Tech Mono` (terminal/mono UI text), `Rajdhani` (body text). All loaded via Google Fonts in `style.css`.
   - Every new component must use the existing CSS variables — never hardcode new colors.
   - HUD conventions already in place: corner brackets (`.bracket-tl`, `.bracket-tr`, etc.), `.reveal` scroll-fade-in class, `.hud-panel` / `.hud-panel-cyan` panel styling, `.status-badge` variants, terminal-style bracketed labels (`// LIKE THIS`).

5. **Custom cursor:** The site uses `cursor: none !important` globally with a custom crosshair cursor (`.cursor`, `.cursor-ring`). Any new interactive element must be added to the hover-effect selector list in `js/main.js` (`addHoverEffect` function) so the cursor ring reacts to it correctly.

6. **Accessibility caveat:** The custom cursor and `cursor: none` approach has accessibility tradeoffs. When doing the accessibility pass (Phase 1), do not remove the custom cursor, but do ensure keyboard navigation works fully without requiring the mouse cursor to be visible (focus states, tab order, etc.).

---

## 2. CURRENT FILE STRUCTURE

```
agn-portfolio/
├── index.html
├── about.html
├── experience.html
├── works.html
├── ethics.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   ├── boot.js          (boot sequence — index.html only)
│   ├── main.js           (cursor, scroll reveal, stat counters, terminal, hamburger nav, page transition)
│   ├── chat.js            (OFFLINE PLACEHOLDER — do not modify behavior)
│   ├── particles.js     (background particle network canvas)
│   └── sound.js           (procedural UI sound + ambient hum toggle)
└── assets/
    ├── favicon.svg
    ├── og-image.png
    ├── apple-touch-icon.png
    └── operator_dossier.pdf
```

Six pages exist today: Home, About, Experience, Works, Ethics, Contact. All share the same nav, footer, terminal easter egg, sound toggle, and particle background pattern. New pages must follow this same shared-component pattern.

---

## 3. EXPLICITLY OUT OF SCOPE — DO NOT BUILD

The user considered and rejected the following. Do not build these even if they seem like reasonable extensions of approved work:

- "Ask the Operator" FAQ accordion (any FAQ-style Q&A format)
- Developer Commentary Mode (annotation bubbles explaining build decisions)
- "Halls of Improvement" (animated gauge/bar dramatization of stats — the existing odometer-style counters are sufficient)
- Field Promotion insignia/rank badges on the timeline
- Extending the decrypt-reveal text effect beyond the Ethics page
- Audio waveform visualizer near the sound toggle
- "Human-in-the-Loop" AI stance content
- "Brownfield Modernization" philosophy content
- Reimagined digital-waste-taxonomy content
- "Servant Engineering" content
- "Succession by Design" content
- Cross-Functional Friction Map content
- "Leading vs. Lagging Indicators" content
- Any photo/headshot of the user
- Screenshots or images of real internal company artifacts (Safety App UI, guarding redesign photos, etc.)
- Testimonials or third-party quotes
- A separate mobile-specific hero design (responsive scaling of the existing hero is sufficient)
- Off-site brand collateral (LinkedIn banners, etc.)
- Any "unstyled / armor comes off" plain-text moment
- Live AI chat reactivation

If the user asks for any of these in a future session, that's a new decision — don't infer it from this brief.

---

## 4. BUILD PHASES

Work through these in order. Each phase should result in a working, deployable state — never leave the site broken between phases.

---

### PHASE 1 — Technical Foundation
*Lowest risk, highest baseline value. Do this first.*

**1.1 — Custom 404 page**
Create `404.html` matching site voice/aesthetic. Suggested framing: "SIGNAL LOST" or "NODE NOT FOUND" styled as a HUD error state, with a button back to Home. Render serves this automatically for unmatched routes on static sites — verify Render's static site 404 handling picks it up (may require a `_redirects` or Render-specific config; research if needed).

**1.2 — Sitemap & robots.txt**
Create `sitemap.xml` listing all pages (including the new 404 is not needed in sitemap). Create `robots.txt` allowing all crawlers and pointing to the sitemap.

**1.3 — Structured data**
Add JSON-LD `Person` schema to the `<head>` of `index.html` (and ideally all pages) with name, jobTitle, worksFor, alumniOf (all four institutions), sameAs (LinkedIn, Amazon author page if available), and url.

**1.4 — Accessibility pass**
- Add `aria-label` to all icon-only buttons (sound toggle, chat toggle, hamburger nav, terminal close).
- Verify full keyboard tab order through nav, all CTAs, the terminal input, and the chat input.
- Verify color contrast of body text (`--grey` on `--dark`) meets WCAG AA — adjust `--grey` slightly lighter if it fails.
- Add a "skip to main content" link for keyboard users, visually hidden until focused.
- Ensure the custom cursor's `cursor: none` does not interfere with native focus indicators — add visible `:focus-visible` outline styles in the brand's blue/cyan palette.

**1.5 — PWA manifest**
Create `manifest.json` with app name "AGN // Adam Glenn Nicholson", short_name "AGN", theme_color and background_color matching `--dark` and `--blue`, and icons referencing `assets/apple-touch-icon.png` (and generate additional sizes if needed: 192x192, 512x512). Link it in the `<head>` of every page. Verify "Add to Home Screen" works on mobile Chrome.

**1.6 — Visitor counter**
Research a free, no-account-friction visitor counter service compatible with static sites (e.g., a free badge/API service). Style it to match the HUD aesthetic rather than using a default badge image — wrap the count in the site's existing `.status-badge` or terminal-style treatment. Place it unobtrusively (footer is a good candidate). Flag for the user if any service requires account signup before you can proceed.

**STOP. Report changes. Wait for user to verify before Phase 2.**

---

### PHASE 2 — Page Transition Redesign
*Isolated, well-defined, fixes a known UX problem.*

The current transition (`#page-transition` in `style.css`, logic in `main.js`) is too slow and uses a fully opaque overlay that blocks content for longer than necessary. Replace with this approach:

- On click: fire a fast (~150ms max) bright energy pulse/flash — not a full opaque blackout.
- Navigate almost immediately after the pulse registers — do not add artificial `setTimeout` delays beyond what's needed for the pulse animation to be visually perceptible.
- On arrival at the new page: the overlay should start **semi-transparent**, not fully opaque, so content is already dimly visible underneath immediately on load.
- Reveal should trigger as soon as the script runs — no fixed delay before starting the reveal.
- Keep a glowing scan-line sweep as a visual flourish, but it should play **over already-visible content**, not hide content behind it.
- Respect `prefers-reduced-motion` — instant navigation with no animation for users who have that preference set (this logic already partially exists — verify it still works with the new approach).
- Net goal: same HUD personality, roughly half the perceived dead time of the current implementation, and it should never feel like the user is staring at a blank/solid screen.

**STOP. Report changes. Wait for user to verify before Phase 3.**

---

### PHASE 3 — Cohesion & Craft Details
*Small, mostly independent additions. Can be built in any order within this phase.*

**3.1 — Custom scrollbar & text-selection styling**
Style `::-webkit-scrollbar` and `::selection` globally to use the blue/cyan palette instead of browser defaults.

**3.2 — Console easter egg**
On every page, log a styled message to the browser console (using `%c` CSS console styling) when the page loads — something in voice, e.g., welcoming curious developers, possibly hinting at the terminal easter egg (Ctrl+`).

**3.3 — Footer build-hash detail**
Add a small footer line resembling a build timestamp/hash, e.g., `BUILD a3f9c2 // LAST COMPILED [date]`. Can be a static string updated manually, or generated via a simple build-time script if Claude Code wants to automate it — static is acceptable and simpler.

**3.4 — Pulsing favicon**
This requires dynamically swapping the favicon between two states via JS on an interval (favicons don't support CSS animation directly) — implement using a `<link rel="icon">` swap between two slightly different SVG/PNG states, or animate via a canvas-generated favicon if feasible. Keep the pulse subtle and slow (matching the nav logo's existing glow rhythm if one exists, or establishing a ~2-3 second breathing cycle).

**3.5 — "Now" status strip**
A small, specific, personal status line — NOT a generic rotating ticker. Format similar to: `CURRENTLY: [specific project] // RESEARCHING: [specific topic] // NEXT: [specific goal]`. Placement: footer or a thin strip near the top of the homepage. **Ask the user for current accurate content for this before building** — do not invent specifics.

**3.6 — Live incrementing uptime counter**
Replace or supplement the static "17 years, 0 days downtime" terminal command with a real-time ticking counter (calculate from a fixed start date, update via `setInterval`). Can live in the terminal easter egg output and/or be visible somewhere on the page.

**3.7 — Circuit-trace borders**
Replace (or offer as enhancement to) the static corner brackets (`.bracket-tl` etc.) with an animated SVG stroke that draws itself in when a card scrolls into view (`stroke-dasharray` / `stroke-dashoffset` animation triggered by the existing `.reveal` IntersectionObserver pattern in `main.js`).

**3.8 — Subtle card tilt-on-hover**
Add a lightweight JS-driven 3D tilt effect (perspective transform based on cursor position) to cards site-wide — stat items, skill nodes, principle cards, chapter cards, book/app cards, cert cards, value cards. Keep it subtle (a few degrees max) and desktop-only (disable on touch devices).

**3.9 — Particle cursor interaction**
Modify `particles.js` so nearby particles are gently repelled/disturbed by cursor proximity instead of drifting entirely independently of user input.

**3.10 — Cohesion pulse sync**
Identify the pulse/glow timing used in the nav logo glow, the favicon pulse (3.4), and the Arc Reactor core (built in Phase 4) — synchronize them to the same interval/easing so they breathe in unison. This task depends on Phase 4 being complete for the reactor piece; the nav logo and favicon can be synced now and the reactor brought into sync afterward.

**STOP. Report changes. Wait for user to verify before Phase 4.**

---

### PHASE 4 — Hero Centerpiece: 3D Arc Reactor + Name-Formation Intro
*Highest complexity, highest visual payoff. Build carefully, test performance on mobile.*

**4.1 — 3D Arc Reactor model**
- Load Three.js via free CDN (no build step, no npm/backend required — use the CDN script tag approach).
- Build a rotating, glowing ring assembly with an emissive core, styled in the blue/cyan palette, semi-transparent so it doesn't fully obscure content behind it.
- **Placement decision (already made):** Replace the current static `.hero-side` panel in `index.html` entirely. The reactor becomes a large centerpiece occupying the right portion of the hero.
- Key stats (years, published works, apps deployed, etc. — currently listed in the `.hero-side-row` elements) should now float as minimal glowing text tags positioned around the reactor's rings, not boxed in a panel.
- **Performance constraints:** cap geometry complexity and pixel ratio for mobile devices; detect lower-end devices or small viewports and either simplify the model or fall back to a static glowing image/CSS-only version. Test that this does not tank Lighthouse performance scores or cause jank on phones.
- Left side of hero (name, manifesto, CTAs) stays exactly as-is — do not let the reactor crowd or overlap it.

**4.2 — Particle name-formation intro**
- On every visit to `index.html` (not session-gated — remove any "only show once per session" logic currently in `boot.js` if present), particles assemble into the text "ADAM GLENN NICHOLSON" before the rest of the boot sequence plays.
- This should layer on top of / lead into the existing boot sequence in `boot.js`, not replace it outright — sequence should be: particles assemble into name → brief hold → condensed boot terminal lines play → hero reveals.
- Add a time-of-day-aware greeting to the boot sequence (e.g., varying the "WELCOME" line based on the visitor's local time — morning/afternoon/evening/late-night variants). Keep these in HUD/terminal voice, not casual.
- Include a sound cue tied into the existing `sound.js` system when the name finishes assembling (only plays if the user has sound enabled).
- Verify this doesn't significantly increase time-to-interactive — the intro should be skippable or fast enough not to frustrate repeat visitors (since it now plays every time).

**STOP. Report changes. Wait for user to verify before Phase 5.**

---

### PHASE 5 — New Pages & Sections

Build each of the following as its own page (or section, where noted), following the existing nav/footer/terminal/particle-canvas/sound-toggle pattern established in the six existing pages. Add each new page to the main nav, to `sitemap.xml` (from Phase 1), and to the JSON-LD structured data if relevant.

**5.1 — Build Log**
A page styled like a software changelog. Dated entries marking real milestones — site launch, Safety App going live, book publications, DBA milestones, etc. Format: version-number style or date-stamped entries, terminal/commit-log visual treatment. **Ask the user for an accurate list of milestone dates before building** — do not invent dates.

**5.2 — Manifesto Wall**
A single gallery-style page collecting every standalone quote already used across the site (the manifesto, the legacy principle, the leadership oath, the operating philosophy lines, etc.) presented together as one collection. Pull exact existing copy — do not paraphrase or write new quotes.

**5.3 — Lexicon**
A glossary page defining the user's own recurring vocabulary/phrases (e.g., "compound improvement," "eliminate the conditions," "built from the floor up"). **Ask the user to confirm/expand the list of terms and definitions before building** — compile from existing site copy as a starting point, but confirm before publishing.

**5.4 — Origin Story**
A single immersive, scroll-driven page telling the 2008 floor-entry narrative, with text revealing progressively as the user scrolls (Intersection Observer-driven reveal, similar to existing `.reveal` pattern but potentially more cinematic — full-viewport-height sections per beat). **Ask the user for the actual narrative beats/details before writing this** — this is the most narrative-heavy piece on the site and needs real input, not invented detail.

**5.5 — Reading List / Influences**
A page listing the thinkers, books, or frameworks (outside the user's own published books) that shaped his CI philosophy. **Ask the user for the actual list before building** — do not invent influences.

**5.6 — Field Map**
A stylized map (can be built with a simple SVG/Canvas approach, or a lightweight mapping library loaded via CDN if needed — avoid anything requiring an API key/paid tier) with glowing pin markers connecting: Hattiesburg, MS (USM); Norman, OK (OU); Madison, WI (Edgewood); Muskogee, OK (Dal-Tile); Broken Arrow, OK (home). Connect the pins with traced lines suggesting the journey. Likely lives on the About page near the Education Log, or as its own small section.

**5.7 — Systems-flow diagram**
An animated SVG showing nodes and connections with pulsing data packets traveling along the lines — visually demonstrating systems thinking. Likely placement: About page, possibly near or replacing part of the existing radar chart area, or as a standalone section. Use abstract/generic node labels (e.g., "Input," "Process," "Standard," "Output," "Feedback Loop") rather than anything tied to a specific real company system.

**5.8 — Skills dependency tree**
A branching node diagram (different from the existing radar chart) showing capability progression — e.g., Operations → Maintenance → Systems Thinking → Process Engineering / Application Development. Build as SVG with connecting lines, styled consistently with the systems-flow diagram (5.7) and radar chart. Likely lives on the About page alongside the radar chart.

**5.9 — Constellation of credentials**
Render the existing certifications/memberships grid (currently flat cards on the Experience page) as connected points in a night-sky/constellation-style graphic instead. This can either replace or supplement the existing `.certs-grid` on `experience.html`.

**5.10 — Doctrine / Frameworks page**
A new dedicated page housing the following approved intellectual-content pieces. **All of this content needs the user's input/terminology before being written** — do not invent a "signature CI framework" name or specific claims without the user's direct input. Draft placeholder structure and prompt the user for content on:
   - A signature CI maturity framework/model connecting the two published books (needs a name and structure from the user)
   - "Leadership Without the Title" — using the user's actual non-managerial leadership roles (Past Master, FTZ Subzone Director, Commandery Senior Director, Phi Theta Kappa Coordinator, Student Alumni Association VP) as the evidence base
   - A point of view on Industry 4.0 vs 5.0, using the user's own deployed apps (especially the Troubleshooting/Knowledge Capture App) as living proof
   - A Hazard Pattern Library — an anonymized, sanitized taxonomy built from the real BBS analysis (hazard clusters across 638 submissions) — **must be fully anonymized, no company-identifying specifics**
   - A Safety Culture Maturity Curve — the user's own framework for how safety culture evolves from reactive to generative
   - An Integration Architecture diagram — abstracted/sanitized illustration of bridging legacy industrial systems with modern tools — **no real, sensitive infrastructure detail**
   - "Systems vs. Heroics" — a short piece arguing real organizational excellence is a system that holds up without dependency on specific people, tied to the existing leadership oath line

**5.11 — Tools of the Trade**
A stylized grid/inventory-style display of the user's actual working tools — SAP, SQL, Raspberry Pi, 3D printer, Fusion 360, etc. — presented with game-inventory-loadout visual treatment (icon + label + maybe a status/proficiency indicator) rather than a flat text list. Likely lives on the About page near the existing skill nodes, or could anchor its own small section.

**STOP after each individual page is built and report — do not build all of 5.1–5.11 in one uninterrupted pass. Several of these explicitly require user-provided content (5.1, 5.3, 5.4, 5.5, 5.10) and must not proceed on invented details.**

---

### PHASE 6 — Remaining Interactivity

**6.1 — Command palette**
A keyboard-shortcut-triggered (e.g., Cmd/Ctrl+K) HUD-styled search/command box allowing the user to jump to any page or trigger any site action (open terminal, toggle sound, download dossier) by typing. Build as an overlay similar in structure to the existing terminal easter egg overlay.

**6.2 — Custom right-click context menu**
Replace the browser default context menu with a branded HUD-styled menu offering relevant actions (copy link, download dossier, etc.).

**6.3 — Achievement system**
A `localStorage`-based system that quietly unlocks toast/notification-style achievements as visitors explore — e.g., finding the terminal, opening dev tools (ties into the Phase 3 console easter egg), visiting every page, using the command palette. Should be entirely optional/invisible to visitors who don't engage with it — never required, never interrupts normal browsing.

**6.4 — Shareable quote-card generator**
On the Manifesto Wall (5.2) and/or wherever standalone quotes appear, add a "share" action that generates a branded image card (Canvas-based, client-side, no backend) of the quote in the site's visual style, downloadable or ready to share.

**STOP. Report changes. Wait for user to verify before Phase 7.**

---

### PHASE 7 — Personal Collateral (Blocked / Manual Steps)

**7.1 — QR code for business card**
**This phase is blocked until the custom domain (`adamgnicholson.com`) is connected to the live Render deployment.** Once connected, generate a QR code (can use a client-side JS QR generation library via CDN, or a one-time generation script) pointed at the live homepage URL, styled in the HUD aesthetic (not a default black-and-white QR block — frame it with corner brackets / blue tint consistent with the site). Output as a downloadable image asset for printing.

**Do not attempt this phase until the user confirms the domain is connected.**

---

## 5. DEBUGGING & VERIFICATION PROTOCOL

After every phase:

1. **Read back through all modified/new files** for syntax errors, mismatched tags, and broken references before declaring the phase complete.
2. **Check that every new interactive element** has been added to the cursor hover-effect list in `main.js` if it's clickable/hoverable.
3. **Check that every new page** includes: the particle canvas, sound toggle, full nav (with the new page added to nav on ALL pages, not just the new one), footer, terminal overlay, and correct relative paths to `css/style.css` and the `js/` files.
4. **Verify no console errors** by carefully reading the JS logic — trace through variable declarations to ensure no duplicate `const`/`let` declarations across script files loaded on the same page (this has caused real bugs before in this project — multiple scripts cannot declare the same top-level variable name).
5. **Verify mobile breakpoints** — check that new components have responsive rules at the existing breakpoints used elsewhere in `style.css` (1024px, 768px, 880px, 900px, 600px as relevant).
6. **Verify `prefers-reduced-motion` is respected** for any new animation.
7. **Do not commit/suggest pushing to GitHub until the user has visually verified the phase in their browser.** Summarize what was built, what file(s) changed, and explicitly ask the user to test before moving on.
8. If the user reports a bug, **reproduce the likely cause by reading the relevant code path first** before making changes — don't guess-and-check blindly.

---

## 6. THINGS THAT NEED USER INPUT BEFORE BUILDING

Flag these clearly when you reach them — do not invent content for any of these:

- "Now" status strip content (3.5)
- Build Log milestone dates (5.1)
- Lexicon term list (5.3)
- Origin Story narrative beats (5.4)
- Reading List / Influences (5.5)
- Doctrine page: signature CI framework name/structure (5.10)
- Confirmation that domain is connected before QR code generation (7.1)
- Visitor counter service choice, if signup is required (1.6)

---

*End of build brief. Work phase by phase. Protect the live site at every step.*

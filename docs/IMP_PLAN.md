Implementation Plan — Fixes for Findings 3–10 + Flagged Items
Noted: #1 and #2 (Apple/Facebook login) are handled by commenting out — no action needed there until you implement them properly. Below is the organized plan for everything else you marked, plus my analysis of the dynamic category/publication routing question. No code in this session — plan only.

Phase 1 — Data Layer & Auth Correctness (do this first)
Step 1.1 — Fix the double social-login API call (Finding #3)
Problem: SocialLoginContext.authenticate() calls the mutation itself, then calls AuthContext's socialLogin() which calls the same mutation again (AuthContext.tsx:141). Fix: Make AuthContext the single owner of the social-login mutation. SocialLoginContext.authenticate() should only delegate to socialLogin() from useAuth() and drop its own mutateAsync call. One request per login. Files: contexts/SocialLoginContext.tsx Note: Low urgency while the buttons are commented out, but fix before re-enabling social login.

Step 1.2 — Stop the guest 401 storm (Finding #4)
Problem: useCart, useOrders, useAddresses, useWishlist have no enabled guards — 4 unauthorized requests (×2 with retry) fire for every anonymous visitor on every page. Fix: Add enabled: !!userId to all four query hooks. Optionally introduce a small shared helper so future user-scoped queries can't forget the guard. Files: the 4 hooks above.

Step 1.3 — Stop wiping the whole cache on social login
Problem: use-social-login.ts:32 calls queryClient.clear(), destroying cached public data (books, categories, menu tree) → refetch storm after login. Fix: Remove clear(); the user state already lives in AuthContext. If anything, invalidate only user-scoped keys (["cart"], ["wishlist"], ["orders"], ["addresses"]). Files: hooks/use-social-login.ts

Step 1.4 — Harden the API client
Problem: lib/api-client.ts:55 — unguarded response.json() (a 500 HTML page or 204 throws a raw SyntaxError, not an ApiError); no 401 handling (expired token = silent infinite failure); no timeout. Fix (three parts):

Safe parsing: check content-type before .json(), wrap in try/catch, and throw a proper ApiError with a friendly fallback message for non-JSON responses.
401 handling: on 401, clear the token and redirect to /login (or emit an event AuthContext listens for). This also fixes "session expired" behavior globally.
Timeout: add an AbortController (e.g., 30s) so hung requests fail with a clear "Request timed out" error. Files: lib/api-client.ts
Phase 2 — Route Protection & Interaction Bugs
Step 2.1 — Checkout auth guard + double Navbar (Finding #5)
Fix: In app/checkout/page.tsx, redirect guests to /login (via useEffect + the existing mounted flag from useAuth). Remove the duplicate <Navbar /> in the empty-cart branch (line 60) — the layout already renders one.

Step 2.2 — /orders blank page for guests
Fix: app/orders/page.tsx:262 — replace return null with a useEffect redirect to /login (keep a minimal loading state while redirecting).

Step 2.3 — router.push() during render (3 files)
Fix: Move navigation into useEffect in app/profile/page.tsx:64, app/orders/[id]/page.tsx:73, app/orders/success/page.tsx:49. Pattern: useEffect(() => { if (!isAuthenticated) router.push("/login") }, [isAuthenticated]) with a return null fallback render.

Step 2.4 — Cart quantity reaching 0
Fix: In components/CartDrawer.tsx:168, disable the minus button at quantity === 1 (removal stays available via the X button). This prevents invalid quantity: 0 PATCH requests.

Step 2.5 — Homepage useSearchParams deopt
Fix (recommended, simplest): Remove useSearchParams() from BookCard entirely. Its only purpose is a categoryId fallback, and every usage site either passes categoryId as a prop or has no category context (home sections). Removing it eliminates the Suspense requirement and the client-rendering deopt of / with zero UI change. (Wrapping sections in Suspense is the alternative, but removing the hook is cleaner.) Files: components/BookCard.tsx

Phase 3 — Styling System Repair (Findings #8, #9, #10)
Step 3.1 — Define the missing color tokens (Finding #9)
Problem: 23 usages of charcoal, terracotta, terracotta-dark, forest, forest-light, gold across 8 files — none exist in app/globals.css @theme, so Tailwind v4 silently drops them. Fix: Add these to the @theme block, mapped to your existing brand palette (e.g., charcoal → the slate-900 value #0F172A, gold → the amber-500 value #D97A07, terracotta/terracotta-dark → accent shades, forest/forest-light → secondary shades). Also add --color-heading and --color-body for the 10 text-heading/text-body uses in checkout. Files: app/globals.css

Step 3.2 — Fix the hsl()-wrapped hex bug (Finding #10, part 1)
Problem: app/globals.css:264 — hsl(var(--background)) where --background is already a hex value → invalid CSS → body background/color silently fall back to browser defaults. Fix: Use the variables directly: background-color: var(--background); color: var(--foreground);

Step 3.3 — Resolve dark mode (Finding #10, part 2)
Problem: The .dark block is dead code — next-themes is installed but no ThemeProvider is mounted. Fix — pick one: (a) mount next-themes ThemeProvider in app/providers.tsx with attribute="class" and add a theme toggle, or (b) delete the .dark block and the next-themes dependency. Recommend deciding based on whether dark mode is on the roadmap — don't leave it half-wired.

Step 3.4 — Define or remove the missing shadow/gradient variables
Problem: --shadow-card, --shadow-card-hover, --gradient-warm, --gradient-hero are referenced by .shadow-warm, .book-card:hover, .gradient-text, .hero-gradient (app/globals.css:293) but never defined. Fix: Either define them in :root or delete the utility classes that reference them.

Step 3.5 — Kill float price artifacts
Problem: ৳{totalPrice} unrounded (CartDrawer.tsx:208) can render 0.30000000000000004-style values; toFixed usage is inconsistent. Fix: Add a single formatPrice() helper (in lib/price-utils.ts or a new lib/format.ts) that parses string/number, applies toFixed(2), and prefixes ৳. Use it in CartDrawer, checkout summary, book detail, and order pages.

Phase 4 — Content Correctness & Branding (Findings #6, #7)
Step 4.1 — Real profile persistence (Finding #6)
Problem: updateProfile() is localStorage-only; the success toast lies. Fix: Add a profile-update mutation (confirm the endpoint with your backend — likely PATCH /users/me or /auth/profile) in a new use-profile hook or extend use-auth. Flow: optimistic localStorage update → API call → reconcile with server response → toast only on success, error toast on failure. Until the endpoint exists, at minimum change the toast to reflect local-only saving. Files: contexts/AuthContext.tsx, app/profile/page.tsx, new hook.

Step 4.2 — Differentiate the three home sections (Finding #7)
Problem: NewReleases, Featured, PopularBooks all slice() the same useBooks() response — identical books under three headings. Fix (interim, no backend change): slice differently — e.g., New Releases = first 4 by createdAt desc, Featured = next 4 (offset slice), Popular = a different 6. They already share one query (same cache key), so this costs nothing. Better (needs backend): a featured/popular flag or sort param on /books, then each section queries its own slice. Files: the three components above.

Step 4.3 — Branding sweep → "Core Learning Centre"
Replace all occurrences:

components/home/WhyChooseUs.tsx:51 — "Why Chroma Bookshelf"
components/home/CommunityCTA.tsx:62 — testimonial text "Chroma Bookshelf feels…"
app/login/page.tsx:61 — "Welcome to BookHaven"
package.json:2 — rename chroma-bookshelf-next → e.g. core-learning-centre-web
(Footer already correct; DealOfTheDay is commented out but update if revived.)
Phase 5 — Error Handling & App Infrastructure
Step 5.1 — Meaningful error messages (replacing raw API errors)
Problem: Raw backend messages leak to users (books/page.tsx:85, receipt verify page, etc.). Fix: Create a central error-message mapper (e.g., lib/error-messages.ts) used by handleApiError and query error states:

Condition	User-facing message
Network failure / timeout	"Can't reach the server. Please check your connection and try again."
401	"Your session has expired. Please sign in again."
403	"You don't have permission to do that."
404	"We couldn't find what you were looking for."
409	"This conflicts with something that already exists."
422 / validation	Show field-level messages from error.errors (already supported)
500+	"Something went wrong on our end. Please try again later."
Technical details go to console.error only. Apply in hooks/use-api.ts:6 and the error states of books/receipt pages. Files: new lib/error-messages.ts, hooks/use-api.ts, app/books/page.tsx, app/receipts/verify/[receiptNumber]/page.tsx

Step 5.2 — Add error.tsx, not-found.tsx, loading.tsx
Fix:

app/error.tsx — client component with reset(), friendly message (reuse Step 5.1 mapper), "Go Home" button. Catches all unhandled route errors.
app/not-found.tsx — branded 404 page. This also fixes the soft-404 problem where unknown URLs currently render "Category Not Found" via the [slug] catch-all.
app/loading.tsx — root-level loading UI for route transitions.
Optionally app/book/[id]/loading.tsx later (the page has its own skeleton, so optional). Files: three new files in app/.
Step 5.3 — Deduplicate shared logic
Fix:

Delete the local getEffectivePrice copy in app/book/[id]/page.tsx:83; import from lib/price-utils.ts.
Extract parsePrice (copy-pasted in 4 files) into the same format helper from Step 3.5.
Extract getStatusColor/getPaymentColor (duplicated in orders/page.tsx and orders/[id]/page.tsx) into a shared module, e.g., lib/order-utils.ts or components/order/status-badge.tsx. Files: as listed.
Phase 6 — Dynamic Category / Publication / Subject Pages (your question)
My take: yes, this is the right approach, and your API already provides everything needed. The /categories/menu/tree endpoint returns the full Category → Publication → Subject → Book hierarchy, and the Navbar already generates hrefs in exactly that nested shape (/{category}/{pub}/{subj} — Navbar.tsx:577). The frontend just needs routes that match. Two options:

Option A — Nested dynamic routes (recommended):

app/[slug]/page.tsx — category page (exists; extend to also match publications as a fallback)
app/[slug]/[pubSlug]/page.tsx — new publication page
app/[slug]/[pubSlug]/[subjectSlug]/page.tsx — new subject page
Each page resolves its node from the menu tree (already cached by the Navbar's useCategoriesMenuTree — zero extra requests), collects the book IDs beneath that node, and renders the same book grid you already use on /books.

Option B — Single catch-all app/[...slug]/page.tsx: one file parsing 1–3 segments. Fewer files, but messier param handling and weaker per-level structure. Not recommended.

Book data strategy for publication/subject pages:

If /books accepts a publicationId/subjectId param (worth confirming with your backend), use it directly — cleanest.
Otherwise: fetch books by categoryId and filter client-side against the book IDs in that tree node. This pattern already exists (the books page does client-side category filtering), so it's consistent with the codebase.
Safety notes:

Static routes (/books, /about, /login, /orders, /profile, /checkout, /receipts) automatically take precedence over dynamic segments in Next.js — no conflicts.
Keep the "not found" fallback for unmatched slugs, which now pairs nicely with the new not-found.tsx from Step 5.2.
SEO/metadata for these pages can be a later enhancement (they'd need server components or generateMetadata).
Pragmatic alternative (if you want to ship faster): point the Navbar's publication/subject links at /books?categoryId=… and skip dedicated pages. Less work, but you lose publication/subject-level URLs — given the API gives you the full tree, Option A is the better long-term investment.

Suggested Execution Order
Order	Phase	Why
1	Phase 1 (Steps 1.1–1.4)	Correctness of data/auth layer; everything else builds on it
2	Phase 2 (Steps 2.1–2.5)	Fixes broken guest journeys and React anti-patterns
3	Phase 3 (Steps 3.1–3.5)	One CSS pass repairs ~30 visible bugs
4	Phase 5 (Steps 5.1–5.3)	Error infrastructure + deduplication
5	Phase 4 (Steps 4.1–4.3)	Content correctness and branding
6	Phase 6 (Step 6)	New routing — largest piece, best done on a stable base
Explicitly excluded per your instructions: out-of-stock/DRAFT paper validation, registration name field, checkout shipping total, guest desktop search, and the commented-out social login buttons (already handled).
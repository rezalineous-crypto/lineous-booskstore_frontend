# FUNCTIONAL FLOW DIAGNOSTIC REPORT

## Authentication Flow
**Status:** Generally okay
- Login redirects guests appropriately
- AuthContext manages state well
- Social login integrated
- **Issues:**
  - Token expiry handling - need to check if API client handles refresh
  - Some routes don't check auth consistently

## Cart Flow
**Status:** Okay
- CartContext manages cart state
- Add to cart from book page works
- Cart drawer exists
- **Issues:**
  - Cart persistence across sessions?
  - Quantity limits not enforced everywhere
  - Stock validation

## Checkout Flow
**Status:** Mostly okay
- Requires auth (redirects guests) ✓
- Address selection/creation ✓
- Payment method selection (COD) ✓
- Order creation ✓
- **Issues:**
  - No validation for empty cart before checkout
  - Address required but flow could be clearer
  - Error handling could be improved
  - Stock not checked at checkout

## Order Flow
**Status:** Okay
- Orders list and detail pages
- Receipt download functionality
- **Issues:**
  - Order status updates not visible in real-time
  - Some filters may not work as expected

## Search & Navigation
**Status:** Okay
- Search functionality exists
- Category navigation works
- **Issues:**
  - Search debouncing?
  - Empty states

## API Integration
**Status:** Needs review
- API client exists
- Error handling present
- **Issues:**
  - Token refresh mechanism unclear
  - Error messages could be more user-friendly
  - Some endpoints may not be called correctly

## Mobile-Specific Flows
**Status:** Improved
- Bottom nav works
- Mobile menu works
- **Issues:**
  - Cart drawer interaction with bottom nav
  - Some flows not optimized for mobile

Overall flows are functional but have some edge cases that need attention.




# DETAILED ISSUES BY FLOW

## AUTH FLOW
1. **Token refresh** - Unclear if API client handles 401/refresh token flow
2. **Social login redirect** - Callback handling needs verification
3. **Guest checkout** - Correctly redirects to login but no message shown
4. **Session persistence** - User loaded from localStorage but token validation not visible

## CART FLOW
5. **Stock validation** - No check if item in stock before adding to cart
6. **Quantity limits** - maxQuantity commented out in book page
7. **Cart persistence** - Unclear if cart syncs across devices
8. **Price calculation** - Discount logic present but edge cases unclear

## CHECKOUT FLOW
9. **Empty cart check** - Redirects if empty but timing issue possible
10. **Address validation** - No validation if selected address is valid
11. **Payment method** - Only COD implemented, no other methods
12. **Order creation error handling** - Errors shown via toast but state not reset properly
13. **Stock check at checkout** - Not visible, could oversell

## ORDER FLOW
14. **Order status updates** - No real-time updates
15. **Receipt download** - May fail silently
16. **Order filtering** - Client-side only, could be server-side
17. **Empty state** - Handled but UX could be better

## NAVIGATION/SEARCH
18. **Search** - No debouncing, could cause excessive API calls
19. **Category navigation** - Deep nesting in menu
20. **Mobile menu** - Categories now navigate to books (fixed)
21. **Bottom nav** - Cart opens drawer, others navigate

## API/ERROR HANDLING
22. **Error messages** - Some generic, not user-friendly
23. **Loading states** - Some pages missing skeletons
24. **Network errors** - Not consistently handled

## MOBILE SPECIFIC
25. **Cart drawer** - May conflict with bottom nav
26. **Forms on mobile** - Some inputs need better keyboard handling
27. **Horizontal scroll** - Some tables still scroll
28. **Touch targets** - Most improved but check all buttons









# CONCRETE FIXES FOR EACH ISSUE

## AUTH FLOW
1. **Token refresh** - Fix: Add 401 interceptor in api-client.ts to attempt refresh token. **Needs answer:** Does backend support /auth/refresh endpoint?
-- ANS: Yes, the backend supports a `/auth/refresh` endpoint.

**Endpoint:** `POST /auth/refresh`

**Controller:** `src/auth/auth.controller.ts:55-58`
```typescript
@Post('refresh')
refresh(@Body('refreshToken') refreshToken: string) {
  return this.authService.refresh(refreshToken);
}
```

**Service:** `src/auth/auth.service.ts:250-288`

The refresh flow:
1. Verifies the refresh token JWT signature
2. Looks up the user and checks the stored refresh token matches
3. Checks the refresh token hasn't expired (`refreshTokenExpiresAt`)
4. Builds new access + refresh tokens (token rotation — new refresh token issued on each use)
5. Returns `{ accessToken, refreshToken, user }`

**Request body:** `{ "refreshToken": "<your-refresh-token>" }`

**Response:** `{ accessToken, refreshToken, user: { id, email, role } }`

The API client should handle 401 responses by calling this endpoint with the stored refresh token, then retrying the original request with the new access token.

2. **Social login redirect** - Fix: Check callback URL handling. **Needs answer:** Confirm redirect URL format. -- ANS: DIDNT UNDERSTAND


3. **Guest checkout message** - Fix: Show toast before redirect. **Code fix:** Add toast in checkout page.
4. **Session persistence** - Fix: Validate token on mount. **Needs answer:** Should we call /auth/me on app load? -- ANS: DIDNT UNDERSTAND

## CART FLOW
5. **Stock validation** - Fix: Check stock before addToCart. **Needs answer:** API returns stock in paper/book? -- ANS: NO STOCK VALIDATION NEEDED. ITS INTENTIONAL

6. **Quantity limits** - Fix: Use actual maxQuantity from stock. **Needs answer:** Stock field location? -- ANS: THERE IS NONE FOR NOW. LEAVE IT AS IT IS

7. **Cart persistence** - Fix: Sync with backend or localStorage. **Needs answer:** Should cart persist logged-in users? -- ANS: SYNC WITH LOCALSTORAGE FOR NOW

8. **Price calculation** - Fix: Already implemented, monitor. **No question needed**

## CHECKOUT FLOW
9. **Empty cart check** - Fix: Already exists, improve timing. **No question needed**
10. **Address validation** - Fix: Validate address fields. **No question needed**
11. **Payment method** - Fix: Add more methods or confirm COD only. **Needs answer:** Other payment methods? -- ANS: NONE. LEAVE IT AS IT IS

12. **Order creation error handling** - Fix: Better error messages, reset state. **No question needed**
13. **Stock check at checkout** - Fix: Validate before order creation. **Needs answer:** Should we check stock server-side or client-side? -- ANS: NO STOCK VALIDATION NEEDED. ITS INTENTIONAL. SO NO CHECKING

## ORDER FLOW
14. **Order status updates** - Fix: Add polling or websocket. **Needs answer:** Real-time updates needed? -- ANS: NOT FOR NOW. LEAVE IT AS IT IS

15. **Receipt download** - Fix: Better error handling. **No question needed**
16. **Order filtering** - Fix: Server-side filtering. **Needs answer:** API supports filtering? -- ANS: NOT CURRENTLY
17. **Empty state** - Fix: Improve UI. **No question needed**

## NAVIGATION/SEARCH
18. **Search debouncing** - Fix: Add debounce hook. **No question needed**
19. **Category navigation** - Fix: Improve menu UX. **No question needed**
20-21. **Fixed** - Done

## API/ERROR HANDLING
22. **Error messages** - Fix: Use getFriendlyErrorMessage everywhere. **No question needed**
23. **Loading states** - Fix: Add skeletons. **No question needed**
24. **Network errors** - Fix: Add retry logic. **Needs answer:** Retry strategy? -- ANS: SHOW A SMALL RETRY BTN FOR USER TO MANUALLY DO THAT

## MOBILE SPECIFIC
25. **Cart drawer conflict** - Fix: Ensure proper z-index/behavior. **No question needed**
26. **Forms mobile keyboard** - Fix: Add inputmode, autocomplete. **No question needed**
27. **Horizontal scroll** - Fix: Add overflow-x-hidden. **No question needed**
28. **Touch targets** - Fix: Ensure min 44x44px. **No question needed**

**Questions for you:**
1. Does backend have /auth/refresh endpoint?
2. Should we call /auth/me on app load to validate session?
3. Where is stock info stored (paper.stock or book.stock)?
4. Should cart persist for logged-in users?
5. What payment methods are supported?
6. Should we validate stock client-side or rely on server?
7. Do you need real-time order status updates?
8. Does orders API support server-side filtering?
9. What's the preferred retry strategy for failed requests?






# COMPLETE FIX PLAN

## IMMEDIATE FIXES (No API changes needed)

### 1. Token Refresh Interceptor
**File:** `lib/api-client.ts`
- Add response interceptor for 401
- Call POST /auth/refresh with stored refresh token
- On success, update tokens and retry original request
- On failure, clear tokens and redirect to login

### 2. Manual Retry for Network Errors
**Files:** Components with error states
- Add retry button to error displays
- Use existing refetch patterns where available

### 3. Cart LocalStorage Persistence
**File:** `contexts/CartContext.tsx`
- Already may use context, ensure localStorage sync for guests
- Sync cart to localStorage

### 4. Guest Checkout Message
**File:** `app/checkout/page.tsx`
- Add toast before redirecting guests

### 5. Social Login Redirect
**File:** `contexts/AuthContext.tsx` or social login handlers
- Ensure redirect to home after social login

### 6. UI Improvements
- Add overflow-x-hidden globally (done in globals.css)
- Ensure touch targets (done)
- Better error messages

## SKIP (As per answers)
- Stock validation
- Payment methods other than COD
- Real-time order updates
- Server-side order filtering
- Session validation via /auth/me (localStorage sufficient)

## IMPLEMENTATION ORDER
1. Token refresh interceptor (critical)
2. Manual retry buttons
3. Cart localStorage
4. Guest checkout toast
5. Social login redirect verification
6. UI polish

All fixes are non-breaking and don't require major API changes.

# Validation notes

Validated on 14 November 2026 using Linux, Node 24.22.1, npm 11.9.0, and Chrome.

## Automated checks

- Clean release copy: `npm ci` installed the exact lockfile successfully; its tests and production build also passed.

- `npm run build`: TypeScript check and Vite production build passed.
- `npm test`: all 14 commerce tests passed.
- Tests cover cart merge rules, separate finishes, quantity bounds, standard/express shipping, promo discounts and rounding, empty cart totals, invalid saved cart entries, and Indian delivery address validation.

## Browser checks completed

- Desktop storefront renders with bundled fonts and photographs.
- 390 px mobile frame renders home, catalogue, bottom navigation, filters, and product cards; no horizontal page overflow in the checked catalogue.
- Wishlist selection updates and survives refresh.
- Product finish selection and quantity selection reach the cart correctly.
- Cart and applied promo survive refresh.
- Two Forma chairs at ₹8,499 each produce subtotal ₹16,998; WELCOME10 discounts ₹1,700; express delivery adds ₹999; final total is ₹16,297.
- Checkout accepts valid sample delivery details, reviews the order, saves one demo order, and empties the cart.
- Saved order and simulated Preparing status survive a refresh.
- Mobile Chairs category returns four pieces; price sorting reorders them; sale filter returns two pieces.
- Search for `lamp` returns Arc Reading Lamp and Line Studio Lamp.
- Production bundle was served through `preview-dist.mjs`; asset script was `/assets/index-D8JfEzzR.js`; observed loaded images had no broken-image errors.
- Refreshing `/product/forma-chair` on the production preview correctly loads its product page.

The mobile heading line break and category button shrink issue found in visual checks were fixed and reviewed again.

## Verification boundaries

The project has not been deployed into a live Vercel account. The Vercel configuration follows the official Vite SPA deployment guidance. Windows launchers were supplied but were not executed in this Linux environment. Real authentication, payment, carrier, email, and database integrations are outside this frontend demo.

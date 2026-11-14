# Funica — A little more you.

A complete, responsive **React + TypeScript + Vite furniture storefront demo**, inspired by the supplied Funica mobile UI reference. It includes a desktop storefront and a mobile shopping experience with bottom navigation.

**Runs on Vercel without a backend, database, API keys, or environment variables.** All shopping data lives in browser local storage. Checkout is simulated: no payments, emails, or shipments are created.

## Start locally

1. Install Node.js **22.12 or newer** (Node 22 LTS is recommended).
2. Extract this ZIP completely.
3. Open a terminal in the `funica-furniture` folder that contains `package.json`.
4. Run:

```bash
npm ci
npm run dev
```

Open the Local URL shown in the terminal, normally `http://localhost:5173`.

**Windows shortcut:** double-click `start-local.bat` after installing Node.js. Keep the terminal open while using the app. To stop, press Ctrl+C.

Do not open `index.html` by double-clicking it. Vite must serve the source application.

## Deploy to Vercel

1. Create a GitHub repository, for example `funica-furniture-store`.
2. Upload the **contents of the `funica-furniture` folder**, including `src`, `public`, `package.json`, `package-lock.json`, and `vercel.json`.
3. In Vercel, choose **Add New → Project**, then import that repository.
4. Use these settings:

| Setting               | Value                                             |
| --------------------- | ------------------------------------------------- |
| Framework preset      | Vite                                              |
| Root directory        | `.` when `package.json` is at the repository root |
| Install command       | `npm ci`                                          |
| Build command         | `npm run build`                                   |
| Output directory      | `dist`                                            |
| Node.js version       | 22.x, or a supported version >= 22.12             |
| Environment variables | None                                              |

If you upload the enclosing folder instead of its contents, set the Vercel **Root Directory to `funica-furniture`**. The root directory must contain `package.json`.

5. Deploy. Test `/shop`, a product page, `/cart`, and refreshing a nested URL.

The supplied `vercel.json` sets build/install/output options and the SPA rewrite so direct URLs such as `/product/forma-chair` resolve correctly. Keep it in the project root. Do not set `cleanUrls: true` without adjusting the rewrite.

Official reference: https://vercel.com/docs/frameworks/frontend/vite

### Optional Vercel CLI

From the project folder, after signing into your own Vercel account:

```bash
npx vercel
npx vercel --prod
```

This ZIP is configured and build-tested for deployment. It has not been published to a Vercel account for you.

## Included experience

- Responsive home page, curated collection sections, story page, help centre.
- Twelve sample products across chairs, sofas, tables, lighting, decor, and beds.
- Search dialog and catalogue search, category filters, maximum price, sale/rating filters, and sorting.
- Product details, full-size photo dialog, finish choices, quantity selection, care notes, sample reviews, and related items.
- Persistent wishlist and cart; matching product/finish combinations merge. Each line is limited to 10 units.
- Working promo codes: `WELCOME10` (10%) and `ROOM15` (15%). One code at a time.
- Standard demo delivery: free at subtotal >= ₹15,000, otherwise ₹499. Express: ₹999. Discounts are rounded to integer INR and do not alter the free standard shipping threshold.
- Three-step checkout with Indian address validation, delivery choice, demo payment selection, review, and confirmation.
- Order history, simulated status progression, cancellation before dispatch, and a downloadable text receipt.
- Local profile and delivery-address editor. No password or real sign-in is required.
- Local fonts and photographs, so the deployed site does not depend on third-party image/font requests.
- Native dialog focus trapping, keyboard controls, visible focus states, labelled inputs, image alt text, reduced-motion styles, and empty states.

## Useful commands

```bash
npm run dev       # Development server
npm run build     # Type-check and production build
npm run preview   # Serve the generated dist folder
npm test          # 14 commerce rule tests
```

A ready-built `dist/` is included. To preview it without installing project dependencies, you can use `node preview-dist.mjs` with Node 22.12+. Open `http://localhost:4173`. This preview server includes the SPA fallback; it is only for local preview, not production hosting. All photographs and fonts load from local assets. It does not use a service worker, so it does not promise offline access to an uncached hosted page.

## Project map

| File                      | Purpose                                                     |
| ------------------------- | ----------------------------------------------------------- |
| `src/App.tsx`             | Routes and error boundary                                   |
| `src/components.tsx`      | Navigation, footer, dialogs, product cards, shared controls |
| `src/Home.tsx`            | Storefront home and category tabs                           |
| `src/Catalog.tsx`         | Browse, search, filters, sorting, wishlist                  |
| `src/Product.tsx`         | Product detail and sample reviews                           |
| `src/Checkout.tsx`        | Cart, address form, totals, checkout, confirmation          |
| `src/Account.tsx`         | Local profile, address, orders, receipts, demo tracking     |
| `src/Information.tsx`     | About, help, and demo policies                              |
| `src/data.ts`             | Editable product catalogue, prices, finishes, descriptions  |
| `src/store.tsx`           | Persistent local state and cross-tab synchronization        |
| `src/commerce.mjs`        | Pure pricing, quantity, cart, and address rules             |
| `src/styles.css`          | Responsive styling and locally bundled fonts                |
| `public/images/`          | Bundled photographs                                         |
| `tests/commerce.test.mjs` | Commerce regression checks                                  |
| `vercel.json`             | Vercel configuration and SPA rewrite                        |

## Customise

- Edit names, prices, categories, finishes, and specifications in `src/data.ts`.
- Put your own photos in `public/images` and update each product's `image` key (without `.jpg`).
- Edit brand text in `src/components.tsx`, page copy in the corresponding component, and colours/spacing in `src/styles.css`.
- Update the favicon, page title, and description in `public/favicon.svg` and `index.html`.
- Keep `package-lock.json` committed for reproducible installs. Do not upload `node_modules`.

## Data and demo scope

Browser storage key: `funica-demo-v1`. Cart, wishlist, profile, address, and order history persist on this browser and origin. Open tabs sync through the browser storage event. Data is not shared between different devices, browsers, localhost, and your Vercel domain. Clearing browser site data removes it.

Use sample details while demonstrating checkout. Do not enter real payment information. Payment buttons are explicitly simulated and do not collect card numbers. No authentication, server inventory, payment gateway, admin dashboard, email service, real shipping, or returns workflow is included.

For live commerce, add a secure backend and database, server-authoritative stock/pricing/order validation, real account authentication, a payment provider with server-verified webhooks, and real fulfilment. Local-storage totals and order records are editable by visitors and must never be treated as trusted business records.

Product specifications, review counts, names, prices, policies, and availability are sample content. Bundled photos are illustrative and do not depict every finish variant. This is a responsive web implementation inspired by the reference, not a native Android/iOS app or a pixel-for-pixel implementation of every screen in the reference sheet.

## Troubleshooting

- **Blank page from opening a file:** use `npm run dev` or the bundled preview server; do not open HTML directly.
- **Vercel cannot find package.json:** correct the Root Directory as described above.
- **Nested URLs return 404:** ensure `vercel.json` is committed at the Vercel project root.
- **Missing Vite or dependency errors:** run `npm ci` in the project folder, then retry. Do not install Vite globally.
- **Unsupported engine warning:** update Node to 22.12+.
- **PowerShell blocks npm.ps1:** use Command Prompt or run `npm.cmd ci` and `npm.cmd run dev`.
- **Install network failure:** check your internet connection and npm registry access, then rerun `npm ci`. The included `dist/` can be previewed with `node preview-dist.mjs` without a package installation.
- **Data disappears in private browsing:** browser storage may be temporary or disabled. The app warns when local persistence fails.

See `TESTING.md` for validation notes and `ASSET-CREDITS.md` for image and font information.


# shopping-bill-calculator
=======
# React + TypeScript + Vite
=======
# Shopping Bill Calculator

A React + Redux Toolkit application that lets users select products, apply special offers, and calculate the final bill.

## Tech Stack

- **React 19** with **TypeScript**
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Vitest** + **Testing Library** for unit/integration tests
- **Netlify** for deployment

## Products & Prices

| Product | Price  |
|---------|--------|
| Bread   | £1.10  |
| Milk    | £0.50  |
| Cheese  | £0.90  |
| Soup    | £0.60  |
| Butter  | £1.20  |

## Special Offers

| Offer | Details |
|-------|---------|
| Cheese BOGOF | When you buy a Cheese, you get a second Cheese free! |
| Soup + Bread | When you buy a Soup, you get a half price Bread! |
| Butter Discount | Get a third off Butter! |

## Features

- Add/remove products with quantity controls
- Real-time subtotal calculation
- Checkout flow with order summary dialog
- Special offers automatically applied at checkout
- Saved receipt view showing items, offers applied, and grand total
- Responsive design (mobile + desktop)
- Comprehensive unit and integration tests

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Project Structure

```
src/
├── components/       # React components
│   ├── Header.tsx
│   ├── ProductGrid.tsx
│   ├── ProductCard.tsx
│   ├── BillSummary.tsx
│   ├── CheckoutDialog.tsx
│   └── icons.tsx
├── store/            # Redux store & slices
│   ├── index.ts
│   └── cartSlice.ts
├── hooks/            # Custom hooks
│   └── useCartBill.ts
├── data/             # Product & offer definitions
│   ├── products.ts
│   └── offers.ts
├── utils/            # Utility functions
│   ├── offerEngine.ts
│   └── formatCurrency.ts
├── types/            # TypeScript interfaces
│   └── index.ts
├── test/             # Unit & integration tests
│   ├── cartSlice.test.ts
│   ├── offerEngine.test.ts
│   └── BillSummary.test.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## How It Works

1. **Browse products** — select items from the product grid
2. **Manage quantities** — use +/- controls in the cart
3. **Checkout** — click Checkout to see the order summary with all applicable offers
4. **Save Order** — click Save Order to see the final receipt with:
   - Items purchased
   - Subtotal before offers
   - Special offers applied with individual savings
   - Grand total

## Deployment

Configured for Netlify. Push to the connected GitHub repo and Netlify will auto-deploy.

Manual deploy:

```bash
npm run build
npx netlify deploy --prod --dir=dist
```


# Yarson Portfolio

A modern, responsive portfolio homepage showcasing AI-driven automations and integrations by Yarson. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## ✨ Features

- **Persistent Navigation**: Fixed header with floating navigation that remains visible on scroll
- **Responsive Design**: Optimized for all devices from mobile (320px) to desktop (1440px)
- **Mobile Menu**: Hamburger menu for screens below 640px with smooth animations
- **Accessibility**: WCAG 2.2 AA compliant with keyboard navigation and ARIA labels
- **Performance**: Optimized bundle sizes and Core Web Vitals
- **Type Safety**: Full TypeScript with Zod validation for data structures

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd yarson-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers (for E2E tests):
```bash
npx playwright install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

The page auto-updates as you edit files. You can start by modifying:
- `app/page.tsx` - Main homepage content
- `app/components/` - React components
- `app/globals.css` - Global styles

## 🧪 Testing

This project follows Test-Driven Development (TDD) with comprehensive test coverage.

### Unit Tests

Run unit tests with Vitest:

```bash
npm test              # Run tests in watch mode
npm run test:ui       # Run tests with UI
npm run test:coverage # Run tests with coverage report
```

### E2E Tests

Run end-to-end tests with Playwright:

```bash
npm run test:e2e        # Run E2E tests
npm run test:e2e:ui     # Run E2E tests with UI
npm run test:e2e:debug  # Run E2E tests in debug mode
```

### Test Structure

```
tests/
├── e2e/                    # Playwright E2E tests
│   ├── homepage.spec.ts    # Homepage functionality
│   └── accessibility.spec.ts # Accessibility compliance
├── unit/                   # Vitest unit tests
│   ├── Navigation.test.tsx # Navigation component
│   └── schemas.test.ts     # Zod schema validation
└── setup.ts               # Test setup and configuration
```

## 🏗️ Project Structure

```
app/
├── components/          # React components
│   ├── Header.tsx      # Fixed navigation header
│   ├── Navigation.tsx  # Unified desktop & mobile navigation
│   ├── Footer.tsx      # Footer with links and copyright
│   └── ui/            # shadcn/ui components
├── lib/
│   ├── constants.ts   # Navigation config and constants
│   └── utils.ts       # Utility functions
├── types/
│   ├── components.ts  # Component prop interfaces
│   └── schemas.ts     # Zod validation schemas
├── layout.tsx         # Root layout with Header/Footer
├── page.tsx           # Homepage
└── globals.css        # Global styles

specs/                 # Feature specifications
tests/                # Test files
```

## 📦 Building for Production

Create an optimized production build:

```bash
npm run build
```

The build output will be in the `.next` directory.

### Production Server

Run the production build locally:

```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the production site.

## 🚢 Deployment

### Deploy on Vercel (Recommended)

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new):

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository in Vercel
3. Vercel will automatically detect Next.js and configure the build
4. Your site will be deployed with a production URL

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

### Deploy on Other Platforms

Next.js can be deployed to any platform that supports Node.js:

- **Netlify**: Use the Next.js runtime
- **AWS Amplify**: Configure for Next.js
- **Docker**: Build a Docker image with Node.js
- **Self-hosted**: Use `npm start` with a process manager like PM2

See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for detailed guides.

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animation**: [Framer Motion 12](https://www.framer.com/motion/)
- **Validation**: [Zod 4](https://zod.dev/)
- **Component Library**: [shadcn/ui](https://ui.shadcn.com/)
- **Testing**: 
  - [Vitest](https://vitest.dev/) - Unit tests
  - [React Testing Library](https://testing-library.com/react) - Component tests
  - [Playwright](https://playwright.dev/) - E2E tests
  - [@axe-core/playwright](https://www.npmjs.com/package/@axe-core/playwright) - Accessibility tests

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests (watch mode) |
| `npm run test:ui` | Run unit tests with UI |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:e2e` | Run E2E tests |
| `npm run test:e2e:ui` | Run E2E tests with UI |
| `npm run test:e2e:debug` | Debug E2E tests |

## 🔧 Configuration

### Environment Variables

No environment variables are required for the basic setup. For production deployments, you may want to configure:

- Analytics tracking IDs
- API endpoints (for future features)
- Custom domain settings

### Security Headers

Security headers are configured in `next.config.ts`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Strict-Transport-Security (HSTS)

## 🧑‍💻 Development Workflow

1. **Create a feature branch**: `git checkout -b feature-name`
2. **Write tests first** (TDD approach)
3. **Implement the feature**
4. **Run tests**: `npm test && npm run test:e2e`
5. **Run linter**: `npm run lint`
6. **Build locally**: `npm run build`
7. **Create pull request**

## 📊 Performance

Target metrics (Core Web Vitals):
- **LCP** (Largest Contentful Paint): ≤ 2.5s
- **INP** (Interaction to Next Paint): ≤ 200ms
- **CLS** (Cumulative Layout Shift): ≤ 0.1

Run Lighthouse audits for detailed performance analysis.

## ♿ Accessibility

This project is committed to WCAG 2.2 AA compliance:
- ✅ Keyboard navigation support
- ✅ ARIA labels and landmarks
- ✅ Focus indicators
- ✅ Semantic HTML
- ✅ Automated accessibility testing with axe-core

## 📄 License

Copyright © 2025 Yarson. All rights reserved.

## 🤝 Contributing

Contributions are welcome! Please follow the development workflow above and ensure all tests pass before submitting a pull request.

## 📚 Documentation

For detailed feature specifications, see the `/specs` directory:
- `spec.md` - Feature specification
- `plan.md` - Technical implementation plan
- `data-model.md` - Data structures and validation
- `contracts/` - Component and type contracts
- `tasks.md` - Detailed task breakdown

## 🐛 Troubleshooting

### Tests are failing
- Ensure all dependencies are installed: `npm install`
- For E2E tests, install browsers: `npx playwright install`
- Check that no dev server is running on port 3000

### Build errors
- Clear Next.js cache: `rm -rf .next`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

## 📞 Contact

For questions or support, visit [yarson.dev](https://yarson.dev) or reach out via the Contact page.

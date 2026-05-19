# MintFlow

MintFlow is a premium Web3 platform designed to eliminate gas friction from the blockchain onboarding experience. Powered by our Universal Gas Framework (UGF), MintFlow abstracts away complex network mechanics, allowing users to mint NFTs, earn credentials, and explore multi-chain ecosystems—without ever needing native ETH or MATIC for gas fees.

## Features

- **Gasless Infrastructure**: 100% of transaction fees are handled backend via the UGF engine.
- **Premium Fintech UI**: Beautiful, calm, high-fidelity dark-mode design with fluid 3D elements and smooth animations. 
- **Educational Demo Mode**: Learn how optimistic routing and Zk-attested transactions work through an interactive, animated simulation hub.
- **Interactive Assistant**: Integrated automated chatbot to guide users and answer FAQs directly on the platform.
- **Responsive Architecture**: Fully mobile-optimized, side-menu driven navigation architecture built for scalability.

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Material Symbols (Google Fonts)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. Open `http://localhost:5173` to view it in your browser.

## Project Structure

- `/src/pages`: Main application routes (Landing, Portfolio, Transaction Flow Demo, FAQ, etc.)
- `/src/components/layout`: Global shell elements like Navbar, SideMenu, and Footer.
- `/src/components/ui`: Reusable visual components (Cards, Accordions, Buttons).
- `/public/images`: Pre-rendered 3D assets used throughout the platform.

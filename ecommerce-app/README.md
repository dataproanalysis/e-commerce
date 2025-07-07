# E-Commerce Fullstack App

This is a full-stack eCommerce web application with:

- 🛒 React.js frontend (Vercel deploy-ready)
- 🧠 Node.js + Express backend (Render deploy-ready)
- 🗃 MongoDB for product, user, and order data
- 💳 Stripe for secure payments
- 📩 Gmail email notifications (via nodemailer)

## Setup Instructions

1. Clone the repository
2. Add `.env` files using the `.env.example` templates
3. Start backend and frontend separately (e.g. `npm run dev`)
4. Use Stripe CLI to test webhook: `stripe listen --forward-to localhost:5000/api/webhook`
5. Deploy backend to Render, frontend to Vercel

## Deployment

- Includes `vercel.json` and `render.yaml`
- GitHub Actions deploy Render on `main` push

## Monitoring

- `/api/health` route for Render health checks
- Stripe dashboard logs webhook activity

---
For details, see inline comments in each file.

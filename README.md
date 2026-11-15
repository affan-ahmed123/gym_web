# Ahsan Hussain — Elite Fitness & Nutrition Portfolio

Official portfolio web application for **Ahsan Hussain**, UK Certified Level 1 & 2 Personal Fitness Coach and Rehabilitation Specialist based in Karachi.

## Features
- **Cinematic Hero Section**: Kinetic typography showcasing certifications with dynamic word-write targets and trainer spotlight cutout.
- **Workout Video Carousel**: Interactive video reels featuring hypertrophy, compound lifts, and execution form.
- **Nutrition & Supplements Store**: Showcase and catalog with **3-second auto-slide** and real-time **Shopping Bag Drawer**.
- **WhatsApp Checkout System**: Direct checkout generating formatted order messages with customer details and PKR subtotal sent to Coach Ahsan (`+92 326 2371372`).
- **Client Testimonials**: Verified client reviews stored in MongoDB Atlas with interactive rating submissions and compact landscape cards.
- **Consultation Booking**: Direct consultation lead booking system with email/WhatsApp routing.
- **Trainer Admin Panel**: Secret-triggered modal for real-time review moderation, workout video management, profile photo updates, and nutrition catalog control.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **UI & Styling**: React 19, Tailwind CSS, Lucide Icons
- **Animation**: Framer Motion
- **Database**: MongoDB Atlas with Mongoose
- **Cloud Storage**: Cloudinary (profile & media uploads)

## Getting Started

1. Clone repository:
```bash
git clone https://github.com/affan-ahmed123/gym_web.git
cd gym_web
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables in `.env.local`:
```env
MONGODB_URI=your_mongodb_atlas_uri
ADMIN_PASSWORD=your_secure_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Run development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel
1. Import repository into Vercel.
2. Set Environment Variables (`MONGODB_URI`, `ADMIN_PASSWORD`, Cloudinary keys).
3. Deploy!


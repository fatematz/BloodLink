BloodLink — Blood Donation Platform

A full-stack blood donation platform that connects donors with people in need of blood. Built with Next.js, Express.js, and MongoDB.

 Live URL

 https://blood-link-chi-wine.vercel.app


Purpose

BloodLink aims to make blood donation simple, safe, and meaningful. The platform allows donors to register, find blood requests, and respond to urgent needs — while administrators and volunteers manage the entire process efficiently.

Key Features

- **Role-based Access Control** — Donor, Volunteer, and Admin roles with different permissions
- **Blood Donation Requests** — Create, view, edit, and manage donation requests
- **Donor Search** — Search for donors by blood group, district, and upazila
- **Stripe Payment Integration** — Secure funding/donation via Stripe Checkout
- **JWT Authentication** — Token-based authentication for all private API routes
- **Admin Dashboard** — Manage users, donation requests, and view statistics
- **Volunteer Dashboard** — View and update donation request statuses
- **Responsive Design** — Fully responsive for mobile, tablet, and desktop
- **Profile Management** — Update blood group, district, upazila
- **Real-time Status Updates** — Track donation status (pending → inprogress → done/canceled)

##   User Roles & Capabilities

###  Donor
- Can register and log in
- Can view all pending blood donation requests
- Can create new blood donation requests
- Can edit and delete own donation requests
- Can update donation status (inprogress → done / canceled)
- Can view donation request details and confirm donation
- Can search for donors by blood group, district, and upazila
- Can make funding contributions via Stripe
- Can update own profile (blood group, district, upazila)

###  Volunteer
- All donor capabilities
- Can view and manage all blood donation requests
- Can update donation status of any request
- Cannot delete or edit others' donation requests

### Admin
- All volunteer capabilities
- Can view, edit, and delete all donation requests
- Can manage all users (block/unblock, change roles)
- Can make any user a volunteer or admin
- Can view statistics (total donors, total funding, total requests)
- Can view all funding history

##  Tech Stack

### Frontend
- **Next.js 15** — React framework with App Router
- **Tailwind CSS** — Utility-first styling
- **better-auth** — Authentication
- **Stripe.js** — Payment integration
- **Lucide React** — Icons
- **React Toastify** — Toast notifications

### Backend
- **Express.js** — Node.js web framework
- **MongoDB** — Database with MongoDB Atlas
- **jsonwebtoken (JWT)** — Token-based authentication
- **dotenv** — Environment variable management
- **cors** — Cross-origin resource sharing

##  NPM Packages Used

### Client Side
```
next
react
react-dom
tailwindcss
better-auth
stripe
@stripe/stripe-js
lucide-react
react-toastify
```

### Server Side
```
express
cors
dotenv
mongodb
jsonwebtoken
stripe
```



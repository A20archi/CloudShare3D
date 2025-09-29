

---

# CloudShare3D

**CloudShare3D** is a modern web application for uploading, sharing, and managing videos and images in a 3D-enhanced dashboard. Built with **Next.js**, **React Three Fiber**, **Cloudinary**, **Prisma**, **NeonDB**, and **Clerk**, it offers an interactive media experience with real-time previews, 3D visuals, and secure authentication.

---

## Features

* **User Authentication**: Seamless login/signup powered by [Clerk](https://clerk.com) for secure user management.
* **3D Dashboard**: Stunning 3D torus ring with stardust background using `@react-three/fiber` and `@react-three/drei`.
* **Video Uploads**: Direct-to-Cloudinary video uploads with real-time progress tracking.
* **Image Uploads**: Upload images via Cloudinary and instantly preview them.
* **Media Grid**: Unified media grid displaying both videos and images with download functionality.
* **Responsive UI**: Mobile-friendly interface with smooth animations using TailwindCSS and Framer Motion.
* **File Metadata**: Tracks video duration, original and compressed size, and upload timestamps.
* **Safe Cloud Storage**: Media is securely stored in Cloudinary, ensuring scalable hosting.

---

## Tech Stack

* **Frontend**: Next.js 13, React, TailwindCSS, Framer Motion
* **3D Visualization**: React Three Fiber, Drei
* **Backend**: Next.js API Routes, Prisma ORM
* **Database**: NeonDB (PostgreSQL) via Prisma
* **Authentication**: Clerk
* **Cloud Storage**: Cloudinary (images and videos)

---

## Installation

1. Clone the repo:

```bash
git clone https://github.com/A20archi/CloudShare3D.git
cd CloudShare3D
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root with the following variables:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLERK_FRONTEND_API=your_clerk_frontend_api
CLERK_API_KEY=your_clerk_api_key
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
```

---

## Usage

* Visit `/` to access the home page with the **3D dashboard** and media grid.
* Upload videos at `/video-upload` or images at `/social-share`.
* Preview videos in real-time and download media directly from the grid.
* User authentication ensures each user can manage their own media.

---

## Folder Structure

```
/app
  /home
    page.tsx         # Home page with media grid & dashboard
  /video-upload
    page.tsx         # Video upload page with 3D canvas
  /social-share
    page.tsx         # Image upload page
/componenets
  VideoCard.tsx
  ImageCard.tsx
  Dashboard.tsx
/api
  /video-upload
  /image-upload
  /video-signature
/prisma
  schema.prisma
```

---

## License

This project is **open source** under the [MIT License](LICENSE).

---



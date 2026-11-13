# 🥗 MealBridge – Bridging Surplus to Need

MealBridge is a **community-driven web application** designed to tackle the twin challenges of food waste and hunger by enabling seamless peer-to-peer food donations. Built with **Next.js**, **Firebase**, and **Google Maps**, the platform empowers individuals, local restaurants, canteens, and households to donate surplus or excess food to those in need — from underprivileged families to NGOs and community kitchens.

By streamlining the process of posting, discovering, and claiming food donations, MealBridge not only reduces food going to waste but also fosters a culture of empathy, sustainability, and shared responsibility within neighborhoods.

---

## 🌍 Project Highlights

- **Built With:** Next.js · Firebase · Google Maps  
- **Purpose:** Connect donors (homes, restaurants, canteens) with recipients (families, NGOs, community kitchens)  
- **Features:** Geo-based matching, real-time food listings, secure communications

---

## 💡 How MealBridge Helps Society

| Impact Area                       | Description                                                                                                         |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 🥗 **Reducing Food Waste**         | Tens of thousands of meals are wasted daily. MealBridge helps redirect this food to people who truly need it.       |
| 🤝 **Empowering Communities**      | Anyone can contribute — whether it’s a student with leftovers or a restaurant with surplus meals.                   |
| 🧍 **Supporting the Vulnerable**   | Individuals or families facing food insecurity can easily find available meals nearby without shame or stigma.      |
| 🌐 **Promoting Circular Economy**  | Bridges the gap between abundance and need, promoting a more circular and sustainable local economy.                |
| 📍 **Geo-Based Matching**          | With Google Maps integration, users can find or post donations accurately, making hyperlocal impact possible.       |


---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/rix-04turtle/GDG_2025.git
cd GDG_2025

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🗂️ Project Structure

```
GDG_2025/
├── components/        # UI components
├── pages/             # Next.js routes
├── public/            # Static assets
├── styles/            # CSS
├── utils/             # Utilities
├── .env.local         # Environment variables
├── package.json
```

## 🔒 Environment Variables

Create a `.env.local` file (refer to documentation or codebase for specifics):

```
NEXT_PUBLIC_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_CONFIG=your-firebase-config
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-google-ai-studio-api-key
```

Create a public Supabase Storage bucket named `images` and enable public read access.
Because this application uses Firebase Authentication (not Supabase Auth), Supabase
cannot identify the Firebase user in Storage policies. For this direct browser-upload
implementation, add an insert policy for the `anon` role restricted to the `images`
bucket:

```sql
create policy "Allow image uploads"
on storage.objects
for insert
to anon
with check (bucket_id = 'images');
```

This policy allows anyone with the public application configuration to upload to that
bucket. For a production deployment, move uploads behind a Next.js API route that
verifies the Firebase ID token and uses a server-only Supabase service-role key.
Never put a Supabase service-role key in `.env.local` or client-side code.

Image analysis uses the Gemini Developer API through the server-side
`src/pages/api/analyze-image.js` route. Add `GEMINI_API_KEY` from Google AI Studio to
`.env.local`; do not prefix it with `NEXT_PUBLIC_` because it must not be exposed in
the browser.

---

## 🌐 Deployment

- **Netlify:** [Live Demo](https://mealbridge-gdg2025.netlify.app/)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

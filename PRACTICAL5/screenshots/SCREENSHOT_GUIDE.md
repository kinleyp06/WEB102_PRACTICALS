# WEB102 Practical 5 — Report Screenshots

Screenshots saved in this folder for your report.

## Included (ready to use)

| File | Use in report for |
|------|-------------------|
| `01-home-feed-with-login.png` | Home feed + sidebar (Log in / Sign up visible) |
| `02-login-page.png` | Login page |
| `03-signup-page.png` | Signup / registration page |
| `04-home-logged-in.png` | Logged-in user (Upload, Profile, Logout) |
| `05-upload-page.png` | Upload video form (Supabase upload flow) |
| `06-backend-server-running.png` | Backend API running on port 5000 |

## You should add manually (Supabase dashboard)

I cannot access your Supabase account. Take these from https://supabase.com/dashboard:

1. **Storage buckets** — `videos` and `thumbnails` created
2. **Storage policies** — authenticated upload + public read
3. **Project settings / API keys** — blur or hide secret keys before submitting
4. **A file in Storage** — uploaded video visible in bucket (optional)

## Optional extra screenshots

- `.env` / `.env.local` (use `.env.example` — do not submit real keys)
- VS Code: `storageService.js`, `uploadService.js`, `schema.prisma`
- Terminal: `npm run dev` for frontend + backend
- Browser DevTools → Network tab showing Supabase upload URL on upload

## Suggested report order

1. Supabase setup (buckets + policies)
2. Environment variables
3. Backend code (`supabase.js`, `storageService.js`)
4. Frontend code (`supabase.js`, `uploadService.js`)
5. Login / Signup pages
6. Upload page
7. Home feed with video playing (Supabase URL)
8. Backend server running

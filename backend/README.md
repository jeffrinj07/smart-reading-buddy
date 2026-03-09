# Smart Reading Buddy Backend

This simple Express server provides two endpoints for sending real-time notifications via SMS and email. The frontend can call these APIs when a reading session starts or at other important events.

## Setup

1. **Clone or navigate** into `backend/` directory.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Create a `.env` file** based on `.env.example` and fill in your Twilio and SMTP credentials.
   - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_PHONE` for SMS
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` for email
   - Optionally set `PORT` (defaults to `4000`).

4. **Run the server**:
   ```bash
   npm run dev   # uses nodemon for live reload during development
   # or
   npm start     # production
   ```

The server will start and listen on the configured port (e.g. http://localhost:4000).

## API Endpoints

- `POST /api/send-sms`  – body: `{ phone, message }`
- `POST /api/send-email` – body: `{ email, subject, message }`

Both return JSON `{ success: true }` or error information if the request fails.

> ⚠️ The backend **must** be running and accessible from the frontend. When deploying, configure CORS or host the frontend alongside the backend.

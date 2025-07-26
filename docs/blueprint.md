# **App Name**: MediMate

## Core Features:

- AI Symptom Analysis: Symptom checker: The app will incorporate a tool that attempts to provide a list of likely conditions, and prompt the user for further details where appropriate. Uses GPT API + prompt design or `medsym`/`infermedica` API for structured symptoms.
- Appointment Booking: Allow users to book appointments with healthcare providers via a simple form. Store user data + datetime in Firestore/Mongo. Add calendar integration (e.g., Google Calendar API).
- AI Medical Advice: Medical Advice: The app will incorporate a tool to suggest possible conditions for symptoms, with a warning before showing advice (disclaimer: not a substitute for professional medical advice). Uses GPT with curated prompts: "You are a healthcare assistant. Suggest possible conditions for symptoms. Do not give diagnosis or prescribe medication."
- Health Tips and Reminders: Health Tips and Reminders: Provide general health tips and reminders. Use a cron job or `apscheduler` in Flask. Firebase Cloud Messaging or Twilio for reminders.
- Price Comparison: Price Comparison: Compare medicine prices from different online pharmacies. Use web scraping with `requests + BeautifulSoup` e.g., Scrape **1mg, Netmeds, Apollo** or search for their APIs (some are public/testable).

## Style Guidelines:

- Primary color: Light blue (#7FB5FF), evoking trust and calm.
- Background color: Very light blue (#F0F8FF). This keeps the focus on the content and reinforces the calm feeling of the light blue primary color.
- Accent color: Soft green (#80FF7F) for positive reinforcement in appointment confirmations and health tips.
- Body and headline font: 'PT Sans', sans-serif for a clean, modern, and accessible design, appropriate for a general audience.
- Use clear and recognizable icons for all major functions.
- Clean and intuitive layout to help users easily navigate the app. Incorporate sufficient white space and ensure readability for all users, regardless of device.
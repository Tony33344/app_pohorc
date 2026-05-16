# Apartma Pohorc - Calendar & Booking Setup Guide

## Overview

Your website uses **iCal feeds** from Booking.com and Airbnb to display availability calendars for each apartment. The camper uses **Supabase** for manual date management.

---

## Current Calendar Setup

### Apartments with iCal Integration (Automatic Sync)

| Apartment | Booking.com iCal | Airbnb iCal |
|-----------|------------------|-------------|
| **Macesen** | ✅ Connected | ✅ Connected |
| **Praprot** | ✅ Connected | ✅ Connected |
| **Kostanj** | ❌ Needs Setup | ❌ Needs Setup |
| **Camper** | Uses Supabase (manual) | N/A |

---

## Step-by-Step: Connect Kostanj Calendar

### Step 1: Get Booking.com iCal URL

1. Log in to your **Booking.com Extranet**: https://admin.booking.com
2. Go to **Property** → **Kostanj**
3. Navigate to **Rates & Availability** → **Calendar**
4. Click on **Sync calendars** or **iCal export**
5. Copy the **Export URL** (looks like: `https://ical.booking.com/v1/export?t=YOUR_TOKEN`)

### Step 2: Get Airbnb iCal URL (if listed on Airbnb)

1. Log in to **Airbnb Host**: https://www.airbnb.com/hosting
2. Go to **Calendar** for Kostanj listing
3. Click **Availability settings** → **Connect calendars**
4. Click **Export Calendar**
5. Copy the **iCal link** (looks like: `https://www.airbnb.com/calendar/ical/LISTING_ID.ics?s=TOKEN`)

### Step 3: Update the Code

Edit the file: `src/components/BookingCalendar.tsx`

Find this section (around line 43):
```typescript
case 'kostanj':
  return {
    airbnb: null,
    booking: `${CORS_PROXY}${encodeURIComponent('https://ical.booking.com/v1/export?t=kostanj-placeholder')}`
  };
```

Replace with your actual URLs:
```typescript
case 'kostanj':
  return {
    airbnb: `${CORS_PROXY}${encodeURIComponent('YOUR_AIRBNB_ICAL_URL_HERE')}`,
    booking: `${CORS_PROXY}${encodeURIComponent('YOUR_BOOKING_ICAL_URL_HERE')}`
  };
```

**Example with real URLs:**
```typescript
case 'kostanj':
  return {
    airbnb: `${CORS_PROXY}${encodeURIComponent('https://www.airbnb.com/calendar/ical/1234567890.ics?s=abc123')}`,
    booking: `${CORS_PROXY}${encodeURIComponent('https://ical.booking.com/v1/export?t=your-kostanj-token')}`
  };
```

---

## Existing iCal URLs (for reference)

### Macesen
- **Airbnb**: `https://www.airbnb.com/calendar/ical/1339839044164896422.ics?s=11cf547d0c878e58aa42a38560da0718`
- **Booking**: `https://ical.booking.com/v1/export?t=cda796c1-1ddc-41f3-908b-fd52301167d4`

### Praprot
- **Airbnb**: `https://www.airbnb.com/calendar/ical/1339847873413518084.ics?s=22f2790450cc99126096673433300b1c`
- **Booking**: `https://ical.booking.com/v1/export?t=834817fb-29f9-43c1-9436-fd239860aa08`

---

## Camper Calendar (Supabase)

The camper uses a **Supabase database** for manual availability management.

### Admin Access
- URL: `https://apartma-pohorc.com?admin=true`
- This opens the admin panel where you can add/remove unavailable dates for the camper

### Supabase Dashboard
- URL: https://supabase.com/dashboard/project/gdqipzgfwogoagaszyab
- Table: `camper_unavailable_dates`

---

## Deployment Steps

### 1. Build the Project
```bash
cd "/home/jack/Documents/bolt/apartma pohorc/backup/zadnje nalozi/project_s01yis_so3ao2"
npm run build
```

### 2. Upload to Hosting
Upload the contents of the `dist/` folder to your web hosting (e.g., via FTP or your hosting control panel).

### 3. Verify
- Visit https://www.apartma-pohorc.com
- Check all 4 apartments display correctly
- Test the calendar on each apartment page
- Test the booking/reservation form

---

## Troubleshooting

### Calendar shows "Error loading calendar"
- Check if the iCal URLs are correct
- The CORS proxy (`api.allorigins.win`) might be temporarily down
- Try refreshing the page

### Images not loading
- Check if the image URLs are accessible
- Booking.com image URLs can expire - get fresh ones from the listing

### Booking form not sending emails
- Check the EmailJS configuration in `ReservationForm.tsx`
- Verify EmailJS service is active

---

## File Structure

```
src/
├── components/
│   ├── BookingCalendar.tsx    # Calendar with iCal integration
│   ├── BookButton.tsx         # Reservation button
│   └── ReservationForm.tsx    # Email booking form
├── data/
│   └── apartments.ts          # Apartment data (images, prices, descriptions)
├── pages/
│   ├── MacesenPage.tsx
│   ├── PraprotPage.tsx
│   ├── KostanjPage.tsx        # NEW apartment page
│   └── CamperPage.tsx
└── lib/
    └── supabase.ts            # Supabase client for camper dates
```

---

## Contact

For technical support, refer to this guide or contact your web developer.

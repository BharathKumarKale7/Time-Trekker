export function generateItinerary(places, hours) {
  if (!places?.length || !hours) return [];
  const sorted = [...places].sort(
    (a, b) => (b.rating ?? 0) * (b.userRatingsTotal ?? 0) - (a.rating ?? 0) * (a.userRatingsTotal ?? 0)
  );
  return sorted.slice(0, Math.max(1, Math.min(sorted.length, Math.round(hours))));
}

/* === src/constants/text.js === */
export const HERO_TITLE = "TimeTrekker";
export const HERO_SUB = "Smart, personalized travel itineraries for any stopover or short trip.";
export const CTA_TEXT = "Start Free Now";

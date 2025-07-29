// Assumption: average time per place = 1 hour
export function generateItinerary(places, hours) {
  if (!places?.length || !hours) return [];

  // Sort by rating and reviews
  const sorted = [...places].sort(
    (a, b) =>
      (b.rating ?? 0) * (b.userRatingsTotal ?? 0) -
      (a.rating ?? 0) * (a.userRatingsTotal ?? 0)
  );

  // Select top N places based on time
  const itinerary = sorted.slice(0, hours);

  return itinerary;
}

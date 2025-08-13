export function generateItinerary(places, hours) {
  // Return empty array if no places or hours provided
  if (!places?.length || !hours) return [];

  // Create a sorted copy of places based on popularity score:
  // popularity = rating * number of user ratings
  // Default to 0 if rating or userRatingsTotal is missing
  const sorted = [...places].sort(
    (a, b) =>
      (b.rating ?? 0) * (b.userRatingsTotal ?? 0) - (a.rating ?? 0) * (a.userRatingsTotal ?? 0)
  );

  // Calculate the number of places to include:
  // Round hours to nearest integer, clamp between 1 and total places
  const count = Math.max(1, Math.min(sorted.length, Math.round(hours)));

  // Return top 'count' places from sorted list
  return sorted.slice(0, count);
}
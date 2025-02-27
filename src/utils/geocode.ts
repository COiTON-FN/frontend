// export async function searchLocations(query: string) {
//   const response = await fetch(
//     `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//       query
//     )}&limit=5`
//   );
//   const data = await response.json();

//   return data.map((item: any) => ({
//     name: item.display_name,
//     latitude: parseFloat(item.lat),
//     longitude: parseFloat(item.lon),
//   }));
// }

export async function geocodeLocation(
  country: string,
  location: string
): Promise<[number, number]> {
  try {
    const query = `${location}, ${country}`;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}`
    );
    const data = await response.json();

    if (data && data[0]) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }

    throw new Error("Location not found");
  } catch (error) {
    console.error("Geocoding error:", error);
    return [51.505, -0.09]; // Default to London coordinates
  }
}

export async function searchLocations(country: string, query: string) {
  if (!query) return [];

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        new URLSearchParams({
          q: `${query}, ${country}`,
          format: "json",
          limit: "5",
          addressdetails: "1",
        })
    );

    const data = await response.json();

    return data.map((item: any) => ({
      id: item.place_id,
      name: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
    }));
  } catch (error) {
    console.error("Error searching locations:", error);
    return [];
  }
}

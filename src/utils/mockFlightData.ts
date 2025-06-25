
import { Flight, SearchData } from "@/types/flight";

const airlines = [
  { name: "Delta Airlines", code: "DL", logo: "🔵" },
  { name: "American Airlines", code: "AA", logo: "🔴" },
  { name: "United Airlines", code: "UA", logo: "🟦" },
  { name: "JetBlue Airways", code: "B6", logo: "🔷" },
  { name: "Southwest Airlines", code: "WN", logo: "🟧" },
  { name: "Emirates", code: "EK", logo: "🟡" },
  { name: "British Airways", code: "BA", logo: "🔴" },
  { name: "Lufthansa", code: "LH", logo: "🟨" },
  { name: "Air France", code: "AF", logo: "🔵" },
  { name: "Singapore Airlines", code: "SQ", logo: "🟦" }
];

const aircraft = [
  "Boeing 737-800",
  "Boeing 777-300ER", 
  "Airbus A320",
  "Airbus A350-900",
  "Boeing 787-9",
  "Airbus A330-300",
  "Boeing 757-200",
  "Embraer E175"
];

const cities = [
  { name: "New York", code: "NYC" },
  { name: "Los Angeles", code: "LAX" },
  { name: "London", code: "LON" },
  { name: "Paris", code: "PAR" },
  { name: "Dubai", code: "DXB" },
  { name: "Tokyo", code: "TOK" },
  { name: "Sydney", code: "SYD" },
  { name: "Singapore", code: "SIN" },
  { name: "Frankfurt", code: "FRA" },
  { name: "Amsterdam", code: "AMS" }
];

const stopCities = [
  "Atlanta", "Chicago", "Denver", "Dallas", "Phoenix", "Miami", "Seattle",
  "Istanbul", "Doha", "Frankfurt", "Amsterdam", "Vienna", "Zurich"
];

export const searchFlights = (searchData: SearchData): Flight[] => {
  // Generate 15-25 random flights
  const flightCount = Math.floor(Math.random() * 10) + 15;
  const flights: Flight[] = [];

  for (let i = 0; i < flightCount; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const stops = Math.random() < 0.3 ? 0 : Math.random() < 0.7 ? 1 : Math.random() < 0.9 ? 2 : 3;
    const duration = stops === 0 ? 
      Math.random() * 8 + 2 : // Direct: 2-10 hours
      Math.random() * 12 + 8; // With stops: 8-20 hours

    // Price calculation based on various factors
    let basePrice = Math.random() * 800 + 200; // $200-$1000 base
    
    // Adjust for stops (direct flights cost more)
    if (stops === 0) basePrice *= 1.3;
    
    // Adjust for class
    const flightClass = Math.random() < 0.7 ? 'economy' : 
                       Math.random() < 0.8 ? 'premium' :
                       Math.random() < 0.9 ? 'business' : 'first';
    
    switch (flightClass) {
      case 'premium': basePrice *= 1.5; break;
      case 'business': basePrice *= 3; break;
      case 'first': basePrice *= 5; break;
    }

    // Generate times
    const departureHour = Math.floor(Math.random() * 24);
    const departureMinute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
    const arrivalTime = new Date();
    arrivalTime.setHours(departureHour);
    arrivalTime.setMinutes(departureMinute);
    arrivalTime.setTime(arrivalTime.getTime() + duration * 60 * 60 * 1000);

    const flight: Flight = {
      id: `flight-${i}`,
      airline: airline.name,
      airlineCode: airline.code,
      airlineLogo: airline.logo,
      origin: searchData.origin || "New York",
      destination: searchData.destination || "Los Angeles", 
      originCode: "NYC",
      destinationCode: "LAX",
      departureTime: `${departureHour.toString().padStart(2, '0')}:${departureMinute.toString().padStart(2, '0')}`,
      arrivalTime: `${arrivalTime.getHours().toString().padStart(2, '0')}:${arrivalTime.getMinutes().toString().padStart(2, '0')}`,
      duration: Math.round(duration * 10) / 10,
      stops,
      stopCities: stops > 0 ? 
        Array.from({length: stops}, () => 
          stopCities[Math.floor(Math.random() * stopCities.length)]
        ) : undefined,
      price: Math.round(basePrice),
      currency: "USD",
      aircraft: aircraft[Math.floor(Math.random() * aircraft.length)],
      flightNumber: `${airline.code}${Math.floor(Math.random() * 9000) + 1000}`,
      departureDate: searchData.departureDate || new Date().toISOString(),
      class: flightClass as 'economy' | 'premium' | 'business' | 'first'
    };

    flights.push(flight);
  }

  // Sort by price (lowest first)
  return flights.sort((a, b) => a.price - b.price);
};

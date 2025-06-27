
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { CalendarIcon, Search, Users, ArrowLeftRight, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import AirportAutocomplete from "./AirportAutocomplete";

interface SearchFormProps {
  onSearch: (data: any) => void;
  isSearching: boolean;
}

const SearchForm = ({ onSearch, isSearching }: SearchFormProps) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState("1");
  const [tripType, setTripType] = useState("round-trip");
  const [flightClass, setFlightClass] = useState("economy");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !departureDate) return;

    onSearch({
      origin,
      destination,
      departureDate: departureDate.toISOString(),
      returnDate: returnDate?.toISOString(),
      passengers: parseInt(passengers),
      class: flightClass,
      tripType
    });
  };

  const popularCities = [
    { code: "NYC", name: "New York", flag: "🇺🇸" },
    { code: "LON", name: "London", flag: "🇬🇧" },
    { code: "PAR", name: "Paris", flag: "🇫🇷" },
    { code: "DXB", name: "Dubai", flag: "🇦🇪" },
    { code: "TOK", name: "Tokyo", flag: "🇯🇵" },
    { code: "SYD", name: "Sydney", flag: "🇦🇺" }
  ];

  const swapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
    <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-xl border-0 rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip Type and Class Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trip-type" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Trip Type
            </Label>
            <Select value={tripType} onValueChange={setTripType}>
              <SelectTrigger className="h-11 bg-white border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="round-trip">🔄 Round Trip</SelectItem>
                <SelectItem value="one-way">➡️ One Way</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="class" className="text-sm font-medium text-gray-700">Class</Label>
            <Select value={flightClass} onValueChange={setFlightClass}>
              <SelectTrigger className="h-11 bg-white border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">💺 Economy</SelectItem>
                <SelectItem value="premium">🎫 Premium Economy</SelectItem>
                <SelectItem value="business">💼 Business</SelectItem>
                <SelectItem value="first">👑 First Class</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="passengers" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Passengers
            </Label>
            <Select value={passengers} onValueChange={setPassengers}>
              <SelectTrigger className="h-11 bg-white border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7,8,9].map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'Passenger' : 'Passengers'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location and Date Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
          {/* Origin */}
          <div className="space-y-2">
            <AirportAutocomplete
              label="From"
              placeholder="Origin city"
              value={origin}
              onChange={setOrigin}
              icon="origin"
              required
            />
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={swapLocations}
              className="h-11 w-11 rounded-full bg-blue-50 border-blue-200 hover:bg-blue-100"
            >
              <ArrowLeftRight className="w-4 h-4 text-blue-600" />
            </Button>
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <AirportAutocomplete
              label="To"
              placeholder="Destination city"
              value={destination}
              onChange={setDestination}
              icon="destination"
              required
            />
          </div>

          {/* Departure Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Departure</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-11 justify-start text-left font-normal bg-white border-gray-200",
                    !departureDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                  {departureDate ? format(departureDate, "MMM dd") : "Select"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={departureDate}
                  onSelect={setDepartureDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Return Date */}
          {tripType === 'round-trip' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Return</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-11 justify-start text-left font-normal bg-white border-gray-200",
                      !returnDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                    {returnDate ? format(returnDate, "MMM dd") : "Select"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={setReturnDate}
                    disabled={(date) => date < (departureDate || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Popular Destinations */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">✈️ Popular Destinations</Label>
          <div className="flex flex-wrap gap-2">
            {popularCities.map((city) => (
              <Button
                key={city.code}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDestination(city.name)}
                className="text-xs hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <span className="mr-1">{city.flag}</span>
                {city.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Search Button */}
        <Button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-semibold text-base rounded-lg shadow-lg transition-all duration-300"
          disabled={isSearching || !origin || !destination || !departureDate}
        >
          {isSearching ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Searching Flights...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Flights
            </div>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default SearchForm;

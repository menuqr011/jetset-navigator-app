
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { CalendarIcon, Search, Users, Plane } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
    { code: "NYC", name: "New York" },
    { code: "LON", name: "London" },
    { code: "PAR", name: "Paris" },
    { code: "DXB", name: "Dubai" },
    { code: "TOK", name: "Tokyo" },
    { code: "SYD", name: "Sydney" }
  ];

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-xl border-0">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip Type and Class Selection */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-48">
            <Label htmlFor="trip-type" className="text-sm font-medium text-gray-700">Trip Type</Label>
            <Select value={tripType} onValueChange={setTripType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="round-trip">Round Trip</SelectItem>
                <SelectItem value="one-way">One Way</SelectItem>
                <SelectItem value="multi-city">Multi City</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-w-48">
            <Label htmlFor="class" className="text-sm font-medium text-gray-700">Class</Label>
            <Select value={flightClass} onValueChange={setFlightClass}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">Economy</SelectItem>
                <SelectItem value="premium">Premium Economy</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="first">First Class</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-32">
            <Label htmlFor="passengers" className="text-sm font-medium text-gray-700">Passengers</Label>
            <Select value={passengers} onValueChange={setPassengers}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7,8,9].map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {num} {num === 1 ? 'Passenger' : 'Passengers'}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location and Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Origin */}
          <div className="space-y-2">
            <Label htmlFor="origin" className="text-sm font-medium text-gray-700">From</Label>
            <div className="relative">
              <Plane className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="origin"
                placeholder="Origin city"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination" className="text-sm font-medium text-gray-700">To</Label>
            <div className="relative">
              <Plane className="absolute left-3 top-3 w-4 h-4 text-gray-400 rotate-90" />
              <Input
                id="destination"
                placeholder="Destination city"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Departure Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Departure</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !departureDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {departureDate ? format(departureDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={departureDate}
                  onSelect={setDepartureDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
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
                      "w-full justify-start text-left font-normal",
                      !returnDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {returnDate ? format(returnDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={setReturnDate}
                    disabled={(date) => date < (departureDate || new Date())}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Popular Destinations */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Popular Destinations</Label>
          <div className="flex flex-wrap gap-2">
            {popularCities.map((city) => (
              <Button
                key={city.code}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDestination(city.name)}
                className="text-xs hover:bg-blue-50 hover:border-blue-200"
              >
                {city.code} - {city.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Search Button */}
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
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

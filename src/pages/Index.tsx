import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import FlightResults from "@/components/FlightResults";
import FilterSidebar from "@/components/FilterSidebar";
import CredentialsModal from "@/components/CredentialsModal";
import { Flight, SearchFilters } from "@/types/flight";
import { amadeusAPI, AmadeusCredentials } from "@/services/amadeusApi";
import { transformAmadeusToFlights } from "@/utils/amadeusTransformer";
import { Plane, Settings, Star, TrendingUp, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [credentials, setCredentials] = useState<AmadeusCredentials | null>(() => {
    const saved = localStorage.getItem('amadeus_credentials');
    return saved ? JSON.parse(saved) : null;
  });
  const [filters, setFilters] = useState<SearchFilters>({
    maxPrice: 2000,
    airlines: [],
    maxStops: 3,
    maxDuration: 24,
    departureTimeRanges: [],
    travelClasses: [],
    directFlightsOnly: false
  });
  const { toast } = useToast();

  const handleCredentialsSave = (newCredentials: AmadeusCredentials) => {
    setCredentials(newCredentials);
    localStorage.setItem('amadeus_credentials', JSON.stringify(newCredentials));
    toast({
      title: "Credentials saved",
      description: "Your Amadeus API credentials have been saved locally.",
    });
  };

  const getAirportCode = (cityName: string): string => {
    const cityToCode: Record<string, string> = {
      'new york': 'JFK',
      'los angeles': 'LAX',
      'london': 'LHR',
      'paris': 'CDG',
      'dubai': 'DXB',
      'tokyo': 'NRT',
      'sydney': 'SYD',
      'singapore': 'SIN',
      'frankfurt': 'FRA',
      'amsterdam': 'AMS',
      'mumbai': 'BOM',
      'delhi': 'DEL',
    };
    
    const normalized = cityName.toLowerCase().trim();
    return cityToCode[normalized] || cityName.toUpperCase().slice(0, 3);
  };

  const handleSearch = async (searchData: any) => {
    if (!credentials) {
      setShowCredentialsModal(true);
      toast({
        title: "API Credentials Required",
        description: "Please enter your Amadeus API credentials to search flights.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const originCode = getAirportCode(searchData.origin);
      const destinationCode = getAirportCode(searchData.destination);
      
      const searchParams = {
        originLocationCode: originCode,
        destinationLocationCode: destinationCode,
        departureDate: new Date(searchData.departureDate).toISOString().split('T')[0],
        returnDate: searchData.returnDate ? new Date(searchData.returnDate).toISOString().split('T')[0] : undefined,
        adults: searchData.passengers || 1,
        travelClass: searchData.class?.toUpperCase(),
        max: 20
      };

      console.log('Searching flights with params:', searchParams);
      
      const amadeusResponse = await amadeusAPI.searchFlights(searchParams, credentials);
      const transformedFlights = transformAmadeusToFlights(amadeusResponse);
      
      setFlights(transformedFlights);
      
      toast({
        title: "Flights found!",
        description: `Found ${transformedFlights.length} flights for your search.`,
      });
    } catch (error) {
      console.error('Flight search error:', error);
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "Failed to search flights. Please check your API credentials.",
        variant: "destructive",
      });
      setFlights([]);
    } finally {
      setIsSearching(false);
    }
  };

  const filteredFlights = flights.filter(flight => {
    if (flight.price > filters.maxPrice) return false;
    if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) return false;
    if (flight.stops > filters.maxStops) return false;
    if (flight.duration > filters.maxDuration) return false;
    if (filters.directFlightsOnly && flight.stops > 0) return false;
    if (filters.travelClasses && filters.travelClasses.length > 0 && !filters.travelClasses.includes(flight.class)) return false;
    
    if (filters.departureTimeRanges && filters.departureTimeRanges.length > 0) {
      const departureHour = new Date(`2000-01-01T${flight.departureTime}`).getHours();
      const matchesTimeRange = filters.departureTimeRanges.some(range => {
        switch (range) {
          case 'early': return departureHour >= 6 && departureHour < 12;
          case 'afternoon': return departureHour >= 12 && departureHour < 18;
          case 'evening': return departureHour >= 18 && departureHour < 24;
          case 'night': return departureHour >= 0 && departureHour < 6;
          default: return true;
        }
      });
      if (!matchesTimeRange) return false;
    }
    
    return true;
  });

  const features = [
    {
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      title: "Best Price Guarantee",
      description: "Find the lowest prices from hundreds of airlines worldwide"
    },
    {
      icon: <Shield className="w-6 h-6 text-green-500" />,
      title: "Secure Booking",
      description: "Your payment and personal information is always protected"
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      title: "24/7 Support",
      description: "Get help whenever you need it with our round-the-clock support"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
      title: "Smart Recommendations",
      description: "AI-powered suggestions to help you find the perfect flight"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50">
      {/* Enhanced Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-sky-600 rounded-xl shadow-lg">
                <Plane className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                  JetSet Navigator
                </h1>
                <p className="text-sm text-gray-500">Find your perfect flight</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowCredentialsModal(true)}
              className="flex items-center gap-2 hover:bg-blue-50 transition-colors"
            >
              <Settings className="w-4 h-4" />
              API Settings
              {credentials && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
              Flight Deal
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Search real-time flights using Amadeus API and compare prices from hundreds of airlines. 
            Book with confidence and save on your next adventure.
          </p>
        </div>

        {/* Enhanced Features Grid */}
        {!hasSearched && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 rounded-lg mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        )}

        {/* Enhanced Search Form */}
        <div className="max-w-6xl mx-auto mb-8">
          <SearchForm onSearch={handleSearch} isSearching={isSearching} />
        </div>
      </section>

      {/* Results Section */}
      {hasSearched && (
        <section className="container mx-auto px-4 pb-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <FilterSidebar 
                filters={filters} 
                onFiltersChange={setFilters}
                flights={flights}
              />
            </div>

            {/* Flight Results */}
            <div className="flex-1">
              <FlightResults 
                flights={filteredFlights} 
                isLoading={isSearching}
                totalResults={flights.length}
                filteredResults={filteredFlights.length}
              />
            </div>
          </div>
        </section>
      )}

      {/* Credentials Modal */}
      <CredentialsModal
        isOpen={showCredentialsModal}
        onClose={() => setShowCredentialsModal(false)}
        onSave={handleCredentialsSave}
        currentCredentials={credentials || undefined}
      />
    </div>
  );
};

export default Index;

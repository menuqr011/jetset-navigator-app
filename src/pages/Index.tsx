
import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import FlightResults from "@/components/FlightResults";
import FilterSidebar from "@/components/FilterSidebar";
import { Flight, SearchFilters } from "@/types/flight";
import { searchFlights } from "@/utils/mockFlightData";
import { Plane } from "lucide-react";

const Index = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    maxPrice: 2000,
    airlines: [],
    maxStops: 3,
    maxDuration: 24
  });

  const handleSearch = async (searchData: any) => {
    setIsSearching(true);
    setHasSearched(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const results = searchFlights(searchData);
    setFlights(results);
    setIsSearching(false);
  };

  const filteredFlights = flights.filter(flight => {
    return (
      flight.price <= filters.maxPrice &&
      (filters.airlines.length === 0 || filters.airlines.includes(flight.airline)) &&
      flight.stops <= filters.maxStops &&
      flight.duration <= filters.maxDuration
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
              JetSet Navigator
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect Flight
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Search millions of flights and compare prices from hundreds of airlines to get the best deals
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-6xl mx-auto mb-8">
          <SearchForm onSearch={handleSearch} isSearching={isSearching} />
        </div>
      </section>

      {/* Results Section */}
      {hasSearched && (
        <section className="container mx-auto px-4 pb-12">
          <div className="flex flex-col lg:flex-row gap-6">
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
    </div>
  );
};

export default Index;

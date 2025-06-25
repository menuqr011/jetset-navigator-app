
import { Flight } from "@/types/flight";
import FlightCard from "./FlightCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter } from "lucide-react";

interface FlightResultsProps {
  flights: Flight[];
  isLoading: boolean;
  totalResults: number;
  filteredResults: number;
}

const FlightResults = ({ flights, isLoading, totalResults, filteredResults }: FlightResultsProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <div className="text-right space-y-2">
                <Skeleton className="h-6 w-20 ml-auto" />
                <Skeleton className="h-4 w-16 ml-auto" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (flights.length === 0 && totalResults > 0) {
    return (
      <Card className="p-12 text-center">
        <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No flights match your filters</h3>
        <p className="text-gray-500">Try adjusting your price range, airlines, or other filters to see more results.</p>
      </Card>
    );
  }

  if (flights.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No flights found</h3>
        <p className="text-gray-500">Try searching for a different route or date.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {filteredResults} flight{filteredResults !== 1 ? 's' : ''} found
          </h3>
          {filteredResults !== totalResults && (
            <p className="text-sm text-gray-500">
              Showing {filteredResults} of {totalResults} total results
            </p>
          )}
        </div>
        <div className="text-sm text-gray-500">
          Sorted by price (lowest first)
        </div>
      </div>

      {/* Flight Cards */}
      <div className="space-y-4">
        {flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
      </div>
    </div>
  );
};

export default FlightResults;

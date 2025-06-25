
import { useState } from "react";
import { Flight, SearchFilters } from "@/types/flight";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Filter, RotateCcw } from "lucide-react";

interface FilterSidebarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  flights: Flight[];
}

const FilterSidebar = ({ filters, onFiltersChange, flights }: FilterSidebarProps) => {
  // Get unique airlines from flights
  const airlines = Array.from(new Set(flights.map(f => f.airline))).sort();
  
  // Get price range from flights
  const priceRange = flights.length > 0 ? {
    min: Math.min(...flights.map(f => f.price)),
    max: Math.max(...flights.map(f => f.price))
  } : { min: 0, max: 2000 };

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({ ...filters, maxPrice: value[0] });
  };

  const handleAirlineChange = (airline: string, checked: boolean) => {
    const newAirlines = checked 
      ? [...filters.airlines, airline]
      : filters.airlines.filter(a => a !== airline);
    onFiltersChange({ ...filters, airlines: newAirlines });
  };

  const handleStopsChange = (value: number[]) => {
    onFiltersChange({ ...filters, maxStops: value[0] });
  };

  const handleDurationChange = (value: number[]) => {
    onFiltersChange({ ...filters, maxDuration: value[0] });
  };

  const resetFilters = () => {
    onFiltersChange({
      maxPrice: priceRange.max,
      airlines: [],
      maxStops: 3,
      maxDuration: 24
    });
  };

  const activeFiltersCount = 
    (filters.maxPrice < priceRange.max ? 1 : 0) +
    filters.airlines.length +
    (filters.maxStops < 3 ? 1 : 0) +
    (filters.maxDuration < 24 ? 1 : 0);

  return (
    <Card className="p-6 h-fit sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetFilters}
            className="text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Price Range
          </Label>
          <div className="px-2">
            <Slider
              value={[filters.maxPrice]}
              onValueChange={handlePriceChange}
              max={priceRange.max}
              min={priceRange.min}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>${priceRange.min.toLocaleString()}</span>
              <span className="font-medium text-blue-600">
                Up to ${filters.maxPrice.toLocaleString()}
              </span>
              <span>${priceRange.max.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Airlines */}
        {airlines.length > 0 && (
          <>
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Airlines
              </Label>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {airlines.map((airline) => {
                  const airlineFlights = flights.filter(f => f.airline === airline);
                  const minPrice = Math.min(...airlineFlights.map(f => f.price));
                  
                  return (
                    <div key={airline} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={airline}
                          checked={filters.airlines.includes(airline)}
                          onCheckedChange={(checked) => 
                            handleAirlineChange(airline, checked as boolean)
                          }
                        />
                        <Label 
                          htmlFor={airline} 
                          className="text-sm font-normal cursor-pointer"
                        >
                          {airline}
                        </Label>
                      </div>
                      <span className="text-xs text-gray-500">
                        from ${minPrice.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />
          </>
        )}

        {/* Stops */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Maximum Stops
          </Label>
          <div className="px-2">
            <Slider
              value={[filters.maxStops]}
              onValueChange={handleStopsChange}
              max={3}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Direct</span>
              <span className="font-medium text-blue-600">
                {filters.maxStops === 0 ? 'Direct only' : 
                 filters.maxStops === 1 ? 'Up to 1 stop' : 
                 `Up to ${filters.maxStops} stops`}
              </span>
              <span>3+ stops</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Duration */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Maximum Duration
          </Label>
          <div className="px-2">
            <Slider
              value={[filters.maxDuration]}
              onValueChange={handleDurationChange}
              max={24}
              min={2}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>2h</span>
              <span className="font-medium text-blue-600">
                Up to {filters.maxDuration}h
              </span>
              <span>24h+</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FilterSidebar;

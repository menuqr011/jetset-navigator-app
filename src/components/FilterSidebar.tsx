
import { useState } from "react";
import { Flight, SearchFilters } from "@/types/flight";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Filter, RotateCcw, ChevronDown, Clock, Plane, DollarSign, Users } from "lucide-react";

interface FilterSidebarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  flights: Flight[];
}

const FilterSidebar = ({ filters, onFiltersChange, flights }: FilterSidebarProps) => {
  const [openSections, setOpenSections] = useState({
    price: true,
    airlines: true,
    stops: true,
    duration: true,
    departure: false,
    class: false
  });

  // Get unique airlines with flight counts and price ranges
  const airlinesData = Array.from(new Set(flights.map(f => f.airline)))
    .map(airline => {
      const airlineFlights = flights.filter(f => f.airline === airline);
      return {
        name: airline,
        count: airlineFlights.length,
        minPrice: Math.min(...airlineFlights.map(f => f.price)),
        code: airlineFlights[0]?.airlineCode || airline.slice(0, 2).toUpperCase()
      };
    })
    .sort((a, b) => a.minPrice - b.minPrice);

  // Get price range from flights
  const priceRange = flights.length > 0 ? {
    min: Math.min(...flights.map(f => f.price)),
    max: Math.max(...flights.map(f => f.price))
  } : { min: 0, max: 2000 };

  // Get departure time ranges
  const departureTimeRanges = [
    { label: "Early Morning", value: "early", time: "6:00 AM - 12:00 PM", icon: "🌅" },
    { label: "Afternoon", value: "afternoon", time: "12:00 PM - 6:00 PM", icon: "☀️" },
    { label: "Evening", value: "evening", time: "6:00 PM - 12:00 AM", icon: "🌆" },
    { label: "Night", value: "night", time: "12:00 AM - 6:00 AM", icon: "🌙" }
  ];

  const travelClasses = [
    { label: "Economy", value: "economy", icon: "💺" },
    { label: "Premium Economy", value: "premium", icon: "🎫" },
    { label: "Business", value: "business", icon: "💼" },
    { label: "First Class", value: "first", icon: "👑" }
  ];

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

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

  const FilterSection = ({ 
    title, 
    icon, 
    isOpen, 
    onToggle, 
    children, 
    activeCount 
  }: { 
    title: string; 
    icon: React.ReactNode; 
    isOpen: boolean; 
    onToggle: () => void; 
    children: React.ReactNode;
    activeCount?: number;
  }) => (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-gray-700">{title}</span>
          {activeCount && activeCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeCount}
            </Badge>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );

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

      <div className="space-y-2">
        {/* Price Range */}
        <FilterSection
          title="Price Range"
          icon={<DollarSign className="w-4 h-4 text-green-600" />}
          isOpen={openSections.price}
          onToggle={() => toggleSection('price')}
          activeCount={filters.maxPrice < priceRange.max ? 1 : 0}
        >
          <div className="space-y-4 pt-2">
            <Slider
              value={[filters.maxPrice]}
              onValueChange={handlePriceChange}
              max={priceRange.max}
              min={priceRange.min}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>${priceRange.min.toLocaleString()}</span>
              <span className="font-medium text-blue-600">
                Up to ${filters.maxPrice.toLocaleString()}
              </span>
              <span>${priceRange.max.toLocaleString()}</span>
            </div>
          </div>
        </FilterSection>

        <Separator />

        {/* Airlines */}
        {airlinesData.length > 0 && (
          <>
            <FilterSection
              title="Airlines"
              icon={<Plane className="w-4 h-4 text-blue-600" />}
              isOpen={openSections.airlines}
              onToggle={() => toggleSection('airlines')}
              activeCount={filters.airlines.length}
            >
              <div className="space-y-3 pt-2 max-h-48 overflow-y-auto">
                {airlinesData.map((airline) => (
                  <div key={airline.name} className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={airline.name}
                        checked={filters.airlines.includes(airline.name)}
                        onCheckedChange={(checked) => 
                          handleAirlineChange(airline.name, checked as boolean)
                        }
                      />
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-xs font-bold text-blue-600">
                          {airline.code}
                        </div>
                        <Label 
                          htmlFor={airline.name} 
                          className="text-sm font-normal cursor-pointer"
                        >
                          {airline.name}
                        </Label>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {airline.count} flight{airline.count !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs font-medium text-green-600">
                        from ${airline.minPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </FilterSection>

            <Separator />
          </>
        )}

        {/* Stops */}
        <FilterSection
          title="Stops"
          icon={<Users className="w-4 h-4 text-purple-600" />}
          isOpen={openSections.stops}
          onToggle={() => toggleSection('stops')}
          activeCount={filters.maxStops < 3 ? 1 : 0}
        >
          <div className="space-y-4 pt-2">
            <Slider
              value={[filters.maxStops]}
              onValueChange={handleStopsChange}
              max={3}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Direct</span>
              <span className="font-medium text-blue-600">
                {filters.maxStops === 0 ? 'Direct only' : 
                 filters.maxStops === 1 ? 'Up to 1 stop' : 
                 `Up to ${filters.maxStops} stops`}
              </span>
              <span>3+ stops</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              {[0, 1, 2, 3].map((stops) => (
                <Button
                  key={stops}
                  variant={filters.maxStops >= stops ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStopsChange([stops])}
                  className="text-xs"
                >
                  {stops === 0 ? 'Direct' : stops === 3 ? '3+ stops' : `${stops} stop${stops > 1 ? 's' : ''}`}
                </Button>
              ))}
            </div>
          </div>
        </FilterSection>

        <Separator />

        {/* Duration */}
        <FilterSection
          title="Flight Duration"
          icon={<Clock className="w-4 h-4 text-orange-600" />}
          isOpen={openSections.duration}
          onToggle={() => toggleSection('duration')}
          activeCount={filters.maxDuration < 24 ? 1 : 0}
        >
          <div className="space-y-4 pt-2">
            <Slider
              value={[filters.maxDuration]}
              onValueChange={handleDurationChange}
              max={24}
              min={2}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>2h</span>
              <span className="font-medium text-blue-600">
                Up to {filters.maxDuration}h
              </span>
              <span>24h+</span>
            </div>
          </div>
        </FilterSection>
      </div>

      {/* Quick Filters */}
      <div className="mt-6 pt-4 border-t">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStopsChange([0])}
            className={`text-xs ${filters.maxStops === 0 ? 'bg-blue-50 border-blue-200' : ''}`}
          >
            Direct Only
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDurationChange([8])}
            className={`text-xs ${filters.maxDuration <= 8 ? 'bg-blue-50 border-blue-200' : ''}`}
          >
            Under 8h
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePriceChange([Math.floor(priceRange.max * 0.7)])}
            className={`text-xs ${filters.maxPrice <= priceRange.max * 0.7 ? 'bg-blue-50 border-blue-200' : ''}`}
          >
            Budget Friendly
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FilterSidebar;

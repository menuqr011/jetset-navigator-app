
import { Flight } from "@/types/flight";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Plane, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface FlightCardProps {
  flight: Flight;
}

const FlightCard = ({ flight }: FlightCardProps) => {
  const formatTime = (timeString: string) => {
    const date = new Date(`2000-01-01T${timeString}`);
    return format(date, "HH:mm");
  };

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getStopsText = (stops: number) => {
    if (stops === 0) return "Direct";
    if (stops === 1) return "1 stop";
    return `${stops} stops`;
  };

  const getClassBadgeColor = (flightClass: string) => {
    switch (flightClass) {
      case 'first': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'business': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'premium': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-blue-200 bg-white">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        {/* Airline Info */}
        <div className="flex items-center gap-4 lg:w-48">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {flight.airlineCode}
          </div>
          <div>
            <div className="font-semibold text-gray-800">{flight.airline}</div>
            <div className="text-sm text-gray-500">{flight.flightNumber}</div>
            <div className="text-xs text-gray-400">{flight.aircraft}</div>
          </div>
        </div>

        {/* Flight Route */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            {/* Departure */}
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {formatTime(flight.departureTime)}
              </div>
              <div className="text-sm font-medium text-gray-600">
                {flight.originCode}
              </div>
              <div className="text-xs text-gray-500">{flight.origin}</div>
            </div>

            {/* Flight Path */}
            <div className="flex-1 px-4">
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                <div className="flex flex-col items-center gap-1">
                  <Plane className="w-5 h-5 text-blue-500" />
                  <div className="text-xs font-medium text-gray-600">
                    {formatDuration(flight.duration)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getStopsText(flight.stops)}
                  </div>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              </div>
            </div>

            {/* Arrival */}
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {formatTime(flight.arrivalTime)}
              </div>
              <div className="text-sm font-medium text-gray-600">
                {flight.destinationCode}
              </div>
              <div className="text-xs text-gray-500">{flight.destination}</div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex items-center gap-4 mt-4">
            <Badge variant="outline" className={getClassBadgeColor(flight.class)}>
              {flight.class.charAt(0).toUpperCase() + flight.class.slice(1)}
            </Badge>
            
            {flight.stops > 0 && flight.stopCities && (
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                via {flight.stopCities.join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Price and Book */}
        <div className="lg:w-48 text-center lg:text-right">
          <div className="text-3xl font-bold text-gray-800 mb-1">
            ${flight.price.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 mb-4">per person</div>
          
          <Button className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105">
            <div className="flex items-center gap-2">
              Book Now
              <ArrowRight className="w-4 h-4" />
            </div>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FlightCard;

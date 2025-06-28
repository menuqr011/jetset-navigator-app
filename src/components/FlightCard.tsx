
import { Flight } from "@/types/flight";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Plane, ArrowRight, Wifi, Coffee, Tv } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { formatInrCurrency } from "@/utils/currencyConverter";

interface FlightCardProps {
  flight: Flight;
}

const FlightCard = ({ flight }: FlightCardProps) => {
  const navigate = useNavigate();

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

  const getClassIcon = (flightClass: string) => {
    switch (flightClass) {
      case 'first': return '👑';
      case 'business': return '💼';
      case 'premium': return '🎫';
      default: return '💺';
    }
  };

  const handleBookNow = () => {
    navigate("/checkout", { state: { flight } });
  };

  return (
    <Card className="p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 bg-white group cursor-pointer">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        {/* Enhanced Airline Info */}
        <div className="flex items-center gap-4 lg:w-56">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-sky-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {flight.airlineCode}
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1">
            <div className="font-bold text-gray-800 text-lg">{flight.airline}</div>
            <div className="text-sm text-blue-600 font-medium">{flight.flightNumber}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Plane className="w-3 h-3" />
              {flight.aircraft}
            </div>
          </div>
        </div>

        {/* Enhanced Flight Route */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            {/* Departure */}
            <div className="text-center flex-1">
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {formatTime(flight.departureTime)}
              </div>
              <div className="text-lg font-bold text-blue-600 mb-1">
                {flight.originCode}
              </div>
              <div className="text-sm text-gray-600">{flight.origin}</div>
            </div>

            {/* Enhanced Flight Path */}
            <div className="flex-1 px-6">
              <div className="flex items-center justify-center gap-2 text-gray-400 relative">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
                <div className="flex flex-col items-center gap-2 bg-white px-4 py-2 rounded-lg border border-blue-100">
                  <Plane className="w-6 h-6 text-blue-500 transform rotate-90" />
                  <div className="text-sm font-bold text-gray-700">
                    {formatDuration(flight.duration)}
                  </div>
                  <div className="text-xs text-blue-600 font-medium">
                    {getStopsText(flight.stops)}
                  </div>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
              </div>
            </div>

            {/* Arrival */}
            <div className="text-center flex-1">
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {formatTime(flight.arrivalTime)}
              </div>
              <div className="text-lg font-bold text-blue-600 mb-1">
                {flight.destinationCode}
              </div>
              <div className="text-sm text-gray-600">{flight.destination}</div>
            </div>
          </div>

          {/* Enhanced Additional Info */}
          <div className="flex items-center gap-4 mt-6 flex-wrap">
            <Badge variant="outline" className={`${getClassBadgeColor(flight.class)} flex items-center gap-1`}>
              <span>{getClassIcon(flight.class)}</span>
              {flight.class.charAt(0).toUpperCase() + flight.class.slice(1)}
            </Badge>
            
            {flight.stops > 0 && flight.stopCities && (
              <div className="text-sm text-gray-500 flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
                <Clock className="w-3 h-3" />
                via {flight.stopCities.join(', ')}
              </div>
            )}

            {/* Mock amenities based on class */}
            <div className="flex items-center gap-2">
              {(flight.class === 'business' || flight.class === 'first') && (
                <>
                  <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                    <Wifi className="w-3 h-3" />
                    WiFi
                  </div>
                  <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full flex items-center gap-1">
                    <Coffee className="w-3 h-3" />
                    Meals
                  </div>
                </>
              )}
              {flight.class === 'first' && (
                <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full flex items-center gap-1">
                  <Tv className="w-3 h-3" />
                  Entertainment
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Price and Book Section */}
        <div className="lg:w-56 text-center lg:text-right">
          <div className="mb-4">
            <div className="text-4xl font-bold text-gray-800 mb-1">
              {formatInrCurrency(flight.price)}
            </div>
            <div className="text-sm text-gray-500">per person</div>
            <div className="text-xs text-green-600 font-medium mt-1">
              {flight.stops === 0 ? 'Best Value Direct' : 'Great Deal'}
            </div>
          </div>
          
          <Button 
            onClick={handleBookNow}
            className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 transform group-hover:scale-105 hover:shadow-xl"
          >
            <div className="flex items-center gap-2">
              Book Now
              <ArrowRight className="w-5 h-5" />
            </div>
          </Button>

          <div className="text-xs text-gray-400 mt-2">
            Instant confirmation
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FlightCard;

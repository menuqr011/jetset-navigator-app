
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Plane, Clock, User, Mail, Phone, Download } from "lucide-react";
import { Flight } from "@/types/flight";
import { format } from "date-fns";

interface PassengerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, passengerInfo, paymentId } = location.state || {};

  useEffect(() => {
    if (!flight || !passengerInfo || !paymentId) {
      navigate("/");
    }
  }, [flight, passengerInfo, paymentId, navigate]);

  const formatTime = (timeString: string) => {
    const date = new Date(`2000-01-01T${timeString}`);
    return format(date, "HH:mm");
  };

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const generateBookingReference = () => {
    return `FL${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  };

  if (!flight || !passengerInfo || !paymentId) {
    return null;
  }

  const bookingRef = generateBookingReference();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your flight has been successfully booked</p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg inline-block">
            <p className="text-sm text-gray-600">Booking Reference</p>
            <p className="text-xl font-bold text-blue-600">{bookingRef}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Flight Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Information */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plane className="w-5 h-5 text-blue-600" />
                Flight Details
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {flight.airlineCode}
                    </div>
                    <div>
                      <div className="font-medium">{flight.airline}</div>
                      <div className="text-sm text-gray-500">{flight.flightNumber}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {flight.class.charAt(0).toUpperCase() + flight.class.slice(1)}
                  </Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatTime(flight.departureTime)}
                    </div>
                    <div className="text-sm font-medium text-gray-600">{flight.originCode}</div>
                    <div className="text-xs text-gray-500">{flight.origin}</div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className="w-8 h-px bg-gray-300"></div>
                      <Clock className="w-4 h-4" />
                      <div className="w-8 h-px bg-gray-300"></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDuration(flight.duration)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatTime(flight.arrivalTime)}
                    </div>
                    <div className="text-sm font-medium text-gray-600">{flight.destinationCode}</div>
                    <div className="text-xs text-gray-500">{flight.destination}</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Passenger Information */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Passenger Details
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{passengerInfo.firstName} {passengerInfo.lastName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </p>
                  <p className="font-medium">{passengerInfo.email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Phone
                  </p>
                  <p className="font-medium">{passengerInfo.phone}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Payment ID</p>
                  <p className="font-medium text-green-600">{paymentId}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Flight</span>
                  <span className="text-right text-sm">
                    {flight.originCode} → {flight.destinationCode}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span>{flight.departureDate}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Passenger</span>
                  <span>1 Adult</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Paid</span>
                  <span className="text-green-600">${flight.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <Button
                  variant="outline"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download E-Ticket
                </Button>
                
                <Button
                  onClick={() => navigate("/")}
                  className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700"
                >
                  Book Another Flight
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-2">Important Notes</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Check-in opens 24 hours before departure</li>
                  <li>• Arrive at airport 2 hours early for international flights</li>
                  <li>• E-ticket has been sent to your email</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

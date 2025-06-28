
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Plane, Clock, User, Mail, Phone, Download, Share2, Calendar, MapPin, Star } from "lucide-react";
import { Flight } from "@/types/flight";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface PassengerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { flight, passengerInfo, paymentId } = location.state || {};
  const [isDownloading, setIsDownloading] = useState(false);

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

  const generateETicket = () => {
    const bookingRef = generateBookingReference();
    const currentDate = new Date().toLocaleDateString();
    
    const formatInrCurrency = (amount: number): string => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(amount);
    };
    
    return `
ELECTRONIC TICKET
═══════════════════════════════════════

✈️ FLIGHT BOOKING CONFIRMATION
═══════════════════════════════════════

Booking Reference: ${bookingRef}
Issue Date: ${currentDate}
Payment ID: ${paymentId}

PASSENGER DETAILS
───────────────────────────────────────
Name: ${passengerInfo.firstName} ${passengerInfo.lastName}
Email: ${passengerInfo.email}
Phone: ${passengerInfo.phone}

FLIGHT DETAILS
───────────────────────────────────────
Airline: ${flight.airline} (${flight.airlineCode})
Flight: ${flight.flightNumber}
Aircraft: ${flight.aircraft}
Class: ${flight.class.charAt(0).toUpperCase() + flight.class.slice(1)}

ITINERARY
───────────────────────────────────────
From: ${flight.origin} (${flight.originCode})
To: ${flight.destination} (${flight.destinationCode})
Date: ${flight.departureDate}
Departure: ${flight.departureTime}
Arrival: ${flight.arrivalTime}
Duration: ${formatDuration(flight.duration)}
Stops: ${flight.stops === 0 ? 'Direct Flight' : `${flight.stops} stop(s)`}

PRICING BREAKDOWN
───────────────────────────────────────
Base Fare: ${formatInrCurrency(flight.price)}
Taxes & GST: ${formatInrCurrency(Math.round(flight.price * 0.18))}
Total Paid: ${formatInrCurrency(flight.price + Math.round(flight.price * 0.18))}

IMPORTANT INFORMATION
───────────────────────────────────────
• Check-in opens 24 hours before departure
• Arrive at airport 2 hours early for international flights
• Keep this e-ticket for your records
• Valid photo ID required for travel
• Baggage allowance as per airline policy

Thank you for choosing our flight booking service!
For support, contact us at support@flightbooking.com

═══════════════════════════════════════
    `;
  };

  const downloadETicket = async () => {
    setIsDownloading(true);
    
    try {
      const ticketContent = generateETicket();
      const blob = new Blob([ticketContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `E-Ticket-${generateBookingReference()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "E-Ticket Downloaded!",
        description: "Your e-ticket has been saved to your downloads folder.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading your e-ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const shareBooking = async () => {
    const bookingRef = generateBookingReference();
    const shareData = {
      title: 'Flight Booking Confirmed',
      text: `My flight from ${flight.originCode} to ${flight.destinationCode} is confirmed! Booking ref: ${bookingRef}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
        toast({
          title: "Booking details copied!",
          description: "Booking information has been copied to clipboard.",
        });
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
      toast({
        title: "Booking details copied!",
        description: "Booking information has been copied to clipboard.",
      });
    }
  };

  if (!flight || !passengerInfo || !paymentId) {
    return null;
  }

  const bookingRef = generateBookingReference();
  const taxes = Math.round(flight.price * 0.18); // GST for India
  const total = flight.price + taxes;

  const formatInrCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Enhanced Success Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-scale-in">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div className="absolute inset-0 w-20 h-20 bg-green-400 rounded-full mx-auto animate-ping opacity-20"></div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Booking Confirmed! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-6">Your flight has been successfully booked and payment processed</p>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg inline-block border border-green-100">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600 font-medium">Booking Reference</span>
            </div>
            <p className="text-2xl font-bold text-green-600 tracking-wider">{bookingRef}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Enhanced Flight Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Information Card */}
            <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Plane className="w-6 h-6 text-blue-600" />
                  </div>
                  Flight Details
                </h2>
                <Badge className="bg-gradient-to-r from-blue-500 to-sky-500 text-white px-4 py-2 text-sm">
                  Confirmed
                </Badge>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-sky-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {flight.airlineCode}
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900">{flight.airline}</div>
                      <div className="text-sm text-gray-600 font-medium">{flight.flightNumber}</div>
                      <div className="text-xs text-gray-500">{flight.aircraft}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="bg-white text-blue-700 border-blue-200 mb-2">
                      {flight.class.charAt(0).toUpperCase() + flight.class.slice(1)}
                    </Badge>
                    <div className="flex items-center gap-1 text-orange-600">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">Premium Service</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 text-center py-6">
                  <div className="space-y-3">
                    <div className="text-3xl font-bold text-gray-900">
                      {formatTime(flight.departureTime)}
                    </div>
                    <div className="text-lg font-bold text-blue-600">{flight.originCode}</div>
                    <div className="text-sm text-gray-600 font-medium">{flight.origin}</div>
                    <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {flight.departureDate}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="flex items-center gap-3 text-gray-400">
                      <div className="w-12 h-px bg-gray-300"></div>
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="w-12 h-px bg-gray-300"></div>
                    </div>
                    <div className="text-sm font-semibold text-gray-600">
                      {formatDuration(flight.duration)}
                    </div>
                    <div className="text-xs text-gray-500 bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-3xl font-bold text-gray-900">
                      {formatTime(flight.arrivalTime)}
                    </div>
                    <div className="text-lg font-bold text-blue-600">{flight.destinationCode}</div>
                    <div className="text-sm text-gray-600 font-medium">{flight.destination}</div>
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>Terminal info via email</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Enhanced Passenger Information */}
            <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                Passenger Details
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 font-medium">Full Name</p>
                  <p className="text-lg font-bold text-gray-900">{passengerInfo.firstName} {passengerInfo.lastName}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </p>
                  <p className="text-lg font-semibold text-gray-900">{passengerInfo.email}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </p>
                  <p className="text-lg font-semibold text-gray-900">{passengerInfo.phone}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 font-medium">Payment Reference</p>
                  <p className="text-lg font-semibold text-green-600">{paymentId}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Enhanced Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm sticky top-8">
              <h2 className="text-2xl font-bold mb-6">Booking Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Route</span>
                  <span className="font-semibold">
                    {flight.originCode} → {flight.destinationCode}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Travel Date</span>
                  <span className="font-semibold">{flight.departureDate}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Passengers</span>
                  <span className="font-semibold">1 Adult</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Base Fare</span>
                  <span className="font-semibold">{formatInrCurrency(flight.price)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taxes & GST</span>
                  <span className="font-semibold">{formatInrCurrency(taxes)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center text-xl">
                  <span className="font-bold">Total Paid</span>
                  <span className="font-bold text-green-600">{formatInrCurrency(total)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={downloadETicket}
                  disabled={isDownloading}
                  variant="outline"
                  className="w-full h-12 text-lg font-semibold border-2 border-blue-200 hover:bg-blue-50"
                >
                  {isDownloading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Download E-Ticket
                    </div>
                  )}
                </Button>

                <Button
                  onClick={shareBooking}
                  variant="outline"
                  className="w-full h-12 text-lg font-semibold border-2 border-green-200 hover:bg-green-50"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Booking
                </Button>
                
                <Button
                  onClick={() => navigate("/")}
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Book Another Flight
                </Button>
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Next Steps
                </h3>
                <ul className="text-sm text-amber-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                    Check-in opens 24 hours before departure
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                    Arrive at airport 2 hours early for international flights
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                    E-ticket confirmation sent to your email
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                    Keep valid photo ID ready for travel
                  </li>
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

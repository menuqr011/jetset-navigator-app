
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plane, Clock, CreditCard } from "lucide-react";
import { Flight } from "@/types/flight";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const flight = location.state?.flight as Flight;

  const [passengerInfo, setPassengerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!flight) {
      navigate("/");
      return;
    }

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [flight, navigate]);

  const formatTime = (timeString: string) => {
    const date = new Date(`2000-01-01T${timeString}`);
    return format(date, "HH:mm");
  };

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const handleInputChange = (field: string, value: string) => {
    setPassengerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayment = () => {
    if (!passengerInfo.firstName || !passengerInfo.lastName || !passengerInfo.email || !passengerInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all passenger details",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    const options = {
      key: "rzp_test_9999999999", // Replace with your Razorpay key
      amount: Math.round(flight.price * 100), // Amount in paisa
      currency: "USD",
      name: "Flight Booking",
      description: `${flight.origin} to ${flight.destination}`,
      image: "/favicon.ico",
      handler: function (response: any) {
        console.log("Payment successful:", response);
        navigate("/order-confirmation", {
          state: {
            flight,
            passengerInfo,
            paymentId: response.razorpay_payment_id,
          },
        });
      },
      prefill: {
        name: `${passengerInfo.firstName} ${passengerInfo.lastName}`,
        email: passengerInfo.email,
        contact: passengerInfo.phone,
      },
      theme: {
        color: "#3B82F6",
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (!flight) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Flight Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Summary */}
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
              <h2 className="text-lg font-semibold mb-4">Passenger Information</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={passengerInfo.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={passengerInfo.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={passengerInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={passengerInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Price Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Fare</span>
                  <span>${flight.price.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span>$0</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${flight.price.toLocaleString()}</span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {isProcessing ? "Processing..." : "Pay Now"}
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                Secure payment powered by Razorpay
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

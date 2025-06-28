
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plane, Clock, CreditCard, User, Mail, Phone, Shield, CheckCircle } from "lucide-react";
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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
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

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!passengerInfo.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!passengerInfo.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!passengerInfo.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(passengerInfo.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!passengerInfo.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(passengerInfo.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setPassengerInfo(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handlePayment = () => {
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Make sure all fields are filled correctly",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    const options = {
      key: "rzp_test_g5lLjY6DP6TbUZ",
      amount: Math.round(flight.price * 100), // Amount in paisa (INR)
      currency: "INR",
      name: "Flight Booking System",
      description: `Flight from ${flight.origin} to ${flight.destination}`,
      image: "/favicon.ico",
      handler: function (response: any) {
        console.log("Payment successful:", response);
        toast({
          title: "Payment Successful!",
          description: "Your booking has been confirmed",
        });
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
        color: "#2563EB",
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

  const taxes = Math.round(flight.price * 0.18); // GST rate for India
  const total = flight.price + taxes;

  const formatInrCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/")}
              className="rounded-full hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Secure Checkout</h1>
              <p className="text-sm text-gray-600">Complete your booking in just a few steps</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Flight Details & Passenger Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Summary Card */}
            <Card className="p-6 shadow-lg border-0 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Plane className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Flight Details</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {flight.airlineCode}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{flight.airline}</div>
                      <div className="text-sm text-gray-600">{flight.flightNumber}</div>
                      <div className="text-xs text-gray-500">{flight.aircraft}</div>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {flight.class.charAt(0).toUpperCase() + flight.class.slice(1)}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {formatTime(flight.departureTime)}
                    </div>
                    <div className="text-lg font-semibold text-blue-600">{flight.originCode}</div>
                    <div className="text-sm text-gray-600">{flight.origin}</div>
                    <div className="text-xs text-gray-500 mt-1">{flight.departureDate}</div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <div className="w-8 h-px bg-gray-300"></div>
                      <Clock className="w-4 h-4" />
                      <div className="w-8 h-px bg-gray-300"></div>
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      {formatDuration(flight.duration)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {formatTime(flight.arrivalTime)}
                    </div>
                    <div className="text-lg font-semibold text-blue-600">{flight.destinationCode}</div>
                    <div className="text-sm text-gray-600">{flight.destination}</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Passenger Information Card */}
            <Card className="p-6 shadow-lg border-0 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Passenger Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Enter first name"
                    value={passengerInfo.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={`mt-1 ${formErrors.firstName ? 'border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                  {formErrors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Enter last name"
                    value={passengerInfo.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={`mt-1 ${formErrors.lastName ? 'border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                  {formErrors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={passengerInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`mt-1 ${formErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={passengerInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`mt-1 ${formErrors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Price Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-lg border-0 bg-white sticky top-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Booking Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Base Fare</span>
                  <span className="font-semibold">{formatInrCurrency(flight.price)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taxes & GST (18%)</span>
                  <span className="font-semibold">{formatInrCurrency(taxes)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold">Total Amount</span>
                  <span className="font-bold text-blue-600">{formatInrCurrency(total)}</span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Pay {formatInrCurrency(total)}
                  </div>
                )}
              </Button>
              
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Secure Payment</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Your payment is protected by Razorpay's secure encryption
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Instant confirmation</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">E-ticket via email</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">24/7 customer support</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

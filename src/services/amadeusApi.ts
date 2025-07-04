interface AmadeusCredentials {
  apiKey: string;
  apiSecret: string;
}

interface AmadeusTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface AmadeusFlightOffer {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      carrierCode: string;
      number: string;
      aircraft: {
        code: string;
      };
      operating?: {
        carrierCode: string;
      };
      duration: string;
      id: string;
      numberOfStops: number;
      blacklistedInEU: boolean;
    }>;
  }>;
  price: {
    currency: string;
    total: string;
    base: string;
    fees: Array<{
      amount: string;
      type: string;
    }>;
    grandTotal: string;
  };
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: Array<{
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: {
      currency: string;
      total: string;
      base: string;
    };
    fareDetailsBySegment: Array<{
      segmentId: string;
      cabin: string;
      fareBasis: string;
      class: string;
      includedCheckedBags: {
        quantity: number;
      };
    }>;
  }>;
}

interface AmadeusSearchResponse {
  meta: {
    count: number;
    links?: {
      self: string;
    };
  };
  data: AmadeusFlightOffer[];
  dictionaries: {
    locations: Record<string, {
      cityCode: string;
      countryCode: string;
    }>;
    aircraft: Record<string, string>;
    currencies: Record<string, string>;
    carriers: Record<string, string>;
  };
}

const AMADEUS_BASE_URL = 'https://test.api.amadeus.com';

import { convertUsdToInr } from "@/utils/currencyConverter";

class AmadeusAPIService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  private async getAccessToken(credentials: AmadeusCredentials): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const response = await fetch(`${AMADEUS_BASE_URL}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: credentials.apiKey,
        client_secret: credentials.apiSecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.statusText}`);
    }

    const tokenData: AmadeusTokenResponse = await response.json();
    this.accessToken = tokenData.access_token;
    this.tokenExpiry = Date.now() + (tokenData.expires_in * 1000) - 60000; // Refresh 1 minute early

    return this.accessToken;
  }

  private mapTravelClass(internalClass?: string): string | undefined {
    if (!internalClass) return undefined;
    
    const classMap: Record<string, string> = {
      'economy': 'ECONOMY',
      'premium': 'PREMIUM_ECONOMY',
      'business': 'BUSINESS',
      'first': 'FIRST'
    };
    
    return classMap[internalClass.toLowerCase()];
  }

  async searchFlights(searchParams: {
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: string;
    returnDate?: string;
    adults: number;
    children?: number;
    infants?: number;
    travelClass?: string;
    max?: number;
  }, credentials: AmadeusCredentials): Promise<AmadeusSearchResponse> {
    const token = await this.getAccessToken(credentials);

    const queryParams = new URLSearchParams({
      originLocationCode: searchParams.originLocationCode,
      destinationLocationCode: searchParams.destinationLocationCode,
      departureDate: searchParams.departureDate,
      adults: searchParams.adults.toString(),
      max: (searchParams.max || 50).toString(),
    });

    if (searchParams.returnDate) {
      queryParams.append('returnDate', searchParams.returnDate);
    }
    if (searchParams.children) {
      queryParams.append('children', searchParams.children.toString());
    }
    if (searchParams.infants) {
      queryParams.append('infants', searchParams.infants.toString());
    }
    if (searchParams.travelClass) {
      const mappedClass = this.mapTravelClass(searchParams.travelClass);
      if (mappedClass) {
        queryParams.append('travelClass', mappedClass);
      }
    }

    console.log('Final API URL:', `${AMADEUS_BASE_URL}/v2/shopping/flight-offers?${queryParams}`);

    const response = await fetch(`${AMADEUS_BASE_URL}/v2/shopping/flight-offers?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Flight search failed: ${response.statusText}`);
    }

    const data: AmadeusSearchResponse = await response.json();
    
    // Convert USD prices to INR
    if (data.data) {
      console.log('Converting flight prices from USD to INR...');
      data.data = data.data.map((flight, index) => {
        const originalPrice = parseFloat(flight.price.total);
        const originalBase = parseFloat(flight.price.base);
        const originalGrandTotal = parseFloat(flight.price.grandTotal);
        
        console.log(`Flight ${index + 1}: Original USD price: ${originalPrice}`);
        
        const convertedFlight = {
          ...flight,
          price: {
            ...flight.price,
            currency: 'INR',
            total: convertUsdToInr(originalPrice).toString(),
            base: convertUsdToInr(originalBase).toString(),
            grandTotal: convertUsdToInr(originalGrandTotal).toString(),
          }
        };
        
        console.log(`Flight ${index + 1}: Converted INR price: ${convertedFlight.price.total}`);
        return convertedFlight;
      });
    }

    return data;
  }
}

export const amadeusAPI = new AmadeusAPIService();
export type { AmadeusCredentials, AmadeusFlightOffer, AmadeusSearchResponse };

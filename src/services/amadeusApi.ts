
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
      queryParams.append('travelClass', searchParams.travelClass.toUpperCase());
    }

    const response = await fetch(`${AMADEUS_BASE_URL}/v2/shopping/flight-offers?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Flight search failed: ${response.statusText}`);
    }

    return response.json();
  }
}

export const amadeusAPI = new AmadeusAPIService();
export type { AmadeusCredentials, AmadeusFlightOffer, AmadeusSearchResponse };

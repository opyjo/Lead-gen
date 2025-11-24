export interface Business {
  id: string;
  name: string;
  address: string;
  phoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  types?: string[];
  location?: {
    lat: number;
    lng: number;
  };
}

export interface SearchResponse {
  places: Business[];
  nextPageToken?: string;
}

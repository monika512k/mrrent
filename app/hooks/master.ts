import { useState, useCallback, useEffect } from 'react';
import { operationLocation } from 'app/services/api';
import { useLanguage } from 'app/context/LanguageContext';

// Types
interface OperatingLocation {
  id: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  is_active: boolean;
  deleted_at: string | null;
  address: string;
  google_map_link: string | null;
  is_pickup_location: boolean;
  is_drop_location: boolean;
  opening_time: string | null;
  closing_time: string | null;
  description: string | null;
  contact_number: string | null;
  contact_email: string | null;
  contact_person: string | null;
}

interface OperatingLocationsResponse {
  status: boolean;
  message: string;
  data: OperatingLocation[];
}

interface UseOperatingLocationsOptions {
  autoFetch?: boolean;
  selectedLanguage?: string;
}

interface UseOperatingLocationsReturn {
  pickupLocations: OperatingLocation[];
  dropLocations: OperatingLocation[];
  loading: boolean;
  error: string | null;
  fetchLocations: (language?: string) => Promise<void>;
  // New state variables for selected locations and dates
  selectedPickupLocation: OperatingLocation | null;
  selectedDropLocation: OperatingLocation | null;
  pickDate: string;
  dropDate: string;
  setSelectedPickupLocation: (location: OperatingLocation | null) => void;
  setSelectedDropLocation: (location: OperatingLocation | null) => void;
  setPickDate: (date: string) => void;
  setDropDate: (date: string) => void;
}

const DEFAULT_OPTIONS: UseOperatingLocationsOptions = {
  autoFetch: true,
};

export const useOperatingLocations = (
  options: UseOperatingLocationsOptions = {}
): UseOperatingLocationsReturn => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const { language } = useLanguage();
  
  // State
  const [locations, setLocations] = useState<OperatingLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New state variables for selected locations and dates
  const [selectedPickupLocation, setSelectedPickupLocation] = useState<OperatingLocation | null>(null);
  const [selectedDropLocation, setSelectedDropLocation] = useState<OperatingLocation | null>(null);
  const [pickDate, setPickDate] = useState<string>("2025-05-24T08:00");
  const [dropDate, setDropDate] = useState<string>("2025-05-24T08:00");

  // Computed values
  const pickupLocations = locations.filter(location => 
    location.is_pickup_location
  );
  
  const dropLocations = locations.filter(location => 
    location.is_drop_location
  );

  // Fetch locations from API
  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const selectedLanguage = language || 'en';
      const response = await operationLocation(selectedLanguage);
      
      const typedResponse = response as OperatingLocationsResponse;
      if (typedResponse.status && typedResponse.data) {
        setLocations(typedResponse.data);
      } else {
        setError('Failed to fetch locations');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching locations';
      setError(errorMessage);
      console.error('Error fetching operating locations:', err);
    } finally {
      setLoading(false);
    }
  }, [language]);

  // Refresh locations (same as fetch but more semantic)
  // You can also call fetchLocations with a specific language: fetchLocations('en')

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (config.autoFetch) {
      fetchLocations();
    }
  }, [config.autoFetch, fetchLocations]);

  return {
    pickupLocations,
    dropLocations,
    loading,
    error,
    fetchLocations,
    // Return new state variables and setters
    selectedPickupLocation,
    selectedDropLocation,
    pickDate,
    dropDate,
    setSelectedPickupLocation,
    setSelectedDropLocation,
    setPickDate,
    setDropDate,
  };
};

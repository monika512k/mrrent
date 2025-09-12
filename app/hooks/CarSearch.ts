import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { getCarList, locations as fetchLocations,operationLocation } from 'app/services/api';
import { useLanguage } from 'app/context/LanguageContext';
import CarSearch from 'app/Common/CarSearch';

// Types
interface SearchFormData {
    pickupLocation: string;
    pickupDate: string;
    dropoffLocation: string;
    dropoffDate: string;
    pickupLocationId?: number;
    dropoffLocationId?: number;
}

interface Location {
    id: number;
    address: string;
    closing_time: string | null;
    contact_email: string | null;
    contact_number: string | null;
    contact_person: string | null;
    created_at: string;
    deleted_at: string | null;
    description: string | null;
    google_map_link: string;
    is_active: boolean;
    is_deleted: boolean;
    is_drop_location: boolean;
    is_pickup_location: boolean;
    opening_time: string | null;
    updated_at: string;
}

interface Car {
    id: number;
    brand: string;
    model: string;
    year: number;
    color: string;
    body_type: string;
    transmission: string;
    fuel_type: string;
    car_type: string;
    seats: number;
    price_per_day: string;
    price_per_km: string;
    free_km: number;
    thumbnail_image: string;
    discount_price_per_day: number;
    discount_price_per_km: number;
    extra_km: number;
}

interface UseCarSearchFilters {
    selectedFuel: string[];
    selectedTransmission: string[];
    selectedCarTypes: string[];
    selectedBodyTypes: string[];
    priceRange: [number, number];
}

interface UseCarSearchOptions {
    pageSize?: number;
    debounceMs?: number;
    autoFetchLocations?: boolean;
}

interface UseCarSearchReturn {
    // Data
    cars: Car[];
    locations: Location[];
    searchData: SearchFormData | null;
    filters: UseCarSearchFilters;

    // Loading states
    loading: boolean;
    initialLoad: boolean;

    // Pagination
    hasNextPage: boolean;
    currentPage: number;
    totalCount: number;

    // Actions
    handleSearch: (data: SearchFormData) => void;
    updateFilters: (filters: Partial<UseCarSearchFilters>) => void;
    setFilters: (filters: UseCarSearchFilters) => void;
    loadMore: () => void;
    resetSearch: () => void;
    clearFilters: () => void;

    // Utilities
    findLocationIdByAddress: (address: string) => number | null;
}

const DEFAULT_OPTIONS: UseCarSearchOptions = {
    pageSize: 20,
    debounceMs: 500,
    autoFetchLocations: true,
};

const DEFAULT_FILTERS: UseCarSearchFilters = {
    selectedFuel: [],
    selectedTransmission: [],
    selectedCarTypes: [],
    selectedBodyTypes: [],
    priceRange: [0, 120000],
};

export const useCarSearch = (
    options: UseCarSearchOptions = {}
): UseCarSearchReturn => {
    const config = { ...DEFAULT_OPTIONS, ...options };
    const {language} = useLanguage();
   
    // Core state
    const [cars, setCars] = useState<Car[]>([]);
    let currentSearchData = {};

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("searchData");
      currentSearchData = stored ? JSON.parse(stored) : {};
    }
    const [locations, setLocations] = useState<Location[]>([]);
    const [searchData, setSearchData] = useState<SearchFormData | null>(currentSearchData as SearchFormData || null);

    // Loading states
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    // Pagination state
    const [hasNextPage, setHasNextPage] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const isMounted = useRef(false);
    // Internal filters state (managed internally)
    const [internalFilters, setInternalFilters] = useState<UseCarSearchFilters>(DEFAULT_FILTERS);

    // Helper function to find location ID by address
    const findLocationIdByAddress = useCallback((address: string): number | null => {
        if (!address || !locations.length) return null;

        const location = locations.find(loc =>
            loc.address.toLowerCase().includes(address.toLowerCase()) ||
            address.toLowerCase().includes(loc.address.toLowerCase())
        );

        return location ? location.id : null;
    }, [locations]);

    // Build API parameters
    const buildApiParams = useCallback((page: number = 1) => {

        let pickup_location: number | null = null;
        let dropoff_location: number | null = null;

        // Resolve location IDs
        if (searchData?.pickupLocationId) {
            pickup_location = searchData.pickupLocationId;
        } else if (searchData?.pickupLocation) {
            pickup_location = findLocationIdByAddress(searchData.pickupLocation);
        }

        if (searchData?.dropoffLocationId) {
            dropoff_location = searchData.dropoffLocationId;
        } else if (searchData?.dropoffLocation) {
            dropoff_location = findLocationIdByAddress(searchData.dropoffLocation);
        }


        return {
            fuel_type: internalFilters?.selectedFuel?.length > 0 ? internalFilters.selectedFuel.join(',') : '',
            transmission: internalFilters?.selectedTransmission?.length > 0 ? internalFilters.selectedTransmission.join(',') : '',
            car_type: internalFilters?.selectedCarTypes?.length > 0 ? internalFilters.selectedCarTypes.join(',') : '',
            body_type: internalFilters?.selectedBodyTypes?.length > 0 ? internalFilters.selectedBodyTypes.join(',') : '',
            pickup_location: pickup_location || (searchData?.pickupLocation || ''),
            pickup_date: searchData?.pickupDate || '',
            drop_date: searchData?.dropoffDate || '',
            dropoff_location: dropoff_location || (searchData?.dropoffLocation || ''),
            page,
            page_size: config?.pageSize,
            min_price:internalFilters.priceRange[0],
            max_price:internalFilters?.priceRange[1]
        };
    }, [internalFilters, searchData, findLocationIdByAddress, config.pageSize]);

    // Fetch cars from API
    const fetchCars = useCallback(async (page: number = 1, reset: boolean = false) => {
        try {
            setLoading(true);
            const params = buildApiParams(page);

            console.log('API Parameters:', params);

            const result = await getCarList(params as any , String(language)) as any;

            if (result?.status && result?.data) {
                const newCars = result.data;
                const pageData = result.page_data;

                setCars(prevCars =>
                    reset ? newCars : [...prevCars, ...newCars]
                );

                setHasNextPage(pageData.current_page < pageData.total_pages);
                setTotalCount(pageData.count); // ✅ Use total count from API
                setCurrentPage(pageData.current_page);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error fetching cars:', error);
        } finally {
            setLoading(false);
            setInitialLoad(false);
        }
    }, [buildApiParams, config.pageSize]);

    // Fetch locations
    const fetchAndSetLocations = useCallback(async () => {
        try {
            const result = await operationLocation(language || 'en') as any;
            console.log('result',result)
            if (result?.status && result?.data) {
                console.log('Fetched locations:', result.data);
                setLocations(result.data);
            }
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    }, [language]);

    // Debounced search function
    const debouncedSearch = useMemo(
        () => debounce(() => {
            fetchCars(1, true);
        }, config.debounceMs),
        [fetchCars, config.debounceMs]
    );

    // Public API functions
    const handleSearch = useCallback((data: SearchFormData) => {
        console.log('Search form submitted:', data);

        // Enhance search data with location IDs
        const enhancedSearchData: SearchFormData = {
            ...data,
            pickupLocationId: data.pickupLocationId || findLocationIdByAddress(data.pickupLocation) || undefined,
            dropoffLocationId: data.dropoffLocationId || findLocationIdByAddress(data.dropoffLocation) || undefined
        };

        console.log('Enhanced search data with location IDs:', enhancedSearchData);
        localStorage.setItem('searchData', JSON.stringify(enhancedSearchData));
  
        setSearchData(enhancedSearchData);
        setCars([]);
        setCurrentPage(1);
        setHasNextPage(true);
        debouncedSearch();
    }, [findLocationIdByAddress, debouncedSearch]);

    const updateFilters = useCallback((newFilters: Partial<UseCarSearchFilters>) => {
        setInternalFilters(prev => ({
            ...prev,
            ...newFilters
        }));
    }, []);

    const loadMore = useCallback(() => {
        if (!loading && hasNextPage) {
            fetchCars(currentPage + 1, false);
        }
    }, [loading, hasNextPage, currentPage, fetchCars]);

    const resetSearch = useCallback(() => {
        setSearchData(null);
        setCars([]);
        setCurrentPage(1);
        setHasNextPage(true);
        setTotalCount(0);
        setInitialLoad(true);
    }, []);

    const clearFilters = useCallback(() => {
        setInternalFilters(DEFAULT_FILTERS);
    }, []);

    const setFilters = useCallback((filters: UseCarSearchFilters) => {
        setInternalFilters(filters);
    }, []);

    // Effect for filter changes
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        if (!initialLoad) {
            setCars([]);
            setCurrentPage(1);
            setHasNextPage(true);
            debouncedSearch();
        }
    }, [internalFilters]); 

    // Initial load effect
    useEffect(() => {
        if (config.autoFetchLocations) {
            fetchAndSetLocations();
        }
        fetchCars(1, true);
    }, [config.autoFetchLocations,language]);

    return {
        // Data
        cars,
        locations,
        searchData,
        filters: internalFilters,
        // Loading states
        loading,
        initialLoad,

        // Pagination
        hasNextPage,
        currentPage,
        totalCount,

        // Actions
        handleSearch,
        updateFilters,
        loadMore,
        resetSearch,
        clearFilters,
        setFilters,

        // Utilities
        findLocationIdByAddress,
    };
};
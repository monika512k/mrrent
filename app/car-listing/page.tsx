'use client'
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FixedSizeGrid as Grid, VariableSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import assets from 'app/assets/assets';
import SearchForm from '../Common/SearchForm';
import Filters from 'app/Common/Filters';
import { useCarSearch } from '../hooks/CarSearch';
import { Users, Fuel, Loader2 } from "lucide-react";
import { useLanguage } from 'app/context/LanguageContext';
import { getCarsTypes } from 'app/services/api';

// Car card component for virtualization
const CarCard = ({ car, router }: { car: any, router: any }) => {
    const {t}= useLanguage()
    const carName = `${car.brand} ${car.model} (${car.year})`;
    const displayPrice = car.discount_price_per_day < parseFloat(car.price_per_day)
        ? car.discount_price_per_day
        : parseFloat(car.price_per_day);

    return (
        <div className="bg-zinc-800 rounded-2xl overflow-hidden p-2 shadow-lg flex flex-col h-full">
            <img
                src={car.thumbnail_image}
                alt={carName}
                className="w-full h-48 object-cover rounded-xl"
            />
            <div className="mt-4 mx-4 flex-1 flex flex-col">
                <h3 className="text-sm font-semibold text-left line-clamp-2">{carName}</h3>
                <div className="flex items-center gap-2 mt-1">
                    {car.discount_price_per_day < parseFloat(car.price_per_day) && (
                        <p className="text-gray-400 text-sm line-through">
                            €{car.price_per_day}
                        </p>
                    )}
                    <p className="text-white text-xl font-bold text-left">
                        €{displayPrice}<span className="text-sm font-normal">/day</span>
                    </p>
                </div>

                <div className="mt-4 bg-zinc-700 rounded-lg flex justify-between px-4 py-3 text-xs text-gray-200">
                    <span className="flex flex-col items-center gap-1 flex-1">
                        <img src={assets.ManualGearIcon} alt="" className="w-4 h-4" />
                        <span className="text-center truncate w-full">{car.transmission}</span>
                    </span>
                    <span className="flex flex-col items-center gap-1 flex-1">
                        <Users className="w-4 h-4" />
                        <span className="text-center">{car.seats}</span>
                    </span>
                    <span className="flex flex-col items-center gap-1 flex-1">
                        <Fuel className="w-4 h-4" />
                        <span className="text-center truncate w-full">{car.fuel_type}</span>
                    </span>
                </div>

                <div className="mt-2 text-xs text-gray-400 space-y-1">
                    <div className="flex justify-between">
                        <span>Free KM:</span>
                        <span>{car.free_km} km</span>
                    </div>
                    <div className="mt-auto flex justify-between">
                        <span>Extra KM:</span>
                        <span>€{car.price_per_km}/km</span>
                    </div>
                </div>

                <button
                    onClick={() => router.push(`/car-description/${car.id}`)}
                    className="mt-4 mb-3 w-full bg-[#F3B753] cursor-pointer text-black py-2 rounded-lg font-semibold hover:bg-[#e3a640] transition"
                >
                   { t('common.bookNow')}
                </button>
            </div>
        </div>
    );
};

const CarListing = () => {
    const router = useRouter();
    const listRef = useRef<any>(null);
    const gridRef = useRef<any>(null);

    const [carTypes, setCarTypes] = useState<Array<{ label: string; value: string }>>([]);
    const [activeType, setActiveType] = useState<string>('');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    // Use the custom hook
    const {
        cars,
        locations,
        searchData,
        filters,
        loading,
        initialLoad,
        hasNextPage,
        currentPage,
        totalCount,
        handleSearch,
        updateFilters,
        setFilters,
        loadMore,
        resetSearch,
        clearFilters: clearSearchFilters,
        findLocationIdByAddress,
    } = useCarSearch({
        pageSize: 20,
        debounceMs: 500,
        autoFetchLocations: true,
    });

    const [priceRange, setPriceRange] = useState<[number, number]>([1, 120000]);
    const [selectedCarTypes, setSelectedCarTypes] = useState([]);
    const [selectedBodyTypes, setSelectedBodyTypes] = useState([]);
    const [selectedTransmission, setSelectedTransmission] = useState([]);
    const [selectedFuel, setSelectedFuel] = useState([]);

    // Calculate grid dimensions based on container size
    const gridConfig = useMemo(() => {
        const containerWidth = containerSize.width;
        let columnCount = 1;
        let columnWidth = containerWidth;

        if (containerWidth >= 1000) {
            columnCount = 3;
            columnWidth = Math.floor((containerWidth - 48) / 3);
        } else if (containerWidth >= 768) {
            columnCount = 2;
            columnWidth = Math.floor((containerWidth - 24) / 2);
        }

        return { columnCount, columnWidth };
    }, [containerSize.width]);

    // Measure container size
    const measureContainerRef = useCallback((node: HTMLDivElement | null) => {
        if (node) {
            const resizeObserver = new ResizeObserver((entries) => {
                const { width, height } = entries[0].contentRect;
                setContainerSize({ width, height });
            });
            resizeObserver.observe(node);
            return () => resizeObserver.disconnect();
        }
    }, []);

    useEffect(() => {
        setFilters({
            selectedFuel,
            selectedTransmission,
            selectedCarTypes,
            selectedBodyTypes,
            priceRange,
        });
    }, []);

    // Fetch car types dynamically
    const { language } = useLanguage();
    useEffect(() => {
        const fetchCarTypes = async () => {
            try {
                const res = await getCarsTypes({ used_for: 'filter', selected_language: String(language || 'en') }) as any;
                if (res?.status && Array.isArray(res?.data)) {
                    // Keep both label and value: label = other_name, value = name
                    const types = res.data.length>0&&res.data.map((ct: any) => ({
                        label: ct?.other_name || ct?.name,
                        value: ct?.name || ct?.other_name,
                    })).filter((x: any) => x?.value);
                    setCarTypes(types);
                    if (types.length && !activeType) {
                        setActiveType(types[0].label);
                    }
                } else {
                    setCarTypes([]);
                }
            } catch (e) {
                setCarTypes([]);
            }
        };
        fetchCarTypes();
    }, [language]);

    const handleFilterChange = useCallback((filterType: string, value: any) => {
        const newFilters = { ...filters };

        switch (filterType) {
            case 'fuel':
                newFilters.selectedFuel = value;
                setSelectedFuel(value);
                break;
            case 'transmission':
                newFilters.selectedTransmission = value;
                setSelectedTransmission(value);
                break;
            case 'carTypes':
                newFilters.selectedCarTypes = value;
                setSelectedCarTypes(value);
                break;
            case 'bodyTypes':
                newFilters.selectedBodyTypes = value;
                setSelectedBodyTypes(value);
                break;
            case 'priceRange':
                newFilters.priceRange = value;
                setPriceRange(value);
                break;
        }

        updateFilters(newFilters);
    }, [filters, updateFilters, selectedCarTypes]);

    const clearFilters = useCallback(() => {
        setSelectedCarTypes([]);
        setSelectedBodyTypes([]);
        setSelectedTransmission([]);
        setSelectedFuel([]);
        setPriceRange([0, 120000]);
        clearSearchFilters();
      if (typeof window !== "undefined") {
    window.localStorage.removeItem("searchData");
  }

    }, [clearSearchFilters]);

    const handleBack = () => {
        router.back();
    };

    // Check if item is loaded for infinite loading
    const isItemLoaded = useCallback((index: number) => {
        return index < cars.length;
    }, [cars.length]);

    // Load more items
    const loadMoreItems = useCallback(async (startIndex: number, stopIndex: number) => {
        if (!loading && hasNextPage) {
            await loadMore();
        }
    }, [loading, hasNextPage, loadMore]);

    // Grid cell renderer
    const GridCell = useCallback(({ columnIndex, rowIndex, style }: any) => {
        const index = rowIndex * gridConfig.columnCount + columnIndex;
        const car = cars[index];

        if (!car) {
            return (
                <div style={style} className="p-3">
                    {loading && (
                        <div className="bg-zinc-800 rounded-2xl overflow-hidden p-2 shadow-lg flex items-center justify-center h-96">
                            <Loader2 className="w-8 h-8 animate-spin text-[#F3B753]" />
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div style={style} className="p-3">
                <CarCard car={car} router={router} />
            </div>
        );
    }, [cars, gridConfig.columnCount, loading, router]);

    // List item renderer (for mobile single column)
    const ListItem = useCallback(({ index, style }: any) => {
        const car = cars[index];

        if (!car) {
            return (
                <div style={style} className="p-3">
                    {loading && (
                        <div className="bg-zinc-800 rounded-2xl overflow-hidden p-2 shadow-lg flex items-center justify-center h-96">
                            <Loader2 className="w-8 h-8 animate-spin text-[#F3B753]" />
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div style={style} className="p-3">
                <CarCard car={car} router={router} />
            </div>
        );
    }, [cars, loading, router]);

    // Calculate total items for infinite loader
    const itemCount = hasNextPage ? cars.length + 1 : cars.length;
    const rowCount = Math.ceil(itemCount / gridConfig.columnCount);

    return (
        <div className={`bg-[#121212] text-white min-h-screen ${mobileFiltersOpen ? 'overflow-hidden h-screen' : ''}`}>
            <div className="px-6 pt-[58px] md:px-[86px] pb-6 bg-[#121212] relative z-10">
                <SearchForm
                    onSubmitOverride={handleSearch}
                    locationList={locations as any}
                    current_location={String(searchData?.pickupLocationId || '')}
                />

                {/* Car Type Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mt-6 max-w-full overflow-x-auto">
                    {carTypes.length>0&&carTypes.map((type) => (
                        <button
                            key={type.value}
                            onClick={() => {
                                setActiveType(type.label);
                                handleFilterChange('carTypes', [type.value]);
                            }}
                            className={`flex justify-center items-center px-4 py-2 rounded-full font-['Poppins'] font-medium text-base leading-6 transition-colors duration-200 whitespace-nowrap ${activeType === type.label
                                ? 'bg-[#454545] hover:bg-[#555555]'
                                : 'bg-[#454545]/30 border border-[#F6F6F6]/40 hover:bg-[#454545]/50'
                                } text-[#F6F6F6]`}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>

                {/* Back Button */}
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-[#F3B753] font-['Poppins'] font-medium text-base mt-3 hover:opacity-80 transition-opacity"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="#F3B753" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back
                </button>
            </div>

            {/* Main Content Section */}
            <div className="flex px-6 md:px-[86px] gap-6 h-[calc(100vh-120px)]">
                {/* Fixed Filters Sidebar */}
                <div className="hidden md:block w-80 flex-shrink-0">
                    <div className="sticky top-0 h-full overflow-y-auto custom-scrollbar">
                        <Filters
                            priceRange={priceRange}
                            setPriceRange={(value) => handleFilterChange('priceRange', value)}
                            selectedCarTypes={selectedCarTypes}
                            setSelectedCarTypes={(value) => handleFilterChange('carTypes', value)}
                            selectedBodyTypes={selectedBodyTypes}
                            setSelectedBodyTypes={(value) => handleFilterChange('bodyTypes', value)}
                            selectedTransmission={selectedTransmission}
                            setSelectedTransmission={(value) => handleFilterChange('transmission', value)}
                            selectedFuel={selectedFuel}
                            setSelectedFuel={(value) => handleFilterChange('fuel', value)}
                            clearFilters={clearFilters}
                            mobileFiltersOpen={mobileFiltersOpen}
                            setMobileFiltersOpen={setMobileFiltersOpen}
                        />
                    </div>
                </div>

                {/* Mobile Filters */}
                <div className="md:hidden">
                    <Filters
                        priceRange={priceRange}
                        setPriceRange={(value) => handleFilterChange('priceRange', value)}
                        selectedCarTypes={selectedCarTypes}
                        setSelectedCarTypes={(value) => handleFilterChange('carTypes', value)}
                        selectedBodyTypes={selectedBodyTypes}
                        setSelectedBodyTypes={(value) => handleFilterChange('bodyTypes', value)}
                        selectedTransmission={selectedTransmission}
                        setSelectedTransmission={(value) => handleFilterChange('transmission', value)}
                        selectedFuel={selectedFuel}
                        setSelectedFuel={(value) => handleFilterChange('fuel', value)}
                        clearFilters={clearFilters}
                        mobileFiltersOpen={mobileFiltersOpen}
                        setMobileFiltersOpen={setMobileFiltersOpen}
                    />
                </div>

                {/* Virtualized Cars Grid Section */}
                <div className="flex-1 flex flex-col" ref={measureContainerRef}>
                    {initialLoad && (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="w-8 h-8 animate-spin text-[#F3B753]" />
                        </div>
                    )}

                    {/* Results summary */}
                    {!initialLoad && (
                        <div className="mb-4 text-gray-400 text-sm sticky top-0 bg-[#121212] py-2 z-10">
                            Showing {cars.length} cars {hasNextPage ? '(Scroll for more...)' : ''}
                        </div>
                    )}

                    {/* Virtualized Grid */}
                    {!initialLoad && cars.length > 0 && containerSize.width > 0 && (
                        <div className="flex-1 custom-scrollbar ">
                            {gridConfig.columnCount > 1 ? (
                                <InfiniteLoader
                                    isItemLoaded={isItemLoaded}
                                    itemCount={itemCount}
                                    loadMoreItems={loadMoreItems}
                                >
                                    {({ onItemsRendered, ref }) => (
                                        <Grid
                                            ref={(grid) => {
                                                gridRef.current = grid;
                                                ref(grid);
                                            }}
                                            columnCount={gridConfig.columnCount}
                                            columnWidth={gridConfig.columnWidth}
                                            height={containerSize.height - 50}
                                            rowCount={rowCount}
                                            rowHeight={500}
                                            width={containerSize.width}
                                            onItemsRendered={({
                                                visibleRowStartIndex,
                                                visibleRowStopIndex,
                                                visibleColumnStartIndex,
                                                visibleColumnStopIndex,
                                            }) => {
                                                const startIndex = visibleRowStartIndex * gridConfig.columnCount + visibleColumnStartIndex;
                                                const stopIndex = visibleRowStopIndex * gridConfig.columnCount + visibleColumnStopIndex;
                                                onItemsRendered({
                                                    overscanStartIndex: startIndex,
                                                    overscanStopIndex: stopIndex,
                                                    visibleStartIndex: startIndex,
                                                    visibleStopIndex: stopIndex,
                                                });
                                            }}
                                        >
                                            {GridCell}
                                        </Grid>
                                    )}
                                </InfiniteLoader>
                            ) : (
                                <InfiniteLoader
                                    isItemLoaded={isItemLoaded}
                                    itemCount={itemCount}
                                    loadMoreItems={loadMoreItems}
                                >
                                    {({ onItemsRendered, ref }) => (
                                        <List
                                            ref={(list) => {
                                                listRef.current = list;
                                                ref(list);
                                            }}
                                            height={containerSize.height - 100}
                                            itemCount={itemCount}
                                            itemSize={() => 500}
                                            width={containerSize.width}
                                            onItemsRendered={onItemsRendered}
                                        >
                                            {ListItem}
                                        </List>
                                    )}
                                </InfiniteLoader>
                            )}
                        </div>
                    )}

                    {/* No results */}
                    {!initialLoad && cars.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <p className="text-lg mb-2">No cars found</p>
                            <p className="text-sm">Try adjusting your filters or search criteria</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CarListing;
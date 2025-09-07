'use client'
import React, { createContext, useContext, useEffect } from 'react';
import Hero from './Hero';
import StepsSection from './StepsSection';
import CarRentalGrid from './CarRentalGrid';
import ConfidenceSection from './ConfidenceSection';
import Testimonials from './Testimonials';
import Newsletter from './Newsletter';
import CarSearch from '../Common/CarSearch';
import { useCarSearch } from '../hooks/CarSearch';
import SearchForm from 'app/Common/SearchForm';

// Create a context to share search functionality between components
const LandingSearchContext = createContext<any>(null);

const LandingContent = () => {
    const searchContext = useContext(LandingSearchContext) as any;
    useEffect(()=>{
    searchContext?.clearFilters();
    },[])
    
    return (
        <>
            <Hero />
             <SearchForm 
               src="landing"
                    onSubmitOverride={searchContext?.handleSearch} 
                    locationList={searchContext?.locations||[]}
                />
            <StepsSection />
            <CarRentalGrid searchContext={searchContext} />
            <ConfidenceSection />
            <Testimonials />
            <Newsletter />
        </>
    );
};

const Landing = () => {
    const {
        cars,
        locations,
        searchData,
        filters,
        loading,
        updateFilters,
        clearFilters,
        setFilters,
        handleSearch,
    } = useCarSearch({
        pageSize: 9,
        debounceMs: 300,
        autoFetchLocations: true,
    });

    const searchContextValue = {
        cars,
        locations,
        searchData,
        filters,
        loading,
        updateFilters,
        setFilters,
        handleSearch,
        clearFilters
    };

    return (
        <LandingSearchContext.Provider value={searchContextValue}>
            <LandingContent />
        </LandingSearchContext.Provider>
    );
};

export default Landing;
import React, { createContext, useContext, useState } from "react";

export const FiltersContext = createContext(null);

export const FiltersProvider = ({ children }) => {
    const initialFilters = {
        EMPLOYEE: { state: null, value: null },
        SERVICE_POINT: { state: null, value: null },
        TEXT: { state: null, value: null },
        USER: { state: null, value: null },
        DATE: { state: null, value: null },
    };

    const [filters, setFilters] = useState(initialFilters);

    const updateFilter = (key, newState, newValue = null) => {
        const updatedFilters = { ...filters };
        updatedFilters[key] = { state: newState, value: newValue };
        setFilters(updatedFilters);
    };

    const resetFilters = () => {
        setFilters(initialFilters);
    };

    return (
        <FiltersContext.Provider value={{ filters, updateFilter, resetFilters }}>
            {children}
        </FiltersContext.Provider>
    );
};

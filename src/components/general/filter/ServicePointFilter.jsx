import React, { useContext, useEffect, useState } from "react";
import { getAllServicePoints } from "../../../apis/servicePointApi.js";
import { FiltersContext } from "../../../context/FilterContext.jsx";
import FilterComponent from "./FilterComponent.jsx";
import { Loader } from "@mantine/core";

const ServicePointFilter = ({ onClose }) => {
    const { filters, updateFilter } = useContext(FiltersContext);
    const [servicePoints, setServicePoints] = useState([]);
    const [servicePointsLoading, setServicePointsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [localFilter, setLocalFilter] = useState(filters.SERVICE_POINT);

    useEffect(() => {
        (async () => {
            try {
                const response = await getAllServicePoints();
                setServicePoints(response);
            } catch (error) {
                setError("Failed to fetch service points");
            } finally {
                setServicePointsLoading(false);
            }
        })();
    }, []);

    const handleServicePointStateChange = (newState, servicePointId) => {
        setLocalFilter({ state: newState, value: servicePointId });
    };

    const applyFilter = () => {
        updateFilter("SERVICE_POINT", localFilter.state, localFilter.value);
        onClose();
    };

    if (servicePointsLoading) {
        return <Loader />;
    }

    return (
        <FilterComponent
            items={servicePoints}
            localFilter={localFilter}
            onStateChange={handleServicePointStateChange}
            onApply={applyFilter}
            onClose={onClose}
            labelExtractor={(point) => `${point.name} (${point.location})`}
            idExtractor={(point) => point.id}
        />
    );
};

export default ServicePointFilter;

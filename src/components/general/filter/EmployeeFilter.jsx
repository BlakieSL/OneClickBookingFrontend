import React, { useContext, useEffect, useState } from "react";
import { getAllEmployees } from "../../../apis/employeeApi.js";
import { FiltersContext } from "../../../context/FilterContext.jsx";
import FilterComponent from "./FilterComponent.jsx";
import { Loader } from "@mantine/core";

const EmployeeFilter = ({ onClose }) => {
    const { filters, updateFilter } = useContext(FiltersContext);
    const [employees, setEmployees] = useState([]);
    const [employeesLoading, setEmployeesLoading] = useState(true);
    const [error, setError] = useState(null);
    const [localFilter, setLocalFilter] = useState(filters.EMPLOYEE);

    useEffect(() => {
        (async () => {
            try {
                const response = await getAllEmployees();
                setEmployees(response);
            } catch (error) {
                setError("Failed to fetch employees");
            } finally {
                setEmployeesLoading(false);
            }
        })();
    }, []);

    const handleEmployeeStateChange = (newState, employeeId) => {
        setLocalFilter({ state: newState, value: employeeId });
    };

    const applyFilter = () => {
        updateFilter("EMPLOYEE", localFilter.state, localFilter.value);
        onClose();
    };

    if (employeesLoading) {
        return <Loader />;
    }

    return (
        <FilterComponent
            items={employees}
            localFilter={localFilter}
            onStateChange={handleEmployeeStateChange}
            onApply={applyFilter}
            onClose={onClose}
            labelExtractor={(employee) => employee.username}
            idExtractor={(employee) => employee.id}
        />
    );
};

export default EmployeeFilter;

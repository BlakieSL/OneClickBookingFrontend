import {useDisclosure} from "@mantine/hooks";
import {useEffect, useState} from "react";
import {getAllServicePoints} from "../../../apis/servicePointApi.js";
import {Loader} from "@mantine/core";
import {getAllTreatmentsByServicePoint} from "../../../apis/treatmentApi.js";
import {getFilteredEmployees} from "../../../apis/employeeApi.js";
import {getSchedule} from "../../../apis/scheduleApi.js";
import {updateBooking} from "../../../apis/bookingApi.js";

const UpdateBookingModal = ({ opened, onClose, onConfirm, initialBooking }) => {
    const [openedConfirm, {open: openConfirm, close: closeConfirm }] = useDisclosure(false);
    const [selectedServicePointId, setSelectedServicePointId] = useState(null);
    const [selectedTreatmentId, setSelectedTreatmentId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

    const [servicePoints, setServicePoints] = useState([]);
    const [treatments, setTreatments] = useState([]);
    const [employees, setEmployees] = useState([]);

    /**
     * @type {[FreeSlots[], Function]}
     */
    const [freeSlots, setFreeSlots] = useState([]);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [servicePointsLoading, setServicePointLoading] = useState(true);
    const [treatmentsLoading, setTreatmentsLoading] = useState(true);
    const [employeesLoading, setEmployeesLoading] = useState(true);
    const [freeSlotsLoading, setFreeSlotsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialBooking) {
            setSelectedServicePointId(initialBooking.servicePoint.id);
            setSelectedTreatmentId(initialBooking.treatmentId);
            setSelectedDate(new Date(initialBooking.date));
            setSelectedEmployeeId(initialBooking.employee.id);
            setSelectedTimeSlot(initialBooking.date);
        }
    }, [initialBooking]);

    useEffect(() => {
        (async () => {
            await fetchServicePoints();
            await fetchTreatmentsByServicePoint();
            await fetchEmployeesByServicePointAndTreatment();
        })();
    }, [selectedServicePointId, selectedTreatmentId]);

    useEffect(() => {
        if (!selectedServicePointId || !selectedTreatmentId || !selectedDate) {
            return;
        }

        (async () => {
            try {
                const filterCriteria = [
                    {
                        filterKey: "SERVICE_POINT",
                        value: selectedServicePointId,
                        operation: "EQUAL"
                    },
                    {
                        filterKey: "DATE",
                        value: formatDate(selectedDate),
                        operation: "EQUAL"
                    },
                ];

                if (selectedEmployeeId) {
                    filterCriteria.push({
                        filterKey: "EMPLOYEE",
                        value: selectedEmployeeId,
                        operation: "EQUAL"
                    })
                }

                const requestBody = {
                    filter: {
                        filterCriteria,
                        dataOption: "AND"
                    },
                    treatmentId: selectedTreatmentId
                }

                const response = await getSchedule(requestBody);


                if (initialBooking.date && !response.includes(initialBooking.date)) {
                    response.push(initialBooking.date);
                }

                setFreeSlots(response.freeSlots);
            } catch (error) {
                setError("Failed to fetch schedule");
                console.error(error);
            } finally {
                setFreeSlotsLoading(false);
            }
        })();
    }, [selectedDate, selectedEmployeeId, selectedServicePointId, selectedTreatmentId]);

    const fetchServicePoints = async () => {
        try {
            const fetchedServicePoints = await getAllServicePoints();
            setServicePoints(fetchedServicePoints);
        } catch (error) {
            setError("Failed to get service points");
            console.error(error);
        } finally {
            setServicePointLoading(false);
        }
    }

    const fetchTreatmentsByServicePoint = async () => {
        try {
            const fetchedTreatments = await getAllTreatmentsByServicePoint(selectedServicePointId);
            setTreatments(fetchedTreatments);
        } catch (error) {
            setError("Failed to get treatments");
            console.error(error);
        } finally {
            setTreatmentsLoading(false);
        }
    }

    const fetchEmployeesByServicePointAndTreatment = async () => {
        if(!selectedTreatmentId) {
            setEmployees([]);
            return;
        }
        try {
            const requestBody = {
                filterCriteria: [
                    {
                        filterKey: "SERVICE_POINT",
                        value: selectedServicePointId,
                        operation: "EQUAL"
                    },
                    {
                        filterKey: "TREATMENT",
                        value: selectedTreatmentId,
                        operation: "EQUAL"
                    }
                ],
                dataOption: "AND"
            }
            const fetchedEmployees = await getFilteredEmployees(requestBody);
            setEmployees(fetchedEmployees);
        } catch (error) {
            setError("Failed to fetch employee");
            console.error(error);
        } finally {
            setEmployeesLoading(false);
        }
    }

    const formatSlot = (slot) => {
        const date = new Date(slot);
        return new Intl.DateTimeFormat(undefined, {
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
        }).format(date);
    };
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const handleServicePointPick = (servicePoint) => {
        setSelectedServicePointId(servicePoint.id);
    }

    const handleTreatmentPick = (treatment) => {
        setSelectedTreatmentId(treatment.id);
    }

    const handleDatePick = (date) => {
        setSelectedDate(date);
    }

    const handleEmployeePick = (employee) => {
        setSelectedEmployeeId(employee.id);
    }

    const handleSlotPick = (slot) => {
        setSelectedTimeSlot(slot);
    }

    const handleContinue = () => {
        openConfirm();
    }

    const handleClose = () => {
        closeConfirm();
    }

    const handleConfirm = async () => {
        setBookingLoading(true);
        const requestBody = {
            date: selectedDate,
            servicePointId: selectedServicePointId,
            employeeId: selectedEmployeeId,
            treatmentId: selectedTreatmentId
        }

        try {
            await updateBooking(initialBooking.id, requestBody);
        } catch (error) {
            setError("Failed to update booking");
            console.error(error);
        } finally {
            setBookingLoading(false);
        }

        closeConfirm();
        onClose();
    }

    if (bookingLoading || servicePointsLoading || treatmentsLoading || employeesLoading || freeSlotsLoading) {
        return <Loader />;
    }

    return (

    );
}

export default UpdateBookingModal;
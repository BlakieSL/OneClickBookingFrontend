import {useDisclosure} from "@mantine/hooks";
import React, {useEffect, useState} from "react";
import {getAllServicePoints} from "../../apis/servicePointApi.js";
import {Box, Button, Group, Loader, Modal} from "@mantine/core";
import {getAllTreatmentsByServicePoint} from "../../apis/treatmentApi.js";
import {getFilteredEmployees} from "../../apis/employeeApi.js";
import {getSchedule} from "../../apis/scheduleApi.js";
import {updateBooking} from "../../apis/bookingApi.js";
import ConfirmModal from "../general/confirmModal/ConfirmModal.jsx";
import styles from "./scheduleModal.module.scss";
import BookingEmployeesCarousel from "./components/BookingEmployeesCarousel.jsx";
import BookingSlotsCarousel from "./components/BookingSlotsCarousel.jsx";
import {DatePicker} from "@mantine/dates";
import BookingServicePointsCarousel from "./components/BookingServicePointsCarousel.jsx";
import SelectTreatment from "./components/SelectTreatment.jsx";
import {showNotification} from "@mantine/notifications";
import {showErrorNotification, showSuccessNotification} from "../../helpers/constants.js";
import {useTranslation} from "react-i18next";

const UpdateBookingModal = ({ opened, onClose, onConfirm, initialBooking }) => {
    const { t } = useTranslation();
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

    useEffect(() => {
        if (initialBooking) {
            handleReset();
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
                let updatedFreeSlots = response.freeSlots;

                const isSameContext =
                    selectedServicePointId === initialBooking.servicePoint.id &&
                    selectedTreatmentId === initialBooking.treatmentId &&
                    selectedEmployeeId === initialBooking.employee.id &&
                    formatDate(selectedDate) === formatDate(new Date(initialBooking.date))

                const isSameContextWithUnselectedEmployee =
                    selectedServicePointId === initialBooking.servicePoint.id &&
                    selectedTreatmentId === initialBooking.treatmentId &&
                    (selectedEmployeeId === null ||  selectedEmployeeId === initialBooking.employee.id) &&
                    formatDate(selectedDate) === formatDate(new Date(initialBooking.date))


                if (isSameContextWithUnselectedEmployee) {
                    updatedFreeSlots = [initialBooking.date, ...updatedFreeSlots];
                }

                const isSlotValid = isSameContext && updatedFreeSlots.includes(selectedTimeSlot);

                if (!isSlotValid) {
                    setSelectedTimeSlot(null);
                }

                setFreeSlots(updatedFreeSlots);
            } catch (error) {
                showErrorNotification(error);
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
            showErrorNotification(error);
            console.error(error);
        } finally {
            setServicePointLoading(false);
        }
    }

    const fetchTreatmentsByServicePoint = async () => {
        if (!selectedServicePointId) return;
        try {
            const fetchedTreatments = await getAllTreatmentsByServicePoint(selectedServicePointId);
            setTreatments(fetchedTreatments);
        } catch (error) {
            showErrorNotification(error);
            console.error(error);
        } finally {
            setTreatmentsLoading(false);
        }
    }

    const fetchEmployeesByServicePointAndTreatment = async () => {
        if (!selectedServicePointId) return;
        try {
            const filterCriteria = [
                {
                    filterKey: "SERVICE_POINT",
                    value: selectedServicePointId,
                    operation: "EQUAL"
                }
            ];

            if (selectedTreatmentId) {
                filterCriteria.push({
                    filterKey: "TREATMENT",
                    value: selectedTreatmentId,
                    operation: "EQUAL"
                });
            }

            const requestBody = {
                filterCriteria,
                dataOption: "AND"
            };

            const fetchedEmployees = await getFilteredEmployees(requestBody);
            setEmployees(fetchedEmployees);
        } catch (error) {
            showErrorNotification(error);
            console.error(error);
        } finally {
            setEmployeesLoading(false);
        }
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const handleServicePointPick = (servicePoint) => {
        setSelectedServicePointId(servicePoint.id);
        setSelectedTreatmentId(null);
        setSelectedEmployeeId(null);
        setSelectedTimeSlot(null);
        setFreeSlots([]);
    }

    const handleTreatmentPick = (treatmentId) => {
        setSelectedTreatmentId(parseInt(treatmentId));
        setSelectedEmployeeId(null);
        setSelectedTimeSlot(null);
        setFreeSlots([]);
    }

    const handleDatePick = (date) => {
        setSelectedDate(date);
        setSelectedTimeSlot(null);
        setFreeSlots([]);
    }

    const handleEmployeePick = (employee) => {
        setSelectedEmployeeId((previouslySelectedEmployeeId) =>
            previouslySelectedEmployeeId === employee.id ? null : employee.id
        );
        setSelectedTimeSlot(null);
        setFreeSlots([]);
    }

    const handleSlotPick = (slot) => {
        if (!selectedEmployeeId) return;
        setSelectedTimeSlot((prevSelectedSlot) =>
            prevSelectedSlot === slot ? null : slot
        );
    }

    const handleConfirm = async () => {
        setBookingLoading(true);
        const requestBody = {
            date: selectedTimeSlot,
            servicePointId: selectedServicePointId,
            employeeId: selectedEmployeeId,
            treatmentId: selectedTreatmentId
        }

        try {
            await updateBooking(initialBooking.id, requestBody);
            onConfirm();
            showSuccessNotification(t('successMessages.bookingUpdated'));
        } catch (error) {
            showErrorNotification(error);
            console.error(error);
        } finally {
            setBookingLoading(false);
        }

        closeConfirm();
        onClose();
    }

    const handleReset = () => {
        setSelectedServicePointId(initialBooking.servicePoint.id);
        setSelectedTreatmentId(initialBooking.treatmentId);
        setSelectedDate(new Date(initialBooking.date));
        setSelectedEmployeeId(initialBooking.employee.id);
        setSelectedTimeSlot(initialBooking.date);
    }

    if (bookingLoading || servicePointsLoading || treatmentsLoading || employeesLoading || freeSlotsLoading) {
        return <Loader />;
    }

    return (
        <>
            <Modal
                title={t('updateBookingModal.modalTitle')}
                opened={opened}
                onClose={onClose}
                styles = {{
                    content: {
                        minWidth: '800px',
                    },
                    title: {
                        fontSize: '22px',
                        fontWeight: '600',
                        marginBottom: '15px',
                    }
                }}
            >
                <Box className={styles.innerBox}>
                    <Box className={styles.innerBox__boxWithShadow}>
                        <BookingServicePointsCarousel
                            servicePoints={servicePoints}
                            selectedServicePointId={selectedServicePointId}
                            handleServicePointPick={handleServicePointPick}
                        />

                        <div className={styles.innerBox__divider}></div>

                        <SelectTreatment
                            treatments={treatments}
                            selectedTreatmentId={selectedTreatmentId}
                            handleTreatmentPick={handleTreatmentPick}
                        />
                    </Box>

                    <Box className={styles.innerBox__boxWithShadow}>
                        <DatePicker
                            value={selectedDate}
                            onChange={handleDatePick}
                            minDate={new Date()}
                            numberOfColumns={2}
                            size="lg"
                            defaultDate={selectedDate}
                        />
                    </Box>

                    <Box className={styles.innerBox__boxWithShadow}>
                        <BookingEmployeesCarousel
                            employees={employees}
                            selectedEmployeeId={selectedEmployeeId}
                            handleEmployeePick={handleEmployeePick}
                        />

                        <div className={styles.innerBox__divider}></div>

                        <BookingSlotsCarousel
                            freeSlots={freeSlots}
                            selectedSlot={selectedTimeSlot}
                            handleSlotPick={handleSlotPick}
                        />
                    </Box>
                    <Group grow>
                        <Button variant="outline" onClick={handleReset}>
                            {t('buttons.reset')}
                        </Button>
                        <Button onClick={openConfirm}>
                            {t('buttons.continue')}
                        </Button>
                    </Group>
                </Box>
            </Modal>
            {openedConfirm && (
                <ConfirmModal
                    opened={openedConfirm}
                    onClose={closeConfirm}
                    onConfirm={handleConfirm}
                />
            )}
        </>
    );
}

export default UpdateBookingModal;
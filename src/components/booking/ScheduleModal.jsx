import {useEffect, useState} from "react";
import {Box, Button, Loader, Modal, Text} from "@mantine/core";
import {getSchedule} from "../../apis/scheduleApi.js";
import {DatePicker} from "@mantine/dates";
import styles from "./scheduleModal.module.scss";
import {useDisclosure} from "@mantine/hooks";
import ConfirmModal from "../general/confirmModal/ConfirmModal.jsx";
import {createBooking} from "../../apis/bookingApi.js";
import {getFilteredEmployees} from "../../apis/employeeApi.js";
import BookingEmployeesCarousel from "./components/BookingEmployeesCarousel.jsx";
import BookingSlotsCarousel from "./components/BookingSlotsCarousel.jsx";
import {showErrorNotification, showSuccessNotification} from "../../helpers/constants.js";
import {useTranslation} from "react-i18next";

const ScheduleModal = ({ treatment, servicePoint, opened, onClose }) => {
    const { t } = useTranslation();
    const [openedConfirm, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);
    const [employees, setEmployees] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    /**
     * @type {[FreeSlots[], Function]}
     */
    const [freeSlots, setFreeSlots] = useState([]);
    const [employeesLoading, setEmployeesLoading] = useState(true);
    const [freeSlotsLoading, setFreeSlotsLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const filterCriteria = [
                    {
                        filterKey: "SERVICE_POINT",
                        value: servicePoint.id,
                        operation: "EQUAL"
                    },
                    {
                        filterKey: "DATE",
                        value: formatDate(selectedDate),
                        operation: "EQUAL"
                    },
                ];

                if (selectedEmployee) {
                    filterCriteria.push({
                        filterKey: "EMPLOYEE",
                        value: selectedEmployee.id,
                        operation: "EQUAL"
                    })
                }

                const requestBody = {
                    filter: {
                        filterCriteria,
                        dataOption: "AND"
                    },
                    treatmentId: treatment.id
                }

                const response = await getSchedule(requestBody);

                setFreeSlots(response.freeSlots);
            } catch (error) {
                showErrorNotification(error);
                console.error(error);
            } finally {
                setFreeSlotsLoading(false);
            }
        })();
    }, [selectedDate, selectedEmployee, servicePoint.id, treatment.id]);

    useEffect(() => {
        (async () => {
            try {
                const requestBody = {
                    filterCriteria: [
                        {
                            filterKey: "SERVICE_POINT",
                            value: servicePoint.id,
                            operation: "EQUAL"
                        },
                        {
                            filterKey: "TREATMENT",
                            value: treatment.id,
                            operation: "EQUAL"
                        }
                    ],
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
        })();
    },[servicePoint, treatment]);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    const handleDatePick = (date) => {
        setSelectedDate(date);
    }
    const handleEmployeePick = (employee) => {
        setSelectedEmployee((prevSelectedEmployee) =>
            prevSelectedEmployee?.id === employee.id ? null : employee
        );
        setSelectedSlot(null);
    };
    const handleSlotPick = (slot) => {
        if (!selectedEmployee) return;
        setSelectedSlot((prevSelectedSlot) =>
            prevSelectedSlot === slot ? null : slot
        );
    };
    const handleContinue = () => {
        openConfirm();
    }
    const handleConfirm = async () => {
        setBookingLoading(true);
        const requestBody = {
            date: selectedSlot,
            servicePointId: servicePoint.id,
            employeeId: selectedEmployee.id,
            treatmentId: treatment.id
        }
        try {
            await createBooking(requestBody);
            showSuccessNotification(t('successMessages.bookingCreated'));
        } catch (error) {
            console.error(error);
            showErrorNotification(error)
        } finally {
            setBookingLoading(false);
        }

        closeConfirm();
        onClose();
    }
    const handleClose = () => {
        closeConfirm();
    }

    if(freeSlotsLoading || bookingLoading || employeesLoading){
        return <Loader />;
    }


    return (
        <>
            <Modal
                title={`${treatment.name}`}
                opened={opened}
                onClose={onClose}
                styles={{
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
                        <Text>{t('scheduleModal.selectDate')}</Text>
                        <DatePicker
                            value={selectedDate}
                            onChange={handleDatePick}
                            minDate={new Date()}
                            numberOfColumns={2}
                            size="lg"
                        />
                    </Box>
                    <Box className={styles.innerBox__boxWithShadow}>
                        <BookingEmployeesCarousel
                            employees={employees}
                            selectedEmployeeId={selectedEmployee?.id}
                            handleEmployeePick={handleEmployeePick}
                        />

                        <div className={styles.innerBox__divider}></div>

                        <BookingSlotsCarousel
                            freeSlots={freeSlots}
                            selectedSlot={selectedSlot}
                            handleSlotPick={handleSlotPick}
                        />
                    </Box>
                    <Button disabled={!selectedSlot} onClick={handleContinue}>
                        {t('buttons.continue')}
                    </Button>
                </Box>
            </Modal>

            {openedConfirm && (
                <ConfirmModal
                    opened={openedConfirm}
                    onClose={handleClose}
                    onConfirm={handleConfirm}
                />
            )}
        </>
    );
};

export default ScheduleModal;
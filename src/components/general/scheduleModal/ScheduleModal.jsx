import {useEffect, useState} from "react";
import {Box, Button, Loader, Modal, ScrollArea, Text} from "@mantine/core";
import {getSchedule} from "../../../apis/scheduleApi.js";
import {DatePicker} from "@mantine/dates";
import styles from "./scheduleModal.module.scss";
import ServicePointEmployeeCard from "../../servicePoint/employeesCard/ServicePointEmployeeCard.jsx";
import SlotBadge from "../slotBadge/SlotBadge.jsx";
import {Carousel} from "@mantine/carousel";
import {useDisclosure} from "@mantine/hooks";
import ConfirmModal from "./confirmModal/ConfirmModal.jsx";
import {createBooking} from "../../../apis/bookingApi.js";
import {getFilteredReviews} from "../../../apis/reviewApi.js";
import {getFilteredEmployees} from "../../../apis/employeeApi.js";

const ScheduleModal = ({ treatment, servicePoint, opened, onClose }) => {
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
    const [error, setError] = useState(null);

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
                setError("Failed to fetch schedule");
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
                setError("Failed to fetch employees");
                console.error(error);
            } finally {
                setEmployeesLoading(false);
            }
        })();
    },[servicePoint, treatment]);

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
        } catch (error) {
            setError("Failed to create booking");
            console.error(error);
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
                    <Box className={styles.innerBox__dateBox}>
                        <Text>Select a Date</Text>
                        <DatePicker
                            value={selectedDate}
                            onChange={handleDatePick}
                            minDate={new Date()}
                            numberOfColumns={2}
                            size="lg"
                        />
                    </Box>
                    <Box className={styles.innerBox__employeesAndSlotsBox}>
                        <Carousel
                            withIndicators
                            dragFree
                            slideGap="sm"
                            align="start"
                            slideSize="10%"
                            height={150}
                            styles={{
                                container: {
                                    paddingTop: '5px',
                                    userSelect: 'none',
                                },
                                control: {
                                    opacity: '50%',
                                    width: '32px',
                                    height: '32px',
                                },
                            }}
                        >
                            {employees.map((employee) => (
                                <Carousel.Slide
                                    key={employee.id}
                                    onClick={() => handleEmployeePick(employee)}
                                >
                                    <ServicePointEmployeeCard
                                        employee={employee}
                                        isSelected={selectedEmployee?.id === employee.id}
                                    />
                                </Carousel.Slide>
                            ))}
                        </Carousel>

                        <div className={styles.innerBox__divider}></div>

                        <Carousel
                            dragFree
                            withControls={false}
                            slideSize="13%"
                            slideGap="xs"
                            align="start"
                            height={45}
                            styles={{
                                container: {
                                    paddingTop: '5px',
                                    userSelect: 'none',
                                },
                            }}
                        >
                            {freeSlots.map((slot) => (
                                <Carousel.Slide key={slot}>
                                    <SlotBadge
                                        onClick={() => handleSlotPick(slot)}
                                        slot={formatSlot(slot)}
                                        isSelected={selectedSlot === slot}
                                    />
                                </Carousel.Slide>
                            ))}
                        </Carousel>
                    </Box>
                    <Button className={styles.button} disabled={!selectedSlot} onClick={handleContinue}>
                        Continue
                    </Button>
                </Box>
            </Modal>

            <ConfirmModal
                opened={openedConfirm}
                onClose={handleClose}
                onConfirm={handleConfirm}
            />
        </>
    );
};

export default ScheduleModal;
import {useEffect, useState} from "react";
import {Badge, Box, Button, Loader, Modal, ScrollArea, Text} from "@mantine/core";
import {getSchedule} from "../../../apis/scheduleApi.js";
import {Calendar, DatePicker, DatePickerInput} from "@mantine/dates";

const ScheduleModal = ({ employees, treatment, servicePoint, opened, onClose}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    /**
     * @type {[FreeSlots[], Function]}
     */
    const [freeSlots, setFreeSlots] = useState([]);

    const [freeSlotsLoading, setFreeSlotsLoading] = useState(true);

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
                        value: selectedDate.toISOString().split('T')[0],
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

                if (response && Array.isArray(response.freeSlots)) {
                    setFreeSlots(response.freeSlots);
                } else {
                    console.error("Unexpected API response:", response);
                    setFreeSlots([]); // Fallback to empty array
                }
            } catch (error) {
                setError("Failed to fetch schedule");
                console.error(error);
            } finally {
                setFreeSlotsLoading(false);
            }
        })();
    }, [selectedDate, selectedEmployee, servicePoint.id, treatment.id]);

    useEffect(() => {
        console.log(freeSlots);
    }, [freeSlots]);

    const handleDatePick = (date) => {
        setSelectedDate(date);
    }

    const handleEmployeePick = (employee) => {
        setSelectedEmployee(employee)
    }

    const handleSlotPick = (slot) => {
        setSelectedSlot(slot);
    };

    if(freeSlotsLoading){
        return <Loader />;
    }

    return (
        <Modal opened={opened} onClose={onClose}>
            <Box>
                <Text>Select a Date</Text>
                <DatePicker
                    value={selectedDate}
                    onChange={handleDatePick}
                    minDate={new Date()}
                    size="xl"
                />

                <Text>Select an Employee</Text>
                <ScrollArea type="auto">
                    <Box>
                        {employees.map((employee) => (
                            <Badge
                                key={employee.id}
                                onClick={() => handleEmployeePick(employee)}
                            >
                                {employee.username}
                            </Badge>
                        ))}
                    </Box>
                </ScrollArea>

                <Text >Available Slots</Text>
                <ScrollArea type="auto">
                    <Box>
                        {freeSlots.map((slot) => (
                            <Badge
                                key={slot}
                                onClick={() => handleSlotPick(slot)}
                            >
                                {slot}
                            </Badge>
                        ))}
                    </Box>

                </ScrollArea>

                <Button disabled={!selectedSlot}>
                    Continue
                </Button>
            </Box>
        </Modal>
    );
};

export default ScheduleModal;
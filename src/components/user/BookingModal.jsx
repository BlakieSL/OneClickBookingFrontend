import {useForm} from "@mantine/form";
import {useEffect} from "react";

const BookingModal = ({ opened, close, onConfirm, bookingInfo }) => {

    const form = useForm({
        initialValues: {
            id: bookingInfo.id,
            date: bookingInfo.date,
            servicePointId: bookingInfo.servicePoint.id,
            employeeId: bookingInfo.employee?.id ?? null,
            treatmentId: bookingInfo.treatmentId ?? null
        },
        validate: {

        }
    });

    const handleUpdate = async () => {

    }
}

export default BookingModal;


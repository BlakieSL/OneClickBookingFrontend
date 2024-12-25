import {Box, em, ScrollArea} from "@mantine/core";
import styles from "./servicePointDetails.module.scss";
import ServicePointEmployeeCard from "./ServicePointEmployeeCard.jsx";
const ServicePointDetails = ({ servicePoint, employees }) => {
    return (
        <Box>
            <Box className={styles.details}>
                <Text className={styles.details__text}>{servicePoint.name}</Text>
                <Text className={styles.details__text}>{servicePoint.location}</Text>
                <Text className={styles.details__text}>{servicePoint.email}</Text>
                <Text className={styles.details__text}>{servicePoint.phone}</Text>
            </Box>
            <ScrollArea type="auto" className={styles.scrollable}>
                <Box className={styles.employeeList}>
                    {employees.map((employee) => (
                        <ServicePointEmployeeCard key={employee.id} employee={employee} />
                    ))}
                </Box>
            </ScrollArea>
        </Box>
    )
}

export default ServicePointDetails;
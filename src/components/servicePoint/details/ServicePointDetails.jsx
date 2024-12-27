import {Box, ScrollArea, Text} from "@mantine/core";
import ServicePointEmployeeCard from "../employeesCard/ServicePointEmployeeCard.jsx";
import styles from "./servicePointDetails.module.scss";

const ServicePointDetails = ({ servicePoint, employees }) => {


    return (
        <Box className={styles.servicePointDetails}>
            <Box className={styles.servicePointDetails__info}>
                <Text>{servicePoint.name}</Text>
                <Text>{servicePoint.location}</Text>
                <Text >{servicePoint.email}</Text>
                <Text>{servicePoint.phone}</Text>
            </Box>
            <Box className={styles.servicePointDetails__textContainer}>
                <Text className={styles.servicePointDetails__textContainer__heading}>Employees</Text>
            </Box>
            <ScrollArea type="auto" className={styles.servicePointDetails__scrollArea}>
                <Box className={styles.servicePointDetails__employees}>
                    {employees.map((employee) => (
                        <ServicePointEmployeeCard key={employee.id} employee={employee} servicePointId={servicePoint.id}/>
                    ))}
                </Box>
            </ScrollArea>
        </Box>
    )
}

export default ServicePointDetails;
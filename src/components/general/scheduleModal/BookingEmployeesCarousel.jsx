import ServicePointEmployeeCard from "../cards/employeeCard/ServicePointEmployeeCard.jsx";
import {Carousel} from "@mantine/carousel";

const BookingEmployeesCarousel = ({ employees, selectedEmployeeId, handleEmployeePick }) => {
    return (
        <Carousel
            withIndicators
            dragFree
            slideGap="sm"
            align="start"
            slideSize="10%"
            height={150}
            styles={{
                container: {
                    userSelect: 'none',
                },
                control: {
                    opacity: '50%',
                    width: '32px',
                    height: '32px',
                },
                viewport: {
                    padding: '15px',
                },
                indicators: {
                  bottom: '0px'
                },
                indicator: {
                    backgroundColor: '#445649'
                }
            }}
        >
            {employees.map((employee) => (
                <Carousel.Slide
                    key={employee.id}
                    onClick={() => handleEmployeePick(employee)}
                >
                    <ServicePointEmployeeCard
                        employee={employee}
                        isSelected={selectedEmployeeId === employee.id}
                    />
                </Carousel.Slide>
            ))}
        </Carousel>
    );
};

export default BookingEmployeesCarousel;
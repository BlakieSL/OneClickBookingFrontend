import {Carousel} from "@mantine/carousel";
import ServicePointCard from "../cards/servicePointCard/ServicePointCard.jsx";

const BookingServicePointsCarousel = ({ servicePoints, selectedServicePointId, handleServicePointPick }) => {
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
                    padding: '20px',
                },
                indicators: {
                    bottom: '0px'
                },
                indicator: {
                    backgroundColor: '#445649'
                }
            }}
        >
            {servicePoints.map((servicePoint) => (
                <Carousel.Slide
                    key={servicePoint.id}
                    onClick={() => handleServicePointPick(servicePoint)}
                >
                    <ServicePointCard
                        servicePoint={servicePoint}
                        isSelected={selectedServicePointId === servicePoint.id}
                        size="small"
                    />
                </Carousel.Slide>
            ))}
        </Carousel>
    );
};

export default BookingServicePointsCarousel;
import React from 'react';
import { Carousel } from "@mantine/carousel";
import SlotBadge from "../cards/slotBadge/SlotBadge.jsx";


const BookingSlotsCarousel = ({ freeSlots, selectedSlot, handleSlotPick }) => {
    const formatSlot = (slot) => {
        const date = new Date(slot);
        return new Intl.DateTimeFormat(undefined, {
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
        }).format(date);
    };

    return (
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
    );
};

export default BookingSlotsCarousel;

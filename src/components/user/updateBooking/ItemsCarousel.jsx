import {Carousel} from "@mantine/carousel";

const ItemsCarousel = ({ items, onClick }) => {
    return (
        <Carousel
            dragFree
            withIndicators
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
            {items.map((item) => (
                <Carousel.Slide
                    key={item.id}
                    onClick={() => onClick(item)}
                >

                </Carousel.Slide>
            ))}
        </Carousel>
    )
};

export default ItemsCarousel;
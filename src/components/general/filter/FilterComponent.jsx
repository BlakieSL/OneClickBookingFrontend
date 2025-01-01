import React from "react";
import { Box, Button, Group, Text } from "@mantine/core";
import TriStateCheckbox from "./TriStateCheckBox.jsx";

const FilterComponent = ({
     items = [],
     localFilter,
     onStateChange,
     onApply,
     onClose,
     labelExtractor = (item) => item.name,
     idExtractor = (item) => item.id
}) => {
    return (
        <>
            <Button variant="outline" mb="xs" onClick={onClose}>Go Back</Button>
            {items.map((item) => (
                <Group key={idExtractor(item)}>
                    <TriStateCheckbox
                        onChange={(newState) => onStateChange(newState, idExtractor(item))}
                        state={
                            localFilter.value === idExtractor(item)
                                ? localFilter.state
                                : null
                        }
                    />
                    <Text>{labelExtractor(item)}</Text>
                </Group>
            ))}
            <Button mt="xs" fullWidth onClick={onApply}>Save</Button>
        </>
    );
};

export default FilterComponent;

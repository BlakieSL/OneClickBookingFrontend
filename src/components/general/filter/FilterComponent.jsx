import React from "react";
import {Button, Group, Text} from "@mantine/core";
import TriStateCheckbox from "./TriStateCheckBox.jsx";
import {useTranslation} from "react-i18next";

const FilterComponent = ({
     items = [],
     localFilter,
     onStateChange,
     onApply,
     onClose,
     labelExtractor = (item) => item.name,
     idExtractor = (item) => item.id
}) => {
    const { t } = useTranslation();
    return (
        <>
            <Button variant="outline" mb="xs" onClick={onClose}>{t('filterComponent.goBack')}</Button>
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
            <Button mt="xs" fullWidth onClick={onApply}>{t('buttons.save')}</Button>
        </>
    );
};

export default FilterComponent;

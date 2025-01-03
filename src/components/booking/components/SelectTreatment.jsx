import {Select} from "@mantine/core";
import {useTranslation} from "react-i18next";

const SelectTreatment = ({ treatments, selectedTreatmentId, handleTreatmentPick }) => {
    const { t } = useTranslation();
    return (
        <Select
            placeholder={t('selectTreatment.placeholder')}
            value={selectedTreatmentId ? selectedTreatmentId.toString() : null}
            onChange={(value) => handleTreatmentPick(value)}
            data={treatments.map((treatment) => ({
                value: treatment.id.toString(),
                label: `${treatment.name} (${treatment.price.toFixed(2)} zl, ${treatment.duration} min)`,
            }))}
            nothingFoundMessage={t('selectTreatment.nothingFoundMessage')}
            styles={{
                input: {
                    cursor: 'pointer',
                    borderColor: '#445649'
                }
            }}
        />
    );
};

export default SelectTreatment;

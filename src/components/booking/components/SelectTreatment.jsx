import {Select} from "@mantine/core";

const SelectTreatment = ({ treatments, selectedTreatmentId, handleTreatmentPick }) => {
    return (
        <Select
            placeholder="Pick a treatment"
            value={selectedTreatmentId ? selectedTreatmentId.toString() : null}
            onChange={(value) => handleTreatmentPick(value)}
            data={treatments.map((treatment) => ({
                value: treatment.id.toString(),
                label: `${treatment.name} (${treatment.price.toFixed(2)} zl, ${treatment.duration} min)`,
            }))}
            nothingFoundMessage="No treatments available"
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

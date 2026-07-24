import { MapPin, Building2, Landmark } from "lucide-react";

import { useAdmission } from "../../../../contexts/AdmissionContext";

import SectionCard from "../../../../components/layout/SectionCard";
import FormGrid from "../../../../components/forms/FormGrid";
import TextField from "../../../../components/forms/TextField";
import SelectField from "../../../../components/forms/SelectField";
import Checkbox from "../../../../components/forms/Checkbox";

import { indianStates } from "../../../../config/indianStates";

export default function AddressDetails() {

    const {

        formData,

        updateAddressField,

    } = useAdmission();

    function copyPermanentAddress(checked:boolean){

        updateAddressField("sameAsPermanent",checked);

        if(!checked) return;

        updateAddressField(
            "correspondenceAddress",
            formData.address.permanentAddress
        );

        updateAddressField(
            "correspondenceVillage",
            formData.address.permanentVillage
        );

        updateAddressField(
            "correspondencePO",
            formData.address.permanentPO
        );

        updateAddressField(
            "correspondencePS",
            formData.address.permanentPS
        );

        updateAddressField(
            "correspondenceDistrict",
            formData.address.permanentDistrict
        );

        updateAddressField(
            "correspondenceState",
            formData.address.permanentState
        );

        updateAddressField(
            "correspondencePincode",
            formData.address.permanentPincode
        );

    }

    return(
    <>
                    <SectionCard
                title="Permanent Address"
                description="Student's permanent residential address."
            >

                <FormGrid>

                    <TextField
                        label="Full Address"
                        required
                        leftIcon={<MapPin size={16}/>}
                        value={formData.address.permanentAddress}
                        onChange={(e)=>
                            updateAddressField(
                                "permanentAddress",
                                e.target.value
                            )
                        }
                    />

                    <TextField
                        label="Village / Locality"
                        value={formData.address.permanentVillage}
                        onChange={(e)=>
                            updateAddressField(
                                "permanentVillage",
                                e.target.value
                            )
                        }
                    />

                    <TextField
                        label="Post Office"
                        value={formData.address.permanentPO}
                        onChange={(e)=>
                            updateAddressField(
                                "permanentPO",
                                e.target.value
                            )
                        }
                    />

                    <TextField
                        label="Police Station"
                        value={formData.address.permanentPS}
                        onChange={(e)=>
                            updateAddressField(
                                "permanentPS",
                                e.target.value
                            )
                        }
                    />

                    <TextField
                        label="District"
                        leftIcon={<Building2 size={16}/>}
                        value={formData.address.permanentDistrict}
                        onChange={(e)=>
                            updateAddressField(
                                "permanentDistrict",
                                e.target.value
                            )
                        }
                    />

                    <SelectField
                        label="State"
                        leftIcon={<Landmark size={16}/>}
                        value={formData.address.permanentState}
                        options={indianStates}
                        onChange={(e)=>
                            updateAddressField(
                                "permanentState",
                                e.target.value
                            )
                        }
                    />

                    <TextField
                        label="PIN Code"
                        inputMode="numeric"
                        maxLength={6}
                        value={formData.address.permanentPincode}
                        onChange={(e)=>
                            updateAddressField(
                                "permanentPincode",
                                e.target.value
                            )
                        }
                    />

                </FormGrid>

            </SectionCard>

            <SectionCard
                title="Correspondence Address"
                description="Current communication address."
            >

                <Checkbox
                    label="Same as Permanent Address"
                    checked={formData.address.sameAsPermanent}
                    onChange={(e)=>
                        copyPermanentAddress(
                            e.target.checked
                        )
                    }
                />

                <FormGrid>

                    <TextField
                        label="Full Address"
                        value={formData.address.correspondenceAddress}
                        disabled={formData.address.sameAsPermanent}
                        onChange={(e)=>
                            updateAddressField(
                                "correspondenceAddress",
                                e.target.value
                            )
                        }
                    />

                    <TextField
                        label="Village / Locality"
                        value={formData.address.correspondenceVillage}
                        disabled={formData.address.sameAsPermanent}
                        onChange={(e)=>
                            updateAddressField(
                                "correspondenceVillage",
                                e.target.value
                            )
                        }
                    />

                    <TextField
                        label="Post Office"
                        value={formData.address.correspondencePO}
                        disabled={formData.address.sameAsPermanent}
                        onChange={(e)=>
                            updateAddressField(
                                "correspondencePO",
                                e.target.value
                            )
                        }
                    />

                    <TextField
                        label="Police Station"
                        value={formData.address.correspondencePS}
                        disabled={formData.address.sameAsPermanent}
                        onChange={(e)=>
                            updateAddressField(
                                "correspondencePS",
                                e.target.value
                            )
                        }
                    />

                    <TextField
                        label="District"
                        value={formData.address.correspondenceDistrict}
                        disabled={formData.address.sameAsPermanent}
                        onChange={(e)=>
                            updateAddressField(
                                "correspondenceDistrict",
                                e.target.value
                            )
                        }
                    />

                    <SelectField
                        label="State"
                        value={formData.address.correspondenceState}
                        options={indianStates}
                        disabled={formData.address.sameAsPermanent}
                        onChange={(e)=>
                            updateAddressField(
                                "correspondenceState",
                                e.target.value
                            )
                        }
                    />

                    <TextField
                        label="PIN Code"
                        inputMode="numeric"
                        maxLength={6}
                        value={formData.address.correspondencePincode}
                        disabled={formData.address.sameAsPermanent}
                        onChange={(e)=>
                            updateAddressField(
                                "correspondencePincode",
                                e.target.value
                            )
                        }
                    />

                </FormGrid>

            </SectionCard>

        </>

    );

}
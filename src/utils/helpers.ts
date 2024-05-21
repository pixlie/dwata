import { FormFieldData } from "../api_types/FormFieldData";

const getSingleText = (value?: FormFieldData): string => {
    return !!value &&
            "single" in value &&
            "Text" in value.single
              ? value.single.Text
              : ""
}

export { getSingleText }
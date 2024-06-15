import { EditData, FormDataType } from '../types';

type PropType = {
	formData: FormDataType;
	data?: EditData;
};

export function useIsDirty({ formData, data }: Readonly<PropType>) {
	return () => {
		let isDirty = false;

		if (data) {
			isDirty ||= formData.form_name?.value !== data.form_name;
		} else {
			isDirty ||= formData.form_name?.value?.trim() !== '';
		}

		return isDirty;
	};
}

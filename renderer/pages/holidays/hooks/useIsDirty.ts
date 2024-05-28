import { EditData, FormDataType } from '../types';

type PropType = {
	formData: FormDataType;
	data?: EditData;
};

export function useIsDirty({ formData, data }: Readonly<PropType>) {
	return () => {
		let isDirty = false;

		if (data) {
			isDirty ||= formData.date?.value?.getTime() !== data.date?.getTime();
			isDirty ||= formData.description?.value.trim() !== data.description;
		} else {
			isDirty ||= formData.date?.value !== undefined;
			isDirty ||= formData.description?.value.trim() !== '';
		}

		return isDirty;
	};
}

import { isSameDay } from '../../../utils/dateOperations';
import { EditData, FormDataType } from '../types';

type PropType = {
	formData: FormDataType;
	data?: EditData;
};

export function useIsDirty({ formData, data }: Readonly<PropType>) {
	return () => {
		let isDirty = false;

		if (data) {
			isDirty ||= !isSameDay(formData.date?.value, data.date);
			isDirty ||= formData.description?.value !== data.description;
		} else {
			isDirty ||= formData.date?.value !== undefined;
			isDirty ||= formData.description?.value.trim() !== '';
		}

		return isDirty;
	};
}

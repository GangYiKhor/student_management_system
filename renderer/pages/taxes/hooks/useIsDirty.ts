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
			isDirty ||= formData.percentage?.value !== data.percentage;
			isDirty ||= !isSameDay(formData.start_date?.value, data.start_date);
			isDirty ||= !isSameDay(formData.end_date?.value, data.end_date);
			isDirty ||= formData.inclusive?.value !== data.inclusive;
		} else {
			isDirty ||= formData.percentage?.value !== undefined;
			isDirty ||= formData.start_date?.value !== undefined;
			isDirty ||= formData.end_date?.value !== undefined;
			isDirty ||= formData.inclusive?.value !== undefined;
		}

		return isDirty;
	};
}

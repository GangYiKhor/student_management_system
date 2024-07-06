import { getToday, isSameDay } from '../../../utils/dateOperations';
import { EditData, FormDataType } from '../types';

type PropType = {
	formData: FormDataType;
	data?: EditData;
};

export function useIsDirty({ formData, data }: Readonly<PropType>) {
	return () => {
		let isDirty = false;

		if (data) {
			isDirty ||= formData.id?.value?.trim() !== data.id;
			isDirty ||= formData.student_id?.value !== data.student_id;
			isDirty ||= formData.discount?.value !== data.discount;
			isDirty ||= formData.is_percentage?.value !== data.is_percentage;
			isDirty ||= !isSameDay(formData.start_date?.value, data.start_date);
			isDirty ||= !isSameDay(formData.expired_at?.value, data.expired_at);
			isDirty ||= formData.used?.value !== data.used;
		} else {
			isDirty ||= formData.id?.value?.trim() !== '';
			isDirty ||= formData.student_id?.value !== undefined;
			isDirty ||= formData.discount?.value !== undefined;
			isDirty ||= formData.is_percentage?.value !== undefined;
			isDirty ||= !isSameDay(formData.start_date?.value, getToday());
			isDirty ||= formData.expired_at?.value !== undefined;
			isDirty ||= formData.used?.value !== false;
		}

		return isDirty;
	};
}

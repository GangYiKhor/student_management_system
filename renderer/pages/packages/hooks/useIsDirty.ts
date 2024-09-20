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
			isDirty ||= formData?.form_id?.value !== data.form_id;
			isDirty ||= !isSameDay(formData?.start_date?.value, data.start_date);
			isDirty ||= !isSameDay(formData?.end_date?.value, data.end_date);
			isDirty ||= formData?.subject_count_from?.value !== data.subject_count_from;
			isDirty ||= formData?.subject_count_to?.value !== data.subject_count_to;
			isDirty ||= formData?.discount_per_subject?.value !== data.discount_per_subject;
		} else {
			isDirty ||= formData?.form_id?.value !== undefined;
			isDirty ||= formData?.start_date?.value !== undefined;
			isDirty ||= formData?.end_date?.value !== undefined;
			isDirty ||= formData?.subject_count_from?.value !== undefined;
			isDirty ||= formData?.subject_count_to?.value !== undefined;
			isDirty ||= formData?.discount_per_subject?.value !== undefined;
		}

		return isDirty;
	};
}

import { isSameDay, isSameTime } from '../../../utils/dateOperations';
import { EditData, FormDataType } from '../types';

type PropType = {
	formData: FormDataType;
	data?: EditData;
};

export function useIsDirty({ formData, data }: Readonly<PropType>) {
	return () => {
		let isDirty = false;

		if (data) {
			isDirty ||= formData?.teacher_id?.value !== data.teacher_id;
			isDirty ||= !isSameDay(formData?.start_date?.value, data.start_date);
			isDirty ||= !isSameDay(formData?.end_date?.value, data.end_date);
			isDirty ||= formData?.class_year?.value !== data.class_year;
			isDirty ||= formData?.form_id?.value !== data.form_id;
			isDirty ||= formData?.day?.value !== data.day;
			isDirty ||= !isSameTime(formData?.start_time?.value, data.start_time);
			isDirty ||= !isSameTime(formData?.end_time?.value, data.end_time);
			isDirty ||= formData?.fees?.value !== data.fees;
			isDirty ||= formData?.is_package?.value !== data.is_package;
			isDirty ||= formData?.class_name?.value !== data.class_name;
		} else {
			isDirty ||= formData?.teacher_id?.value !== undefined;
			isDirty ||= formData?.start_date?.value !== undefined;
			isDirty ||= formData?.end_date?.value !== undefined;
			isDirty ||= formData?.class_year?.value !== new Date().getFullYear();
			isDirty ||= formData?.form_id?.value !== undefined;
			isDirty ||= formData?.day?.value !== undefined;
			isDirty ||= formData?.start_time?.value !== undefined;
			isDirty ||= formData?.end_time?.value !== undefined;
			isDirty ||= formData?.fees?.value !== undefined;
			isDirty ||= formData?.is_package?.value !== undefined;
			isDirty ||= formData?.class_name?.value.trim() !== '';
		}

		return isDirty;
	};
}

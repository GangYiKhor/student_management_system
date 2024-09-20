import { CLASS_COUNT } from '../../../utils/constants/constants';
import { getToday, isSameDay } from '../../../utils/dateOperations';
import { ClassesGetResponse } from '../../../utils/types/responses/classes/get';
import { StudentClassesGetResponses } from '../../../utils/types/responses/student-classes/get';
import { EditData, FormDataType } from '../types';

type PropType = {
	formData: FormDataType;
	data?: EditData;
	classData?: StudentClassesGetResponses;
};

export function useIsDirty({ formData, data, classData }: Readonly<PropType>) {
	return () => {
		let isDirty = false;

		if (data) {
			isDirty ||= formData?.student_name?.value !== data.student_name;
			isDirty ||= formData?.form_id?.value !== data.form_id;
			isDirty ||= !isSameDay(formData?.reg_date?.value, data.reg_date);
			isDirty ||= formData?.reg_year?.value !== data.reg_year;
			isDirty ||= formData?.gender?.value !== data.gender;
			isDirty ||= formData?.ic?.value !== data.ic;
			isDirty ||= formData?.school?.value !== data.school;
			isDirty ||= formData?.phone_number?.value !== data.phone_number;
			isDirty ||= formData?.parent_phone_number?.value !== data.parent_phone_number;
			isDirty ||= formData?.email?.value !== data.email;
			isDirty ||= formData?.address?.value !== data.address;

			for (let i = 0; i < CLASS_COUNT; i++) {
				isDirty ||=
					(formData?.[`class_${i}`]?.value as ClassesGetResponse) != classData?.[i]?.class;
			}
		} else {
			isDirty ||= formData?.student_name?.value?.trim() !== '';
			isDirty ||= formData?.form_id?.value !== undefined;
			isDirty ||= !isSameDay(formData?.reg_date?.value, getToday());
			isDirty ||= formData?.reg_year?.value !== new Date().getFullYear();
			isDirty ||= formData?.gender?.value?.trim() !== '';
			isDirty ||= formData?.ic?.value?.trim() !== '';
			isDirty ||= formData?.school?.value?.trim() !== '';
			isDirty ||= formData?.phone_number?.value?.trim() !== '';
			isDirty ||= formData?.parent_phone_number?.value?.trim() !== '';
			isDirty ||= formData?.email?.value?.trim() !== '';
			isDirty ||= formData?.address?.value?.trim() !== '';

			for (let i = 0; i < CLASS_COUNT; i++) {
				isDirty ||= formData?.[`class_${i}`]?.value !== undefined;
			}
		}

		return isDirty;
	};
}

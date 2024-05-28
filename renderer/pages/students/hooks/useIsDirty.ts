import { EditData } from '../components/table';
import { FormDataType } from '../types';

type PropType = {
	formData: FormDataType;
	data?: EditData;
};

export function useIsDirty({ formData, data }: Readonly<PropType>) {
	return () => {
		let isDirty = false;

		if (data) {
			isDirty ||= formData.student_name?.value?.trim() !== data.student_name;
			isDirty ||= formData.form_id?.value !== data.form_id;
			isDirty ||= formData.reg_date?.value?.getTime() !== data.reg_date?.getTime();
			isDirty ||= formData.reg_year?.value !== data.reg_year;
			isDirty ||= formData.gender?.value?.trim() !== data.gender;
			isDirty ||= formData.ic?.value?.trim() !== data.ic;
			isDirty ||= formData.school?.value?.trim() !== data.school;
			isDirty ||= formData.phone_number?.value?.trim() !== data.phone_number;
			isDirty ||= formData.parent_phone_number?.value?.trim() !== data.parent_phone_number;
			isDirty ||= formData.email?.value?.trim() !== data.email;
			isDirty ||= formData.address?.value?.trim() !== data.address;
		} else {
			isDirty ||= formData.student_name?.value?.trim() !== '';
			isDirty ||= formData.form_id?.value !== undefined;
			isDirty ||= formData.reg_date?.value !== undefined;
			isDirty ||= formData.reg_year?.value !== undefined;
			isDirty ||= formData.gender?.value?.trim() !== '';
			isDirty ||= formData.ic?.value?.trim() !== '';
			isDirty ||= formData.school?.value?.trim() !== '';
			isDirty ||= formData.phone_number?.value?.trim() !== '';
			isDirty ||= formData.parent_phone_number?.value?.trim() !== '';
			isDirty ||= formData.email?.value?.trim() !== '';
			isDirty ||= formData.address?.value?.trim() !== '';
		}

		return isDirty;
	};
}

import { EditData, FormDataType } from '../types';

type PropType = {
	formData: FormDataType;
	data?: EditData;
};

export function useIsDirty({ formData, data }: Readonly<PropType>) {
	return () => {
		let isDirty = false;

		if (data) {
			isDirty ||= formData.teacher_name?.value?.trim() !== data.teacher_name;
			isDirty ||= formData.ic?.value?.trim() !== data.ic;
			isDirty ||= formData.phone_number?.value?.trim() !== data.phone_number;
			isDirty ||= formData.email?.value?.trim() !== data.email;
			isDirty ||= formData.address?.value?.trim() !== data.address;
		} else {
			isDirty ||= formData.teacher_name?.value?.trim() !== '';
			isDirty ||= formData.ic?.value?.trim() !== '';
			isDirty ||= formData.phone_number?.value?.trim() !== '';
			isDirty ||= formData.email?.value?.trim() !== '';
			isDirty ||= formData.address?.value?.trim() !== '';
		}

		return isDirty;
	};
}

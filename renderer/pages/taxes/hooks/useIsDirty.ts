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
			isDirty ||= formData.start_date?.value?.getTime() !== data.start_date?.getTime();
			isDirty ||= formData.end_date?.value?.getTime() !== data.end_date?.getTime();
			isDirty ||= formData.inclusive?.value !== data.inclusive;
		} else {
			isDirty ||= formData.percentage?.value !== 0;
			isDirty ||= formData.start_date?.value !== undefined;
			isDirty ||= formData.end_date?.value !== undefined;
			isDirty ||= formData.inclusive?.value !== undefined;
		}

		return isDirty;
	};
}

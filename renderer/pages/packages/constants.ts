import { EditData, FormDataType, SearchDataType } from './types';

export const formDefaultValue: FormDataType = {
	form_id: { value: undefined, valid: true },
	start_date: { value: undefined, valid: true },
	end_date: { value: undefined, valid: true },
	subject_count_from: { value: undefined, valid: true },
	subject_count_to: { value: undefined, valid: true },
	discount_per_subject: { value: undefined, valid: true },
};

export const formDefaultValueFilled = (data: EditData): FormDataType => ({
	form_id: { value: data?.form_id, valid: true },
	start_date: { value: data?.start_date, valid: true },
	end_date: { value: data?.end_date, valid: true },
	subject_count_from: { value: data?.subject_count_from, valid: true },
	subject_count_to: { value: data?.subject_count_to, valid: true },
	discount_per_subject: { value: data?.discount_per_subject, valid: true },
});

export const searchDefaultValue: SearchDataType = {
	general: { value: '', valid: true },
	form_id: { value: undefined, valid: true },
	status: { value: undefined, valid: true },
};

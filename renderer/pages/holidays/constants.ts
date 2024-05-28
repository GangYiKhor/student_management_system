import { EditData, FormDataType, SearchDataType } from './types';

export const formDefaultValue: FormDataType = {
	date: { value: undefined, valid: true },
	description: { value: '', valid: true },
};

export const formDefaultValueFilled = (data: EditData): FormDataType => ({
	date: { value: data?.date, valid: true },
	description: { value: data?.description, valid: true },
});

export const searchDefaultValue: SearchDataType = {
	general: { value: '', valid: true },
	start_date: { value: undefined, valid: true },
	end_date: { value: undefined, valid: true },
	period: { value: '', valid: true },
};

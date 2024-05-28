import { EditData, FormDataType, SearchDataType } from './types';

export const formDefaultValue: FormDataType = {
	percentage: { value: undefined, valid: true },
	start_date: { value: undefined, valid: true },
	end_date: { value: undefined, valid: true },
	inclusive: { value: undefined, valid: true },
};

export const formDefaultValueFilled = (data: EditData): FormDataType => ({
	percentage: { value: data?.percentage, valid: true },
	start_date: { value: data?.start_date, valid: true },
	end_date: { value: data?.end_date, valid: true },
	inclusive: { value: data?.inclusive, valid: true },
});

export const searchDefaultValue: SearchDataType = {
	status: { value: undefined, valid: true },
};

export type GenericSingleFormDataType = { [key: string]: { value: any; valid: boolean } };
export type GenericFormDataType = {
	[key: string]: { [key: string]: { value: any; valid: boolean } };
};
export type GenericSetFormDataType = {
	id: string;
	path?: string;
	value?: any;
	valid?: boolean;
	initialise?: GenericSingleFormDataType;
};
export type GenericSetFormData = (value: GenericSetFormDataType) => void;
export type GenericSetSingleFormDataType = { path: string; value?: any; valid?: boolean };
export type GenericSetSingleFormData = (value: GenericSetSingleFormDataType) => void;

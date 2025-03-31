import { isEqual } from 'lodash';
import { createContext, useContext, useMemo, useReducer } from 'react';
import { EmptyFieldMessage, InvalidFieldMessage } from '../../utils/notifications/input-errors';
import { isDefined } from '../../utils/utils';
import { useNotificationContext } from './notification-providers';

type FieldDataType<T = { [key: string]: any }> = {
	[fieldId in keyof T]: {
		value?: T[fieldId];
		valid?: boolean;
		initialValue?: T[fieldId];
		name?: string;
		required?: boolean;
		componentUpdated?: boolean;
		validator?: (value: any) => boolean;
	};
};

type FormDataType = {
	[formId: string]: FieldDataType;
};

type SetFieldDataType = {
	field: string;
	value?: any;
	initialValue?: any;
	valid?: boolean;
	name?: string;
	required?: boolean;
	validator?: (value: any) => boolean;
};

type SetFormDataType = {
	formId: string;
	type:
		| 'initialise'
		| 'update-property'
		| 'update-value'
		| 'update-valid'
		| 'reset'
		| 'copy-to-initial';
	values?: SetFieldDataType[];
	componentUpdate?: boolean;
};

const Form = createContext<{
	formData: FormDataType;
	setFormData: (value: SetFormDataType) => void;
}>({
	formData: {},
	setFormData: undefined,
});

function reducer(state: FormDataType, action?: SetFormDataType) {
	if (!action) return state;

	state = { ...state };
	const { formId, type, values } = action;

	const operations = {
		initialise: () => {
			const initialValues = state[formId] ?? {};
			for (const { field, value, name, required = false, validator = () => true } of values) {
				initialValues[field] = {
					value: value === null ? undefined : value,
					valid: true,
					initialValue: value === null ? undefined : value,
					name,
					required,
					validator,
				};
			}
			state[formId] = { ...initialValues };
		},
		'update-property': () => {
			if (state[formId] === undefined) state[formId] = {};
			for (const { field, ...value } of values) {
				if (state[formId][field] === undefined) state[formId][field] = {};
				for (const property of ['initialValue', 'required', 'validator']) {
					switch (value[property]) {
						case undefined:
							break;

						case null:
							state[formId][field][property] = undefined;
							break;

						default:
							state[formId][field][property] = value[property];
					}
				}
			}
		},
		'update-value': () => {
			if (state[formId] === undefined) state[formId] = {};
			const { componentUpdate: componentUpdated = false } = action;
			for (const { field, value } of values) {
				if (state[formId][field] === undefined) state[formId][field] = {};
				const oldValues = state[formId][field];
				switch (value) {
					case undefined:
						break;

					case null:
						state[formId][field] = {
							...oldValues,
							value: undefined,
							valid: true,
							componentUpdated,
						};
						break;

					default:
						state[formId][field] = { ...oldValues, value, valid: true, componentUpdated };
				}
			}
		},
		'update-valid': () => {
			for (const { field, valid } of values) {
				state[formId][field].valid = valid;
			}
		},
		reset: () => {
			for (const key in state[formId]) {
				state[formId][key].value = state[formId][key].initialValue;
				state[formId][key].valid = true;
				state[formId][key].componentUpdated = false;
			}
		},
		'copy-to-initial': () => {
			for (const key in state[formId]) {
				state[formId][key].initialValue = state[formId][key].value;
			}
		},
	};

	operations[type]?.();

	return state;
}

type PropType = {
	children: React.ReactNode;
};

export function FormProvider({ children }: Readonly<PropType>) {
	const [formData, setFormData] = useReducer<React.Reducer<FormDataType, SetFormDataType>>(
		reducer,
		{},
	);
	const formProviderValue = useMemo(() => ({ formData, setFormData }), [formData, setFormData]);

	return <Form.Provider value={formProviderValue}>{children}</Form.Provider>;
}

type initialiseType = {
	field: string;
	value?: any;
	name?: string;
	required?: boolean;
	validator?: (value: any) => boolean;
};

type updateFieldPropertiesType = {
	field: string;
	required?: boolean;
	initialValue?: any;
	validator?: (value: any) => boolean;
};

type updateFieldValuesType = {
	field: string;
	value: any;
};

type updateFieldValidType = {
	field: string;
	valid: boolean;
};

export function useFullFormContext() {
	const { formData, setFormData } = useContext(Form);

	const initialiseForm = ({ formId, values }: { formId: string; values: initialiseType[] }) => {
		setFormData({ formId, type: 'initialise', values });
	};
	const updateFieldProperties = ({
		formId,
		values,
	}: {
		formId: string;
		values: updateFieldPropertiesType[];
	}) => {
		setFormData({ formId, type: 'update-property', values });
	};
	const updateFieldValue = ({
		formId,
		values,
		componentUpdate = false,
	}: {
		formId: string;
		values: updateFieldValuesType[];
		componentUpdate?: boolean;
	}) => {
		setFormData({ formId, type: 'update-value', values, componentUpdate });
	};
	const updateFieldValid = ({
		formId,
		values,
	}: {
		formId: string;
		values: updateFieldValidType[];
	}) => {
		setFormData({ formId, type: 'update-valid', values });
	};
	const resetForm = (formId: string) => {
		setFormData({ formId, type: 'reset' });
	};
	const updateInitialValues = (formId: string) => {
		setFormData({ formId, type: 'copy-to-initial' });
	};

	return {
		formData,
		initialiseForm,
		updateFieldProperties,
		updateFieldValue,
		updateFieldValid,
		resetForm,
		updateInitialValues,
	};
}

export function useFormContext<T extends { [key: string]: any }>(formId: string) {
	const { setNotification } = useNotificationContext();

	const fullForm = useFullFormContext();
	const formData = fullForm.formData?.[formId] as FieldDataType<T>;
	const initialiseForm = (values: initialiseType[]) => {
		fullForm.initialiseForm({ formId, values });
	};
	const updateFieldProperties = (values: updateFieldPropertiesType[]) => {
		fullForm.updateFieldProperties({ formId, values });
	};
	const updateFieldValue = (values: updateFieldValuesType[], componentUpdate = false) => {
		fullForm.updateFieldValue({ formId, values, componentUpdate });
	};
	const updateFieldValid = (values: updateFieldValidType[]) => {
		fullForm.updateFieldValid({ formId, values });
	};
	const resetForm = () => {
		fullForm.resetForm(formId);
	};
	const updateInitialValues = () => {
		fullForm.updateInitialValues(formId);
	};
	const isDirty = () => {
		return Object.values(formData ?? {}).some(
			({ value, initialValue }) => !isEqual(value, initialValue),
		);
	};
	const validateForm = () => {
		let valid = true;
		const invalidFields: string[] = [];

		for (const key in formData) {
			const { name, required, validator = () => true } = formData[key];
			let value = formData[key].value;

			if (typeof value === 'string') {
				value = value.trim();
			}

			if (isDefined(value) && value !== '' && !validator(value)) {
				setNotification(InvalidFieldMessage(name));
				invalidFields.push(key);
				valid = false;
			} else if (required && (!isDefined(value) || value === '')) {
				setNotification(EmptyFieldMessage(name));
				invalidFields.push(key);
				valid = false;
			}
		}

		if (invalidFields.length > 0) {
			updateFieldValid(invalidFields.map(field => ({ field, valid: false })));
		}
		return valid;
	};
	const getValues = (): T =>
		Object.fromEntries(
			Object.entries(formData ?? {}).map(value => [value[0], value[1].value]),
		) as T;

	return {
		formData,
		initialiseForm,
		updateFieldProperties,
		updateFieldValue,
		updateFieldValid,
		updateInitialValues,
		resetForm,
		isDirty,
		validateForm,
		getValues,
	};
}

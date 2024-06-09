import { createContext, useContext, useMemo, useReducer } from 'react';
import { tryParseInt } from '../../utils/numberParsers';

type SingularFormData = { value: any; valid: boolean };
export type GenericFormDataType = {
	[key: string]: SingularFormData;
};
export type GenericSetFormData = (value: { name: string; value?: any; valid?: boolean }) => void;

const Form = createContext<{ formData: GenericFormDataType; setFormData: GenericSetFormData }>({
	formData: {},
	setFormData: undefined,
});

function reducer(
	state: GenericFormDataType,
	action?: { name: string; value?: any; valid?: boolean },
) {
	if (!action) {
		return state;
	}

	if (typeof action.name === 'object') {
		return action.name;
	}

	const [name, index] = action.name.split('.');
	if (!name) {
		return action.value;
	}

	state = { ...state };
	const newObj: { value?: any; valid?: boolean } = {};
	switch (action.value) {
		case null:
			newObj.value = undefined;
			break;

		case undefined:
			break;

		default:
			newObj.value = action.value;
	}

	if (action.valid !== undefined) {
		newObj.valid = action.valid;
	}

	const indexValue = tryParseInt(index);
	if (!indexValue) {
		state[name] = { ...state[name], ...newObj };
	} else {
		state[name][indexValue] = { ...state[name][indexValue], ...newObj };
	}

	return state;
}

type PropType = {
	defaultValue?: GenericFormDataType;
	children: React.ReactNode;
};

export function FormProvider({ defaultValue = {}, children }: Readonly<PropType>) {
	const [formData, setFormData] = useReducer<
		React.Reducer<
			GenericFormDataType,
			{ name: string | GenericFormDataType; value?: any; valid?: boolean }
		>
	>(reducer, { ...defaultValue });
	const formProviderValue = useMemo(() => ({ formData, setFormData }), [formData, setFormData]);

	return <Form.Provider value={formProviderValue}>{children}</Form.Provider>;
}

export function useFormContext<T extends GenericFormDataType>() {
	return useContext<{ formData: T; setFormData: GenericSetFormData }>(
		Form as React.Context<{ formData: T; setFormData: GenericSetFormData }>,
	);
}

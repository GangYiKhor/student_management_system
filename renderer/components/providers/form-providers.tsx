import _ from 'lodash';
import { createContext, useContext, useMemo, useReducer } from 'react';
import {
	GenericFormDataType,
	GenericSetFormData,
	GenericSetFormDataType,
	GenericSetSingleFormDataType,
	GenericSingleFormDataType,
} from '../../utils/types/form';

const Form = createContext<{
	formData: GenericFormDataType;
	setFormData: GenericSetFormData;
}>({
	formData: {},
	setFormData: undefined,
});

function reducer(state: GenericFormDataType, action?: GenericSetFormDataType) {
	if (!action) {
		return state;
	}

	state = { ...state };

	if (action.initialise) {
		_.set(state, action.id, action.initialise);
		return state;
	}

	const newValues: { value?: any; valid?: boolean } = {};
	switch (action.value) {
		case null:
			newValues.value = undefined;
			break;

		case undefined:
			break;

		default:
			newValues.value = action.value;
	}

	if (action.valid !== undefined) {
		newValues.valid = action.valid;
	}

	_.update(state, `${action.id}.${action.path}`, value => ({ ...value, ...newValues }));

	return state;
}

type PropType = {
	defaultValue?: GenericFormDataType;
	children: React.ReactNode;
};

export function FormProvider({ children }: Readonly<PropType>) {
	const [formData, setFormData] = useReducer<
		React.Reducer<GenericFormDataType, GenericSetFormDataType>
	>(reducer, {});
	const formProviderValue = useMemo(() => ({ formData, setFormData }), [formData, setFormData]);

	return <Form.Provider value={formProviderValue}>{children}</Form.Provider>;
}

export function useFormContext<T extends GenericFormDataType>() {
	return useContext<{ formData: T; setFormData: GenericSetFormData }>(
		Form as React.Context<{ formData: T; setFormData: GenericSetFormData }>,
	);
}

export function useFormContextWithId<T extends GenericSingleFormDataType>(form_id: string) {
	const { formData, setFormData } = useContext<{
		formData: { [key: string]: T };
		setFormData: GenericSetFormData;
	}>(Form as React.Context<{ formData: { [key: string]: T }; setFormData: GenericSetFormData }>);
	return {
		formData: formData?.[form_id],
		setFormData: (value: GenericSetSingleFormDataType) => setFormData({ id: form_id, ...value }),
	};
}

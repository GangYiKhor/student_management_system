import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import {
	GenericSetFormData,
	GenericSetFormDataType,
	GenericSetSingleFormData,
	GenericSingleFormDataType,
} from '../../utils/types/form';
import { useFormContext } from '../providers/form-providers';

const FormHandler = createContext<{
	formData: GenericSingleFormDataType;
	setFormData: GenericSetFormData;
}>({
	formData: {},
	setFormData: undefined,
});

type PropType = {
	formId: string;
	defaultValue?: GenericSingleFormDataType;
	children: React.ReactNode;
};

export function Form({ formId, defaultValue = {}, children }: Readonly<PropType>) {
	const { formData, setFormData } = useFormContext();

	useEffect(() => {
		setFormData({ id: formId, initialise: defaultValue });
	}, []);

	const setData = useCallback(
		(value: GenericSetFormDataType) => setFormData({ id: formId, ...value }),
		[setFormData],
	);

	const formProviderValue = useMemo(
		() => ({ formData: formData[formId], setFormData: setData }),
		[formData[formId], setData],
	);

	return <FormHandler.Provider value={formProviderValue}>{children}</FormHandler.Provider>;
}

export function useFormHandlerContext<T extends GenericSingleFormDataType>() {
	return useContext<{ formData: T; setFormData: GenericSetSingleFormData }>(
		FormHandler as React.Context<{ formData: T; setFormData: GenericSetSingleFormData }>,
	);
}

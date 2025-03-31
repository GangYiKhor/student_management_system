import clsx from 'clsx';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { readConfig } from '../../utils/configs';
import { tryParseInt } from '../../utils/numberParsers';
import {
	BlueButtonClass,
	GrayButtonClass,
	GreenButtonClass,
	UnderlineButtonClass,
} from '../../utils/tailwindClass/button';
import { useFormContext, useFullFormContext } from '../providers/form-providers';

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

const FormHandler = createContext<{
	formData: FieldDataType;
	initialiseForm: (values: initialiseType[]) => void;
	updateFieldProperties: (values: updateFieldPropertiesType[]) => void;
	updateFieldValue: (values: updateFieldValuesType[]) => void;
	updateFieldValid: (values: updateFieldValidType[]) => void;
	formInitialised: boolean;
	formLocked: boolean;
	keepData: boolean;
	keepDefault: boolean;
}>({
	formData: {},
	initialiseForm: undefined,
	updateFieldProperties: undefined,
	updateFieldValue: undefined,
	updateFieldValid: undefined,
	formInitialised: false,
	formLocked: undefined,
	keepData: undefined,
	keepDefault: undefined,
});

type PropType = {
	formId: string;
	submitText?: string;
	onSubmit?: ((formData: any) => boolean) | ((formData: any) => Promise<boolean>);
	defaultLocked?: boolean;
	lockable?: boolean;
	revertible?: boolean;
	keepData?: boolean;
	keepDefault?: boolean;
	children: React.ReactNode;
};

export function Form({
	formId,
	submitText = 'Submit',
	onSubmit,
	defaultLocked,
	lockable,
	revertible,
	keepData,
	keepDefault,
	children,
}: Readonly<PropType>) {
	const { formData, initialiseForm: formInit } = useFullFormContext();
	const {
		initialiseForm,
		updateFieldProperties,
		updateFieldValue: generalUpdateFieldValue,
		updateFieldValid,
		isDirty,
		resetForm,
		validateForm,
	} = useFormContext(formId);
	const [editMode, setEditMode] = useState(!defaultLocked);
	const [initialised, setInitialised] = useState(false);

	const updateFieldValue = useCallback(
		(values: updateFieldValuesType[]) => generalUpdateFieldValue(values, true),
		[generalUpdateFieldValue],
	);

	// Provider Settings
	useEffect(() => {
		if (formData?.[formId] === undefined) {
			formInit({ formId, values: [] });
		}
		setInitialised(true);
	}, []);

	const formProviderValue = useMemo(
		() => ({
			formData: formData?.[formId],
			initialiseForm,
			updateFieldProperties,
			updateFieldValue,
			updateFieldValid,
			formInitialised: initialised,
			formLocked: !editMode,
			keepData,
			keepDefault,
		}),
		[
			formData?.[formId],
			initialiseForm,
			updateFieldProperties,
			updateFieldValue,
			updateFieldValid,
			formData[formId] !== undefined,
			editMode,
			keepData,
			keepDefault,
		],
	);

	// Buttons Settings
	const handleRevert = () => resetForm();
	const handleEdit = () => setEditMode(true);
	const handleSubmit = async () => {
		if (!validateForm()) return;

		if (await onSubmit(formData[formId])) {
			if (defaultLocked || lockable) setEditMode(false);
		}
	};
	const handleDiscard = () => {
		resetForm();
		setEditMode(false);
	};

	const showSubmitButton = editMode && onSubmit;
	const showRevertButton = editMode && revertible && isDirty();
	const showDiscardButton = editMode && (defaultLocked || lockable);
	const showEditButton = !editMode && lockable;
	const showButtons = showSubmitButton || showRevertButton || showDiscardButton || showEditButton;

	return (
		<FormHandler.Provider value={formProviderValue}>
			{children}

			{showButtons ? (
				<div className={clsx('flex flex-col gap-3', 'my-2')}>
					{showSubmitButton ? (
						<button className={GreenButtonClass} onClick={handleSubmit}>
							{submitText}
						</button>
					) : null}

					{showRevertButton ? (
						<button className={GrayButtonClass} disabled={!isDirty()} onClick={handleRevert}>
							{showDiscardButton ? 'Revert' : 'Discard'}
						</button>
					) : null}

					{showDiscardButton ? (
						<button className={UnderlineButtonClass} onClick={handleDiscard}>
							{isDirty() ? 'Discard' : 'Cancel'}
						</button>
					) : null}

					{showEditButton ? (
						<button className={BlueButtonClass} onClick={handleEdit}>
							Edit
						</button>
					) : null}
				</div>
			) : null}
		</FormHandler.Provider>
	);
}

export function useFormHandlerContext<T extends FieldDataType>() {
	return {
		...useContext<{
			formData: T;
			initialiseForm: (values: initialiseType[]) => void;
			updateFieldProperties: (values: updateFieldPropertiesType[]) => void;
			updateFieldValue: (values: updateFieldValuesType[]) => void;
			updateFieldValid: (values: updateFieldValidType[]) => void;
			formInitialised: boolean;
			formLocked: boolean;
			keepData: boolean;
			keepDefault: boolean;
		}>(
			FormHandler as React.Context<{
				formData: T;
				initialiseForm: (values: initialiseType[]) => void;
				updateFieldProperties: (values: updateFieldPropertiesType[]) => void;
				updateFieldValue: (values: updateFieldValuesType[]) => void;
				updateFieldValid: (values: updateFieldValidType[]) => void;
				formInitialised: boolean;
				formLocked: boolean;
				keepData: boolean;
				keepDefault: boolean;
			}>,
		),
		debounceLatency: tryParseInt(readConfig('INPUT_SPEED'), 250),
	};
}

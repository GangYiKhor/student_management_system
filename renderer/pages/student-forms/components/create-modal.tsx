import { useCallback, useRef, useState } from 'react';
import Modal, { ModalButtons } from '../../../components/modal';
import {
	DisabledTextBoxClass,
	ErrorTextBoxClass,
	InvalidTextBoxClass,
	LabelLeftClass,
	TextBoxClass,
} from '../../../utils/class/inputs';
import clsx from 'clsx';
import { GreenButtonClass, RedButtonClass } from '../../../utils/class/button';
import React from 'react';
import { useNotificationContext } from '../../../components/providers/notification-providers';

type PropType = {
	closeModal: CallableFunction;
	handleAdd: CallableFunction;
};

export function StudentFormCreateModal({ closeModal, handleAdd }: PropType) {
	const { setNotification } = useNotificationContext();
	const formNameRef = useRef<HTMLInputElement>();
	const [formValid, setFormValid] = useState(true);
	const [confirmation, setConfirmation] = useState(false);

	const handleSubmit = useCallback(async () => {
		if (formNameRef.current.value.trim() === '') {
			setFormValid(false);
			formNameRef.current.value = '';
			formNameRef.current.focus();
			formNameRef.current.classList.add(ErrorTextBoxClass);
			setNotification({
				title: 'Invalid Form Name!',
				message: 'Please enter a valid form name',
				type: 'ERROR',
			});
			setTimeout(() => formNameRef.current?.classList?.remove(ErrorTextBoxClass), 500);
		} else {
			setConfirmation(true);
		}
	}, [handleAdd]);

	const modalButtons: ModalButtons = [
		{
			text: 'Create',
			class: GreenButtonClass,
			action: () => handleSubmit(),
		},
	];

	const confirmationButtons: ModalButtons = [
		{
			text: 'Cancel',
			class: RedButtonClass,
			action: () => setConfirmation(false),
		},
		{
			text: 'Confirm',
			class: GreenButtonClass,
			action: async () => {
				handleAdd(formNameRef.current.value);
				setConfirmation(false);
				closeModal();
			},
		},
	];

	return (
		<React.Fragment>
			<Modal
				title="New Student Form"
				closeModal={closeModal}
				closeOnBlur={true}
				buttons={modalButtons}
			>
				<div>
					<label htmlFor="formName" className={LabelLeftClass}>
						Form Name:
					</label>
					<input
						type="text"
						id="formName"
						className={clsx(TextBoxClass, formValid || InvalidTextBoxClass)}
						placeholder="E.g. F1 / Std. 4"
						maxLength={50}
						required
						ref={formNameRef}
						onChange={() => setFormValid(true)}
					/>
					<input
						type="text"
						value={'Active'}
						className={clsx(DisabledTextBoxClass, 'w-[65px]')}
						disabled
					/>
				</div>
			</Modal>
			{confirmation ? (
				<Modal
					title="Confirmation"
					closeModal={() => setConfirmation(false)}
					closeOnBlur={false}
					buttons={confirmationButtons}
				>
					<p>Confirm Create "{formNameRef.current.value}"?</p>
				</Modal>
			) : null}
		</React.Fragment>
	);
}

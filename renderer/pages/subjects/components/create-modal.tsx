import React, { useCallback, useEffect, useRef, useState } from 'react';
import Modal, { ModalButtons } from '../../../components/modal';
import {
	ErrorTextBoxClass,
	InvalidTextBoxClass,
	LabelTopClass,
	TextBoxBottomClass,
} from '../../../utils/class/inputs';
import clsx from 'clsx';
import { GreenButtonClass, RedButtonClass } from '../../../utils/class/button';
import { useNotificationContext } from '../../../components/providers/notification-providers';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useGet } from '../../../hooks/use-get';
import { ErrorResponse } from '../../../responses/error';
import { StudentFormsGetResponse } from '../../../responses/student-forms/get';
import { SubjectsCreateDto } from '../../../dtos/subjects/create';

type PropType = {
	closeModal: CallableFunction;
	handleAdd: CallableFunction;
};

export function SubjectsCreateModal({ closeModal, handleAdd }: PropType) {
	const { setNotification } = useNotificationContext();
	const formRef = useRef<HTMLSelectElement>();
	const subjectNameRef = useRef<HTMLInputElement>();
	const [formValid, setFormValid] = useState(true);
	const [subjectNameValid, setSubjectNameValid] = useState(true);
	const [confirmation, setConfirmation] = useState(false);

	const getForms = useGet('/api/student-forms');
	const {
		data: formData,
		error,
		isError,
		refetch: formRefetch,
	} = useQuery<StudentFormsGetResponse, AxiosError<ErrorResponse>>({
		queryKey: ['forms'],
		queryFn: () => getForms({ is_active: true }),
		enabled: true,
	});

	useEffect(() => {
		if (isError) {
			if (error) {
				setNotification({
					title: error.response.data.error.title,
					message: error.response.data.error.message,
					source: error.response.data.error.source,
					type: 'ERROR',
				});
			} else {
				setNotification({
					title: 'Server Error!',
					message: 'Unknown Error! Unable to connect to server!',
					source: 'Server',
					type: 'ERROR',
				});
			}
			console.log(error);
		}
	}, [isError]);

	const handleSubmit = useCallback(async () => {
		let valid = true;
		if (formRef.current.value.trim() === '') {
			valid = false;
			setFormValid(false);
			formRef.current.value = '';
			formRef.current.focus();
			formRef.current.classList.add(ErrorTextBoxClass);
			setNotification({
				title: 'Invalid Form!',
				message: 'Please enter a valid form',
				type: 'ERROR',
			});
			setTimeout(() => formRef.current?.classList?.remove(ErrorTextBoxClass), 500);
		}

		if (subjectNameRef.current.value.trim() === '') {
			valid = false;
			setSubjectNameValid(false);
			subjectNameRef.current.value = '';
			subjectNameRef.current.focus();
			subjectNameRef.current.classList.add(ErrorTextBoxClass);
			setNotification({
				title: 'Invalid Subject Name!',
				message: 'Please enter a valid subject name',
				type: 'ERROR',
			});
			setTimeout(() => subjectNameRef.current?.classList?.remove(ErrorTextBoxClass), 500);
		}

		if (valid) {
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
				await handleAdd({
					form_id: parseInt(formRef.current.value),
					subject_name: subjectNameRef.current.value,
				} as SubjectsCreateDto);
				setConfirmation(false);
				closeModal();
			},
		},
	];

	return (
		<React.Fragment>
			<Modal title="New Subject" closeModal={closeModal} closeOnBlur={true} buttons={modalButtons}>
				<div className={clsx('grid')}>
					<label className={LabelTopClass} htmlFor="newForm">
						Form:
					</label>
					<select
						className={clsx(TextBoxBottomClass, formValid || InvalidTextBoxClass)}
						id="newForm"
						ref={formRef}
						onFocus={async () => await formRefetch()}
						onChange={() => setFormValid(true)}
					>
						<option value="" disabled>
							Select a Form
						</option>
						{formData.map(value => (
							<option key={value.id} value={value.id}>
								{value.form_name}
							</option>
						))}
					</select>
					<label htmlFor="subjectName" className={LabelTopClass}>
						Subject Name:
					</label>
					<input
						type="text"
						id="subjectName"
						className={clsx(TextBoxBottomClass, subjectNameValid || InvalidTextBoxClass)}
						placeholder="E.g. BI"
						maxLength={50}
						required
						ref={subjectNameRef}
						onChange={() => setFormValid(true)}
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
					<p>Confirm Create "{subjectNameRef.current.value}"?</p>
				</Modal>
			) : null}
		</React.Fragment>
	);
}

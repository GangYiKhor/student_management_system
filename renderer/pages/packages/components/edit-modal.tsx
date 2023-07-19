import React, { useCallback, useEffect, useRef, useState } from 'react';
import Modal, { ModalButtons } from '../../../components/modal';
import {
	DisabledTextBoxClass,
	ErrorTextBoxClass,
	InvalidTextBoxClass,
	LabelTopClass,
	TextBoxBottomClass,
} from '../../../utils/class/inputs';
import clsx from 'clsx';
import { GrayButtonClass, GreenButtonClass, RedButtonClass } from '../../../utils/class/button';
import { useNotificationContext } from '../../../components/providers/notification-providers';
import { RequiredIcon } from '../../../components/required';
import { PackagesUpdateDto } from '../../../dtos/packages/update';
import { EditData } from './table';
import {
	parseDateOrUndefined,
	parseFloatOrUndefined,
	parseIntOrUndefined,
} from '../../../utils/parser';
import { useGet } from '../../../hooks/use-get';
import { StudentFormsGetDto } from '../../../dtos/student-forms/get';
import { StudentFormsGetResponse } from '../../../responses/student-forms/get';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ErrorResponse } from '../../../responses/error';

type PropType = {
	closeModal: () => void;
	handleUpdate: (id: number, data: PackagesUpdateDto) => Promise<void>;
	data: EditData;
};

export function TeachersEditModal({ closeModal, handleUpdate, data }: PropType) {
	const { setNotification } = useNotificationContext();
	const startDateRef = useRef<HTMLInputElement>();
	const endDateRef = useRef<HTMLInputElement>();
	const formRef = useRef<HTMLSelectElement>();
	const subjectCountFromRef = useRef<HTMLInputElement>();
	const subjectCountToRef = useRef<HTMLInputElement>();
	const discountPerSubjectRef = useRef<HTMLInputElement>();
	const [startDateValid, setStartDateValid] = useState(true);
	const [endDateValid, setEndDateValid] = useState(true);
	const [formValid, setFormValid] = useState(true);
	const [subjectCountFromValid, setSubjectCountFromValid] = useState(true);
	const [subjectCountToValid, setSubjectCountToValid] = useState(true);
	const [discountPerSubjectValid, setDiscountPerSubjectValid] = useState(true);
	const [confirmation, setConfirmation] = useState(false);
	const [closeConfirmation, setCloseConfirmation] = useState(false);

	const getForms = useGet<StudentFormsGetDto>('/api/student-forms');
	const { data: formData, refetch: refetchForm } = useQuery<
		StudentFormsGetResponse,
		AxiosError<ErrorResponse>
	>({
		queryKey: ['forms'],
		queryFn: () => getForms({ orderBy: 'form_name asc' }),
		enabled: true,
	});

	useEffect(() => {
		startDateRef.current.value = data.start_date.toLocaleDateString() || '';
		endDateRef.current.value = data.end_date.toLocaleDateString() || '';
		formRef.current.value = data.form_id.toString() || '';
		subjectCountFromRef.current.value = data.subject_count_from.toString() || '';
		subjectCountToRef.current.value = data.subject_count_to.toString() || '';
		discountPerSubjectRef.current.value = data.discount_per_subject.toFixed(2) || '';
	}, [data]);

	const handleSubmit = useCallback(() => {
		let valid = true;
		if (startDateRef.current.value.trim() === '') {
			valid = false;
			setStartDateValid(false);
			startDateRef.current.value = '';
			startDateRef.current.focus();
			startDateRef.current.classList.add(ErrorTextBoxClass);
			setNotification({
				title: 'Empty Start Date!',
				message: 'Please enter a start date',
				type: 'ERROR',
			});
			setTimeout(() => startDateRef.current?.classList?.remove(ErrorTextBoxClass), 500);
		}

		if (formRef.current.value.trim() === '') {
			valid = false;
			setFormValid(false);
			formRef.current.value = '';
			formRef.current.focus();
			formRef.current.classList.add(ErrorTextBoxClass);
			setNotification({
				title: 'Empty Form!',
				message: 'Please select a form',
				type: 'ERROR',
			});
			setTimeout(() => formRef.current?.classList?.remove(ErrorTextBoxClass), 500);
		}

		if (subjectCountFromRef.current.value.trim() === '') {
			valid = false;
			setSubjectCountFromValid(false);
			subjectCountFromRef.current.value = '';
			subjectCountFromRef.current.focus();
			subjectCountFromRef.current.classList.add(ErrorTextBoxClass);
			setNotification({
				title: 'Empty Subject Count!',
				message: 'Please enter a subject count',
				type: 'ERROR',
			});
			setTimeout(() => subjectCountFromRef.current?.classList?.remove(ErrorTextBoxClass), 500);
		}

		if (discountPerSubjectRef.current.value.trim() === '') {
			valid = false;
			setDiscountPerSubjectValid(false);
			discountPerSubjectRef.current.value = '';
			discountPerSubjectRef.current.focus();
			discountPerSubjectRef.current.classList.add(ErrorTextBoxClass);
			setNotification({
				title: 'Empty Discount!',
				message: 'Please enter a discount',
				type: 'ERROR',
			});
			setTimeout(() => discountPerSubjectRef.current?.classList?.remove(ErrorTextBoxClass), 500);
		}

		if (!parseDateOrUndefined(startDateRef.current.value)) {
			valid = false;
			setStartDateValid(false);
			startDateRef.current.focus();
			startDateRef.current.classList.add(ErrorTextBoxClass);
			setNotification({
				title: 'Invalid Start Date!',
				message: 'Please enter a valid date',
				type: 'ERROR',
			});
			setTimeout(() => startDateRef.current?.classList?.remove(ErrorTextBoxClass), 500);
		}

		if (!parseDateOrUndefined(endDateRef.current.value)) {
			valid = false;
			setEndDateValid(false);
			endDateRef.current.focus();
			endDateRef.current.classList.add(ErrorTextBoxClass);
			setNotification({
				title: 'Invalid End Date!',
				message: 'Please enter a valid date',
				type: 'ERROR',
			});
			setTimeout(() => endDateRef.current?.classList?.remove(ErrorTextBoxClass), 500);
		}

		if (!parseIntOrUndefined(subjectCountFromRef.current.value)) {
			valid = false;
			setSubjectCountFromValid(false);
			subjectCountFromRef.current.focus();
			subjectCountFromRef.current.classList.add(ErrorTextBoxClass);
			setNotification({
				title: 'Invalid Subject Count!',
				message: 'Please enter a valid subject count',
				type: 'ERROR',
			});
			setTimeout(() => subjectCountFromRef.current?.classList?.remove(ErrorTextBoxClass), 500);
		}

		if (!parseIntOrUndefined(subjectCountToRef.current.value)) {
			valid = false;
			setSubjectCountToValid(false);
			subjectCountToRef.current.focus();
			subjectCountToRef.current.classList.add(ErrorTextBoxClass);
			setNotification({
				title: 'Invalid Subject Count!',
				message: 'Please enter a valid subject count',
				type: 'ERROR',
			});
			setTimeout(() => subjectCountToRef.current?.classList?.remove(ErrorTextBoxClass), 500);
		}

		if (!parseFloatOrUndefined(discountPerSubjectRef.current.value, 2)) {
			valid = false;
			setSubjectCountToValid(false);
			discountPerSubjectRef.current.focus();
			discountPerSubjectRef.current.classList.add(ErrorTextBoxClass);
			setNotification({
				title: 'Invalid Discount!',
				message: 'Please enter a valid discount',
				type: 'ERROR',
			});
			setTimeout(() => discountPerSubjectRef.current?.classList?.remove(ErrorTextBoxClass), 500);
		}

		if (valid) {
			setConfirmation(true);
		}
	}, [handleUpdate]);

	const discountOnBlurFormat = useCallback(() => {
		const value = discountPerSubjectRef.current.value.replace('RM', '').trim();
		const parsed = parseFloatOrUndefined(value, 2) as number;
		if (parsed) {
			discountPerSubjectRef.current.value = 'RM ' + parsed.toFixed(2);
		}
	}, [discountPerSubjectRef]);

	const discountOnFocusFormat = useCallback(() => {
		discountPerSubjectRef.current.value = discountPerSubjectRef.current.value.replace('RM ', '');
	}, [discountPerSubjectRef]);

	const closeHandler = useCallback(() => {
		if (
			startDateRef.current?.value.trim() !== data.start_date.toLocaleDateString() ||
			endDateRef.current?.value.trim() !== data.end_date.toLocaleDateString() ||
			formRef.current?.value.trim() !== data.form_id.toString() ||
			subjectCountFromRef.current?.value.trim() !== data.subject_count_from.toString() ||
			subjectCountToRef.current?.value.trim() !== data.subject_count_to.toString() ||
			discountPerSubjectRef.current?.value.trim() !== data.discount_per_subject.toFixed(2)
		) {
			setCloseConfirmation(true);
		} else {
			closeModal();
		}
	}, [
		startDateRef,
		endDateRef,
		formRef,
		subjectCountFromRef,
		subjectCountToRef,
		discountPerSubjectRef,
	]);

	const modalButtons: ModalButtons = [
		{
			text: 'Update',
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
				await handleUpdate(data.id, {
					start_date: parseDateOrUndefined(startDateRef.current.value),
					end_date: parseDateOrUndefined(endDateRef.current.value),
					form_id: parseIntOrUndefined(formRef.current.value),
					subject_count_from: parseIntOrUndefined(subjectCountFromRef.current.value),
					subject_count_to: parseIntOrUndefined(subjectCountToRef.current.value),
					discount_per_subject: parseFloatOrUndefined(discountPerSubjectRef.current.value, 2),
				} as PackagesUpdateDto);
				setConfirmation(false);
				closeModal();
			},
		},
	];

	const closeConfirmationButtons: ModalButtons = [
		{
			text: 'Cancel',
			class: GrayButtonClass,
			action: () => setCloseConfirmation(false),
		},
		{
			text: 'Discard',
			class: RedButtonClass,
			action: () => {
				setCloseConfirmation(false);
				closeModal();
			},
		},
	];

	return (
		<React.Fragment>
			<Modal
				title="Edit Package"
				closeModal={closeHandler}
				closeOnBlur={false}
				buttons={modalButtons}
			>
				<div className={clsx('grid')}>
					<div className={clsx('flex', 'flex-col')}>
						<label htmlFor="form" className={LabelTopClass}>
							Form:
							<RequiredIcon />
						</label>
						<select
							id="form"
							className={clsx(TextBoxBottomClass, formValid || InvalidTextBoxClass)}
							ref={formRef}
							onChange={() => setFormValid(true)}
							onClick={() => refetchForm()}
						>
							<option value="" disabled>
								Select a Form
							</option>
							{formData.map(({ id, form_name }) => (
								<option key={id} value={id}>
									{form_name}
								</option>
							))}
						</select>
					</div>
					<div className={clsx('flex', 'flex-col')}>
						<label htmlFor="startDate" className={LabelTopClass}>
							Start Date:
							<RequiredIcon />
						</label>
						<input
							type="date"
							id="startDate"
							className={clsx(TextBoxBottomClass, startDateValid || InvalidTextBoxClass)}
							placeholder="E.g. 01/01/2000"
							maxLength={50}
							required
							ref={startDateRef}
							onChange={() => setStartDateValid(true)}
						/>
					</div>
					<div className={clsx('flex', 'flex-col')}>
						<label htmlFor="endDate" className={LabelTopClass}>
							End Date:
						</label>
						<input
							type="date"
							id="endDate"
							className={clsx(TextBoxBottomClass, endDateValid || InvalidTextBoxClass)}
							placeholder="E.g. 01/01/2000"
							maxLength={50}
							required
							ref={endDateRef}
							onChange={() => setEndDateValid(true)}
						/>
					</div>
					<div className={clsx('flex', 'flex-col')}>
						<label htmlFor="subjectCountFrom" className={LabelTopClass}>
							Subject Count From:
							<RequiredIcon />
						</label>
						<input
							type="number"
							id="subjectCountFrom"
							className={clsx(TextBoxBottomClass, subjectCountFromValid || InvalidTextBoxClass)}
							max={20}
							ref={subjectCountFromRef}
							onChange={() => setSubjectCountFromValid(true)}
						/>
					</div>
					<div className={clsx('flex', 'flex-col')}>
						<label htmlFor="subjectCountTo" className={LabelTopClass}>
							Subject Count To:
						</label>
						<input
							type="number"
							id="subjectCountTo"
							className={clsx(TextBoxBottomClass, subjectCountToValid || InvalidTextBoxClass)}
							max={20}
							ref={subjectCountToRef}
							onChange={() => setSubjectCountToValid(true)}
						/>
					</div>
					<div className={clsx('flex', 'flex-col')}>
						<label htmlFor="discountPerSubject" className={LabelTopClass}>
							Discount Per Subject:
							<RequiredIcon />
						</label>
						<input
							type="text"
							id="discountPerSubject"
							className={clsx(TextBoxBottomClass, discountPerSubjectValid || InvalidTextBoxClass)}
							placeholder="E.g. 012-345 6789"
							maxLength={50}
							required
							ref={discountPerSubjectRef}
							onChange={() => setDiscountPerSubjectValid(true)}
							onBlur={() => discountOnBlurFormat()}
							onFocus={() => discountOnFocusFormat()}
						/>
					</div>
				</div>
			</Modal>
			{confirmation ? (
				<Modal
					title="Confirmation"
					closeModal={() => setConfirmation(false)}
					closeOnBlur={false}
					buttons={confirmationButtons}
				>
					<p>Confirm Update?</p>
				</Modal>
			) : null}
			{closeConfirmation ? (
				<Modal
					title="Confirmation"
					closeModal={() => setCloseConfirmation(false)}
					closeOnBlur={false}
					buttons={closeConfirmationButtons}
				>
					<p>Discard data?</p>
				</Modal>
			) : null}
		</React.Fragment>
	);
}

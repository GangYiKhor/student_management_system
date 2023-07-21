import React, { useCallback, useEffect, useRef, useState } from 'react';
import Modal, { ModalButtons } from '../../../components/modal';
import {
	ErrorTextBoxClass,
	InvalidTextBoxClass,
	LabelTopClass,
	TextBoxBottomClass,
} from '../../../utils/class/inputs';
import clsx from 'clsx';
import { GrayButtonClass, GreenButtonClass, RedButtonClass } from '../../../utils/class/button';
import { useNotificationContext } from '../../../components/providers/notification-providers';
import { RequiredIcon } from '../../../components/required';
import { PackagesCreateDto } from '../../../dtos/packages/create';
import { useGet } from '../../../hooks/use-get';
import { StudentFormsGetDto } from '../../../dtos/student-forms/get';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PackagesUpdateDto } from '../../../dtos/packages/update';
import { ErrorResponse } from '../../../responses/error';
import { StudentFormsGetResponse } from '../../../responses/student-forms/get';
import {
	parseDateOrUndefined,
	parseIntOrUndefined,
	parseFloatOrUndefined,
} from '../../../utils/parser';

type PropType = {
	closeModal: () => void;
	handleAdd: (createData: PackagesCreateDto) => Promise<void>;
};

export function PackagesCreateModal({ closeModal, handleAdd }: PropType) {
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

	const handleSubmit = useCallback(() => {
		let valid = true;
		const isStartDateRefEmpty = startDateRef.current.value.trim() === '';
		if (isStartDateRefEmpty) {
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

		const isFormRefEmpty = formRef.current.value.trim() === '';
		if (isFormRefEmpty) {
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

		const isSubjectCountFromRefEmpty = subjectCountFromRef.current.value.trim() === '';
		if (isSubjectCountFromRefEmpty) {
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

		const isDiscountPerSubjectRefEmpty = discountPerSubjectRef.current.value.trim() === '';
		if (isDiscountPerSubjectRefEmpty) {
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

		if (startDateValid && parseDateOrUndefined(startDateRef.current.value) === undefined) {
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

		if (
			endDateRef.current.value.trim() &&
			parseDateOrUndefined(endDateRef.current.value) === undefined
		) {
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

		const subjectCountFromRefInt = parseIntOrUndefined(subjectCountFromRef.current.value);
		if (
			!isSubjectCountFromRefEmpty &&
			(subjectCountFromRefInt === undefined || (subjectCountFromRefInt as number) < 0)
		) {
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

		const subjectCountToRefInt = parseIntOrUndefined(subjectCountToRef.current.value);
		if (
			subjectCountToRef.current.value.trim() &&
			(!subjectCountToRefInt ||
				(subjectCountFromRef &&
					(subjectCountToRefInt as number) < (subjectCountFromRefInt as number)))
		) {
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

		if (
			!isDiscountPerSubjectRefEmpty &&
			parseFloatOrUndefined(discountPerSubjectRef.current.value.replace('RM', '').trim(), 2) ===
				undefined
		) {
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
	}, [handleAdd]);

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
			startDateRef.current?.value.trim() !== '' ||
			endDateRef.current?.value.trim() !== '' ||
			formRef.current?.value.trim() !== '' ||
			subjectCountFromRef.current?.value.trim() !== '' ||
			subjectCountToRef.current?.value.trim() !== '' ||
			discountPerSubjectRef.current?.value.trim() !== ''
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
					start_date: parseDateOrUndefined(startDateRef.current.value),
					end_date: parseDateOrUndefined(endDateRef.current.value),
					form_id: parseIntOrUndefined(formRef.current.value),
					subject_count_from: parseIntOrUndefined(subjectCountFromRef.current.value),
					subject_count_to: parseIntOrUndefined(subjectCountToRef.current.value),
					discount_per_subject: parseFloatOrUndefined(
						discountPerSubjectRef.current.value.replace('RM', '').trim(),
						2,
					),
				} as PackagesCreateDto);
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
				title="Create Package"
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
							<option value="" selected disabled>
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

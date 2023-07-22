import React, { useCallback, useRef, useState } from 'react';
import Modal, { ModalButtons } from '../../../components/modal';
import {
	InvalidTextBoxClass,
	LabelTopClass,
	TextBoxBottomClass,
} from '../../../utils/class/inputs';
import clsx from 'clsx';
import { GrayButtonClass, GreenButtonClass, RedButtonClass } from '../../../utils/class/button';
import { RequiredIcon } from '../../../components/required';
import { PackagesCreateDto } from '../../../dtos/packages/create';
import { useGet } from '../../../hooks/use-get';
import { StudentFormsGetDto } from '../../../dtos/student-forms/get';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ErrorResponse } from '../../../responses/error';
import { StudentFormsGetResponse } from '../../../responses/student-forms/get';
import {
	parseDateOrUndefined,
	parseIntOrUndefined,
	parseFloatOrUndefined,
} from '../../../utils/parser';
import { useHandleSubmit } from '../hooks/useHandleSubmit';

type PropType = {
	closeModal: () => void;
	handleAdd: (createData: PackagesCreateDto) => Promise<void>;
};

export function PackagesCreateModal({ closeModal, handleAdd }: PropType) {
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
	const handleSubmit = useHandleSubmit({
		startDateRef,
		endDateRef,
		formRef,
		subjectCountFromRef,
		subjectCountToRef,
		discountPerSubjectRef,
		setStartDateValid,
		setEndDateValid,
		setFormValid,
		setSubjectCountFromValid,
		setSubjectCountToValid,
		setDiscountPerSubjectValid,
		setConfirmation,
	});

	const getForms = useGet<StudentFormsGetDto>('/api/student-forms');
	const { data: formData, refetch: refetchForm } = useQuery<
		StudentFormsGetResponse,
		AxiosError<ErrorResponse>
	>({
		queryKey: ['forms'],
		queryFn: () => getForms({ orderBy: 'form_name asc' }),
		enabled: true,
	});

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
				try {
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
				} catch (error) {
					setConfirmation(false);
				}
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
							placeholder="E.g. 1.00"
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

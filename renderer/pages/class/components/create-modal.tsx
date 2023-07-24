import React, { useCallback } from 'react';
import Modal, { ModalButtons } from '../../../components/modal';
import {
	InvalidTextBoxClass,
	LabelTopClass,
	TextBoxBottomClass,
} from '../../../utils/class/inputs';
import clsx from 'clsx';
import { GrayButtonClass, GreenButtonClass, RedButtonClass } from '../../../utils/class/button';
import { RequiredIcon } from '../../../components/required';
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
import { ClassCreateDto } from '../../../dtos/class/create';
import { TeachersGetResponse } from '../../../responses/teachers/get';
import { useClassRefs } from '../hooks/useClassRefs';

type PropType = {
	closeModal: () => void;
	handleAdd: (createData: ClassCreateDto) => Promise<void>;
};

export function ClassCreateModal({ closeModal, handleAdd }: PropType) {
	const {
		classNameRef,
		classNameValid,
		formRef,
		formValid,
		teacherRef,
		teacherValid,
		classYearRef,
		classYearValid,
		startDateRef,
		startDateValid,
		endDateRef,
		endDateValid,
		dayRef,
		dayValid,
		startTimeRef,
		startTimeValid,
		endTimeRef,
		endTimeValid,
		feesRef,
		feesValid,
		packageRef,
		packageValid,
		confirmation,
		setConfirmation,
		closeConfirmation,
		setCloseConfirmation,
		handleSubmit,
		closeHandler,
	} = useClassRefs({ closeModal });

	const getForms = useGet<StudentFormsGetDto>('/api/student-forms');
	const { data: formData, refetch: refetchForm } = useQuery<
		StudentFormsGetResponse,
		AxiosError<ErrorResponse>
	>({
		queryKey: ['forms'],
		queryFn: () => getForms({ is_active: true, orderBy: 'form_name asc' }),
		enabled: true,
	});

	const getTeachers = useGet<StudentFormsGetDto>('/api/teachers');
	const { data: teacherData, refetch: refetchTeacher } = useQuery<
		TeachersGetResponse,
		AxiosError<ErrorResponse>
	>({
		queryKey: ['teachers'],
		queryFn: () => getTeachers({ is_active: true, orderBy: 'teacher_name asc' }),
		enabled: true,
	});

	const feesOnBlurFormat = useCallback(() => {
		const value = feesRef.current.value.replace('RM', '').trim();
		const parsed = parseFloatOrUndefined(value, 2);
		if (parsed) {
			feesRef.current.value = 'RM ' + parsed.toFixed(2);
		}
	}, [feesRef]);

	const feesOnFocusFormat = useCallback(() => {
		feesRef.current.value = feesRef.current.value.replace('RM ', '');
	}, [feesRef]);

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
						class_name: classNameRef.current.value,
						teacher_id: parseIntOrUndefined(teacherRef.current.value),
						form_id: parseIntOrUndefined(formRef.current.value),
						class_year: parseIntOrUndefined(classYearRef.current.value),
						start_date: parseDateOrUndefined(startDateRef.current.value),
						end_date: parseDateOrUndefined(endDateRef.current.value),
						day: parseIntOrUndefined(dayRef.current.value),
						start_time: parseDateOrUndefined(startTimeRef.current.value),
						end_time: parseDateOrUndefined(endTimeRef.current.value),
						fees: parseFloatOrUndefined(feesRef.current.value, 2),
						is_package: packageRef.current.value === 'yes',
					});
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
				title="Create Class"
				closeModal={closeHandler}
				closeOnBlur={false}
				buttons={modalButtons}
			>
				<div className={clsx('grid')}>
					<div className={clsx('flex', 'flex-col')}>
						<label htmlFor="className" className={LabelTopClass}>
							Class Name:
							<RequiredIcon />
						</label>
						<input
							type="text"
							id="className"
							className={clsx(TextBoxBottomClass, classNameValid.value || InvalidTextBoxClass)}
							placeholder="E.g. English"
							maxLength={50}
							required
							ref={classNameRef}
							onChange={() => classNameValid.set(true)}
						/>
					</div>
					<div className={clsx('flex', 'flex-col')}>
						<label htmlFor="form" className={LabelTopClass}>
							Form:
							<RequiredIcon />
						</label>
						<select
							id="form"
							className={clsx(TextBoxBottomClass, formValid.value || InvalidTextBoxClass)}
							ref={formRef}
							onChange={() => formValid.set(true)}
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
						<label htmlFor="teacher" className={LabelTopClass}>
							Teacher:
							<RequiredIcon />
						</label>
						<select
							id="teacher"
							className={clsx(TextBoxBottomClass, teacherValid.value || InvalidTextBoxClass)}
							ref={teacherRef}
							onChange={() => teacherValid.set(true)}
							onClick={() => refetchForm()}
						>
							<option value="" selected disabled>
								Select a Form
							</option>
							{teacherData.map(({ id, teacher_name }) => (
								<option key={id} value={id}>
									{teacher_name}
								</option>
							))}
						</select>
					</div>
					<div className={clsx('flex', 'flex-col')}>
						<label htmlFor="classYear" className={LabelTopClass}>
							Year:
							<RequiredIcon />
						</label>
						<input
							type="number"
							id="classYear"
							className={clsx(TextBoxBottomClass, classYearValid.value || InvalidTextBoxClass)}
							placeholder="E.g. 2023"
							min={2010}
							max={2200}
							required
							ref={classYearRef}
							onChange={() => classYearValid.set(true)}
						/>
					</div>
					<div className={clsx('flex', 'flex-col')}>
						<label htmlFor="startDate" className={LabelTopClass}>
							Start Date:
							<RequiredIcon />
						</label>
						<input
							type="date"
							id="startDate"
							className={clsx(TextBoxBottomClass, startDateValid.value || InvalidTextBoxClass)}
							placeholder="E.g. 01/01/2000"
							required
							ref={startDateRef}
							onChange={() => startDateValid.set(true)}
						/>
					</div>
					<div className={clsx('flex', 'flex-col')}>
						<label htmlFor="endDate" className={LabelTopClass}>
							End Date:
							<RequiredIcon />
						</label>
						<input
							type="date"
							id="endDate"
							className={clsx(TextBoxBottomClass, endDateValid.value || InvalidTextBoxClass)}
							placeholder="E.g. 01/01/2000"
							required
							ref={endDateRef}
							onChange={() => endDateValid.set(true)}
						/>
					</div>
					<div className={clsx('flex', 'flex-col')}>
						<label htmlFor="day" className={LabelTopClass}>
							Day:
							<RequiredIcon />
						</label>
						<select
							id="day"
							className={clsx(TextBoxBottomClass, dayValid.value || InvalidTextBoxClass)}
							ref={formRef}
							onChange={() => dayValid.set(true)}
						>
							<option value="" selected disabled>
								Select a Day
							</option>
							<option value="1">Monday</option>
							<option value="2">Tuesday</option>
							<option value="3">Wednesday</option>
							<option value="4">Thursday</option>
							<option value="5">Friday</option>
							<option value="6">Saturday</option>
							<option value="7">Sunday</option>
						</select>
					</div>
					<div className={clsx('flex', 'flex-col')}>
						<label htmlFor="startTime" className={LabelTopClass}>
							Start Time:
							<RequiredIcon />
						</label>
						<input
							type="time"
							id="startTime"
							className={clsx(TextBoxBottomClass, startTimeValid.value || InvalidTextBoxClass)}
							placeholder="E.g. 15:00:00"
							required
							ref={startTimeRef}
							onChange={() => startTimeValid.set(true)}
						/>
					</div>
					<div className={clsx('flex', 'flex-col')}>
						<label htmlFor="endTime" className={LabelTopClass}>
							End Time:
							<RequiredIcon />
						</label>
						<input
							type="time"
							id="endTime"
							className={clsx(TextBoxBottomClass, endTimeValid.value || InvalidTextBoxClass)}
							placeholder="E.g. 15:00:00"
							required
							ref={endTimeRef}
							onChange={() => endTimeValid.set(true)}
						/>
					</div>
					<div className={clsx('flex', 'flex-col')}>
						<label htmlFor="fees" className={LabelTopClass}>
							Fees:
						</label>
						<input
							type="string"
							id="fees"
							className={clsx(TextBoxBottomClass, feesValid.value || InvalidTextBoxClass)}
							placeholder="E.g. 5.00"
							required
							ref={endDateRef}
							onChange={() => feesValid.set(true)}
							onBlur={feesOnBlurFormat}
							onFocus={feesOnFocusFormat}
						/>
					</div>
					<div className={clsx('flex', 'flex-col')}>
						<label htmlFor="package" className={LabelTopClass}>
							Package:
							<RequiredIcon />
						</label>
						<select
							id="package"
							className={clsx(TextBoxBottomClass, packageValid.value || InvalidTextBoxClass)}
							ref={formRef}
							onChange={() => packageValid.set(true)}
						>
							<option value="" selected disabled>
								Select a Status
							</option>
							<option value="yes">Yes</option>
							<option value="no">No</option>
						</select>
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
					<p>Confirm Create?</p>
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

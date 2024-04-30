import React, { useEffect } from 'react';
import Modal, { ModalButtons } from '../../../components/modal';
import { GrayButtonClass, GreenButtonClass, RedButtonClass } from '../../../utils/class/button';
import { EditData } from './table';
import {
	parseDateOrUndefined,
	parseFloatOrUndefined,
	parseIntOrUndefined,
} from '../../../utils/parser';
import { ClassUpdateDto } from '../../../dtos/class/update';
import { useClassRefs } from '../hooks/useClassRefs';
import { ClassModal } from './class-modal';

type PropType = {
	closeModal: () => void;
	handleUpdate: (id: number, data: ClassUpdateDto) => Promise<void>;
	data: EditData;
};

export function ClassEditModal({ closeModal, handleUpdate, data }: PropType) {
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

	useEffect(() => {
		classNameRef.current.value = data.class_name;
		formRef.current.value = data.form_id.toString();
		teacherRef.current.value = data.teacher_id.toString();
		classYearRef.current.value = data.class_year.toString();
		startDateRef.current.value = data.start_date.toISOString().split('T')[0];
		endDateRef.current.value = data.end_date.toISOString().split('T')[0];
		dayRef.current.value = data.day.toString();
		startTimeRef.current.value = data.start_time.toLocaleTimeString();
		endTimeRef.current.value = data.end_time.toLocaleTimeString();
		feesRef.current.value = 'RM ' + data.fees.toFixed(2);
		packageRef.current.value = data.is_package ? 'yes' : 'no';
	}, [data]);

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
				try {
					await handleUpdate(data.id, {
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
			<ClassModal
				title="Edit Class"
				classNameRef={classNameRef}
				classNameValid={classNameValid}
				formRef={formRef}
				formValid={formValid}
				teacherRef={teacherRef}
				teacherValid={teacherValid}
				classYearRef={classYearRef}
				classYearValid={classYearValid}
				startDateRef={startDateRef}
				startDateValid={startDateValid}
				endDateRef={endDateRef}
				endDateValid={endDateValid}
				dayRef={dayRef}
				dayValid={dayValid}
				startTimeRef={startTimeRef}
				startTimeValid={startTimeValid}
				endTimeRef={endTimeRef}
				endTimeValid={endTimeValid}
				feesRef={feesRef}
				feesValid={feesValid}
				packageRef={packageRef}
				packageValid={packageValid}
				closeHandler={closeHandler}
				modalButtons={modalButtons}
			/>
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

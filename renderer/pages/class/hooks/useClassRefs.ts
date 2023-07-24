import { useState } from 'react';
import { useInputRef } from '../../../hooks/use-input-ref';
import { useSelectRef } from '../../../hooks/use-select-ref';
import { useHandleSubmit } from './useHandleSubmit';
import { EditData } from '../components/table';

type PropType = {
	closeModal: () => void;
	data?: EditData;
};

export function useClassRefs({ closeModal, data }: PropType) {
	const [classNameRef, classNameValid] = useInputRef();
	const [formRef, formValid] = useSelectRef();
	const [teacherRef, teacherValid] = useSelectRef();
	const [classYearRef, classYearValid] = useInputRef();
	const [startDateRef, startDateValid] = useInputRef();
	const [endDateRef, endDateValid] = useInputRef();
	const [dayRef, dayValid] = useInputRef();
	const [startTimeRef, startTimeValid] = useInputRef();
	const [endTimeRef, endTimeValid] = useInputRef();
	const [feesRef, feesValid] = useInputRef();
	const [packageRef, packageValid] = useSelectRef();
	const [confirmation, setConfirmation] = useState(false);
	const [closeConfirmation, setCloseConfirmation] = useState(false);
	const handleSubmit = useHandleSubmit({
		classNameRef,
		formRef,
		teacherRef,
		classYearRef,
		startDateRef,
		endDateRef,
		dayRef,
		startTimeRef,
		endTimeRef,
		feesRef,
		packageRef,
		setClassNameValid: classNameValid.set,
		setFormValid: formValid.set,
		setTeacherValid: teacherValid.set,
		setClassYearValid: classYearValid.set,
		setStartDateValid: startDateValid.set,
		setEndDateValid: endDateValid.set,
		setDayValid: dayValid.set,
		setStartTimeValid: startTimeValid.set,
		setEndTimeValid: endTimeValid.set,
		setFeesValid: feesValid.set,
		setPackageValid: packageValid.set,
		setConfirmation,
	});

	const closeHandler = () => {
		if (
			classNameRef.current.value.trim() !== (data?.class_name || '') ||
			formRef.current.value.trim() !== (data?.form_id.toString() || '') ||
			teacherRef.current.value.trim() !== (data?.teacher_id.toString() || '') ||
			classYearRef.current.value.trim() !== (data?.class_year.toString() || '') ||
			startDateRef.current.value.trim() !== (data?.start_date.toISOString() || '') ||
			endDateRef.current.value.trim() !== (data?.end_date.toISOString() || '') ||
			dayRef.current.value.trim() !== (data?.day.toString() || '') ||
			startTimeRef.current.value.trim() !== (data?.start_time.toLocaleTimeString() || '') ||
			endTimeRef.current.value.trim() !== (data?.end_time.toLocaleTimeString() || '') ||
			feesRef.current.value.replace('RM', '').trim() !== (+data?.fees.toFixed(2) || '') ||
			packageRef.current.value.trim() !== (data ? (data.is_package ? 'yes' : 'no') : '')
		) {
			setCloseConfirmation(true);
		} else {
			closeModal();
		}
	};

	return {
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
	};
}

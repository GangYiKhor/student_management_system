import { useNotificationContext } from '../../../components/providers/notification-providers';
import {
	parseDateOrUndefined,
	parseIntOrUndefined,
	parseFloatOrUndefined,
} from '../../../utils/parser';
import { fieldCheckerRequired, fieldCheckerRequiredValue } from '../../../utils/field-checker';

type PropType = {
	classNameRef: React.MutableRefObject<HTMLInputElement | HTMLSelectElement>;
	formRef: React.MutableRefObject<HTMLInputElement | HTMLSelectElement>;
	teacherRef: React.MutableRefObject<HTMLInputElement | HTMLSelectElement>;
	classYearRef: React.MutableRefObject<HTMLInputElement | HTMLSelectElement>;
	startDateRef: React.MutableRefObject<HTMLInputElement | HTMLSelectElement>;
	endDateRef: React.MutableRefObject<HTMLInputElement | HTMLSelectElement>;
	dayRef: React.MutableRefObject<HTMLInputElement | HTMLSelectElement>;
	startTimeRef: React.MutableRefObject<HTMLInputElement | HTMLSelectElement>;
	endTimeRef: React.MutableRefObject<HTMLInputElement | HTMLSelectElement>;
	feesRef: React.MutableRefObject<HTMLInputElement | HTMLSelectElement>;
	packageRef: React.MutableRefObject<HTMLInputElement | HTMLSelectElement>;
	setClassNameValid: React.Dispatch<React.SetStateAction<boolean>>;
	setFormValid: React.Dispatch<React.SetStateAction<boolean>>;
	setTeacherValid: React.Dispatch<React.SetStateAction<boolean>>;
	setClassYearValid: React.Dispatch<React.SetStateAction<boolean>>;
	setStartDateValid: React.Dispatch<React.SetStateAction<boolean>>;
	setEndDateValid: React.Dispatch<React.SetStateAction<boolean>>;
	setDayValid: React.Dispatch<React.SetStateAction<boolean>>;
	setStartTimeValid: React.Dispatch<React.SetStateAction<boolean>>;
	setEndTimeValid: React.Dispatch<React.SetStateAction<boolean>>;
	setFeesValid: React.Dispatch<React.SetStateAction<boolean>>;
	setPackageValid: React.Dispatch<React.SetStateAction<boolean>>;
	setConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useHandleSubmit({
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
	setClassNameValid,
	setFormValid,
	setTeacherValid,
	setClassYearValid,
	setStartDateValid,
	setEndDateValid,
	setDayValid,
	setStartTimeValid,
	setEndTimeValid,
	setFeesValid,
	setPackageValid,
	setConfirmation,
}: PropType) {
	const { setNotification } = useNotificationContext();

	const handleSubmit = () => {
		let valid = true;

		valid =
			fieldCheckerRequired(classNameRef, setClassNameValid, {
				itemName: 'class name',
				setNotification,
			}) && valid;

		valid =
			fieldCheckerRequired(formRef, setFormValid, { itemName: 'form', setNotification }) && valid;

		valid =
			fieldCheckerRequired(teacherRef, setTeacherValid, { itemName: 'teacher', setNotification }) &&
			valid;

		valid =
			fieldCheckerRequiredValue(
				classYearRef,
				setClassYearValid,
				value => parseIntOrUndefined(value) >= 2000 && parseIntOrUndefined(value) <= 2200,
				{ itemName: 'class year', setNotification },
			) && valid;

		const isStartDateValid = fieldCheckerRequiredValue(
			startDateRef,
			setStartDateValid,
			parseDateOrUndefined,
			{ itemName: 'start date', setNotification },
		);
		valid = isStartDateValid && valid;

		let startDateValue: number = undefined;
		if (isStartDateValid) {
			startDateValue = parseDateOrUndefined(startDateRef.current.value).getTime();
		}

		valid =
			fieldCheckerRequiredValue(
				endDateRef,
				setEndDateValid,
				value => (startDateValue ? parseDateOrUndefined(value).getTime() >= startDateValue : true),
				{
					itemName: 'end date',
					setNotification,
				},
			) && valid;

		valid =
			fieldCheckerRequiredValue(
				dayRef,
				setDayValid,
				value => parseIntOrUndefined(value) >= 1 && parseIntOrUndefined(value) <= 7,
				{ itemName: 'day', setNotification },
			) && valid;

		const isStartTimeValid = fieldCheckerRequiredValue(
			startTimeRef,
			setStartTimeValid,
			parseDateOrUndefined,
			{ itemName: 'start time', setNotification },
		);
		valid = isStartTimeValid && valid;

		let startTimeValue: number = undefined;
		if (isStartTimeValid) {
			startDateValue = parseDateOrUndefined(startDateRef.current.value).getTime();
		}

		valid =
			fieldCheckerRequiredValue(
				endTimeRef,
				setEndTimeValid,
				value => (startTimeValue ? parseDateOrUndefined(value).getTime() >= startTimeValue : true),
				{
					itemName: 'end time',
					setNotification,
				},
			) && valid;

		valid =
			fieldCheckerRequiredValue(feesRef, setFeesValid, value => parseFloatOrUndefined(value) >= 0, {
				itemName: 'fees',
				setNotification,
			}) && valid;

		valid = fieldCheckerRequired(packageRef, setPackageValid, {
			itemName: 'package',
			setNotification,
		});

		if (valid) {
			setConfirmation(true);
		}
	};

	return handleSubmit;
}

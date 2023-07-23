import { useNotificationContext } from '../../../components/providers/notification-providers';
import {
	parseDateOrUndefined,
	parseIntOrUndefined,
	parseFloatOrUndefined,
} from '../../../utils/parser';
import { fieldCheckerRequired, fieldCheckerRequiredValue } from '../../../utils/field-checker';

type PropType = {
	startDateRef: React.MutableRefObject<HTMLInputElement>;
	endDateRef: React.MutableRefObject<HTMLInputElement>;
	formRef: React.MutableRefObject<HTMLSelectElement>;
	subjectCountFromRef: React.MutableRefObject<HTMLInputElement>;
	subjectCountToRef: React.MutableRefObject<HTMLInputElement>;
	discountPerSubjectRef: React.MutableRefObject<HTMLInputElement>;
	setStartDateValid: React.Dispatch<React.SetStateAction<boolean>>;
	setEndDateValid: React.Dispatch<React.SetStateAction<boolean>>;
	setFormValid: React.Dispatch<React.SetStateAction<boolean>>;
	setSubjectCountFromValid: React.Dispatch<React.SetStateAction<boolean>>;
	setSubjectCountToValid: React.Dispatch<React.SetStateAction<boolean>>;
	setDiscountPerSubjectValid: React.Dispatch<React.SetStateAction<boolean>>;
	setConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useHandleSubmit({
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
}: PropType) {
	const { setNotification } = useNotificationContext();

	const handleSubmit = () => {
		let valid = true;

		const isStartDateValid = fieldCheckerRequiredValue(
			startDateRef,
			setStartDateValid,
			parseDateOrUndefined,
			{ itemName: 'start date', setNotification },
		);
		valid = isStartDateValid && valid;

		let startDateValue: number = undefined;
		if (isStartDateValid) {
			startDateValue = (parseDateOrUndefined(startDateRef.current.value) as Date).getTime();
		}

		valid =
			fieldCheckerRequiredValue(
				endDateRef,
				setEndDateValid,
				value =>
					startDateValue ? (parseDateOrUndefined(value) as Date).getTime() >= startDateValue : true,
				{
					itemName: 'end date',
					setNotification,
				},
			) && valid;

		valid =
			fieldCheckerRequired(formRef, setFormValid, { itemName: 'form', setNotification }) && valid;

		const isSubjectFromValid = fieldCheckerRequiredValue(
			subjectCountFromRef,
			setSubjectCountFromValid,
			value => (parseIntOrUndefined(value) as number) >= 0,
			{ itemName: 'subject count', setNotification },
		);
		valid = isSubjectFromValid && valid;
		let subjectCountFromValue = 0;
		if (isSubjectFromValid) {
			subjectCountFromValue = parseIntOrUndefined(subjectCountFromRef.current.value) as number;
		}

		valid =
			fieldCheckerRequiredValue(
				subjectCountToRef,
				setSubjectCountToValid,
				value => (parseIntOrUndefined(value) as number) > subjectCountFromValue,
				{ itemName: 'subject count', setNotification },
			) && valid;

		valid =
			fieldCheckerRequiredValue(
				discountPerSubjectRef,
				setDiscountPerSubjectValid,
				value => (parseFloatOrUndefined(value.replace('RM', '').trim()) as number) >= 0,
				{ itemName: 'discount', setNotification },
			) && valid;

		if (valid) {
			setConfirmation(true);
		}
	};

	return handleSubmit;
}

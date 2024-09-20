import { range, startCase } from 'lodash';
import { useNotificationContext } from '../../../components/providers/notification-providers';
import { CLASS_COUNT, MONTH_SHORT } from '../../../utils/constants/constants';
import { fieldCheckerRequired, fieldCheckerValue } from '../../../utils/field-checker';
import { GenericSetSingleFormData } from '../../../utils/types/form';
import { FormDataType } from '../types';

type PropType = {
	formData: FormDataType;
	setFormData: GenericSetSingleFormData;
};

export function useVerifyInputs({ formData, setFormData }: PropType) {
	const { setNotification } = useNotificationContext();

	return () => {
		let valid = true;

		valid = fieldCheckerRequired(
			valid,
			formData,
			'student',
			'Student',
			setFormData,
			setNotification,
		);

		valid = fieldCheckerRequired(valid, formData, 'date', 'Date', setFormData, setNotification);

		valid = fieldCheckerRequired(
			valid,
			formData,
			'payment_year',
			'Year',
			setFormData,
			setNotification,
		);

		const monthChecks = Object.values(MONTH_SHORT).map(value => value.toLowerCase());

		valid = monthChecks.reduce(
			(prev, value) =>
				fieldCheckerValue(
					prev,
					formData,
					value,
					startCase(value),
					setFormData,
					setNotification,
					(value: number) => value >= 0 && value <= 1,
				),
			valid,
		);

		valid = fieldCheckerValue(
			valid,
			formData,
			'reg_fees',
			'Reg Fees',
			setFormData,
			setNotification,
			(value: number) => value >= 0,
		);

		const hasMonth = monthChecks.some(value => formData?.[value]?.value > 0);
		const hasClass = range(0, CLASS_COUNT, 1).some(value => formData?.[`class_${value}`]?.value);
		if (hasClass && !hasMonth) {
			valid = false;
			monthChecks.forEach(value => (formData[value].valid = false));
			setNotification({
				title: 'Please select a month!',
				source: 'Form',
			});
		}

		const classChoice = new Set<number>();
		let classValid = true;
		for (let i = 0; i < CLASS_COUNT; i++) {
			const value = formData?.[`class_${i}`]?.value;
			if (value == undefined || value === null) {
				continue;
			}

			if (classChoice.has(formData?.[`class_${i}`]?.value)) {
				formData[`class_${i}`].valid = false;
				classValid = false;
			}

			classChoice.add(formData?.[`class_${i}`].value);
		}

		if (!classValid) {
			setNotification({
				title: 'Duplicate Class',
				source: 'Form',
			});
		}
		valid &&= classValid;

		return valid;
	};
}

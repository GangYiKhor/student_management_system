import { MONTH_SHORT } from '../../../utils/constants/constants';
import { getToday, isSameDay } from '../../../utils/dateOperations';
import { FormDataType } from '../types';

type PropType = {
	formData: FormDataType;
};

export function useIsDirty({ formData }: Readonly<PropType>) {
	return () => {
		let isDirty = false;

		isDirty ||= formData?.student?.value !== undefined;
		isDirty ||= !isSameDay(formData?.date?.value, getToday());
		isDirty ||= formData?.payment_year?.value !== new Date().getFullYear();

		const curMonth = new Date().getMonth();
		isDirty = Object.entries(MONTH_SHORT).reduce(
			(curCondition, [num, month]) =>
				curCondition ||
				formData?.[month.toLowerCase()]?.value !== (curMonth === parseInt(num) ? 1 : 0),
			isDirty,
		);

		isDirty ||= formData?.reg_fees?.value !== undefined;
		isDirty ||= formData?.incentive?.value !== undefined;
		isDirty ||= formData?.voucher_id?.value.trim() !== '';
		isDirty ||= formData?.remarks?.value.trim() !== '';
		isDirty ||= formData?.status?.value.trim() !== '';

		return isDirty;
	};
}

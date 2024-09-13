import { useEffect } from 'react';
import { ComboBox } from '../../../components/inputs/combo-box';
import { DateRangeInput } from '../../../components/inputs/date-range-input';
import { NumberInput } from '../../../components/inputs/number-input';
import { SelectClass } from '../../../components/inputs/select-class';
import { SelectInput } from '../../../components/inputs/select-input';
import { useFormContext } from '../../../components/providers/form-providers';
import { SearchBar } from '../../../components/search-bar';
import { GeneralSearch } from '../../../components/searches/general-search';
import { useCustomQuery } from '../../../hooks/use-custom-query';
import { useGetOptions } from '../../../hooks/use-get';
import { useGetStudentComboBoxOptionsIdOnly } from '../../../hooks/use-get-student-options';
import {
	MONTH_OPTIONS,
	TEACHER_API_PATH,
	VOUCHER_API_PATH,
} from '../../../utils/constants/constants';
import { BlueButtonClass } from '../../../utils/tailwindClass/button';
import { TeachersGetDto } from '../../../utils/types/dtos/teachers/get';
import { VouchersGetDto } from '../../../utils/types/dtos/vouchers/get';
import { TeachersGetResponse } from '../../../utils/types/responses/teachers/get';
import { VouchersGetResponse } from '../../../utils/types/responses/vouchers/get';
import { SearchBarButtons } from '../../../utils/types/search-bar-button';
import { SearchDataType } from '../types';

type PropType = {
	setSearch: (value: string) => void;
	setStudentId: (value: number) => void;
	setClassId: (value: number) => void;
	setTeacherId: (value: number) => void;
	setStartDate: (value: Date) => void;
	setEndDate: (value: Date) => void;
	setYear: (value: number) => void;
	setMonth: (value: number) => void;
	setVoucherId: (value: string) => void;
	setToggleModal: (value: boolean) => void;
};

export function ReceiptsSearchAdd({
	setSearch,
	setStudentId,
	setClassId,
	setTeacherId,
	setStartDate,
	setEndDate,
	setYear,
	setMonth,
	setVoucherId,
	setToggleModal,
}: Readonly<PropType>) {
	const { formData } = useFormContext<SearchDataType>();

	const buttons: SearchBarButtons = [
		{
			text: 'Create Receipt',
			className: BlueButtonClass,
			onClick: () => setToggleModal(true),
		},
	];

	const getStudents = useGetStudentComboBoxOptionsIdOnly();
	const getTeachers = useGetOptions<TeachersGetDto, TeachersGetResponse>(
		TEACHER_API_PATH,
		value => value.teacher_name,
		value => value.id,
	);
	const getVouchers = useGetOptions<VouchersGetDto, VouchersGetResponse>(
		VOUCHER_API_PATH,
		value => value.id,
		value => value.id,
	);

	const { data: studentOptions } = useCustomQuery<{ id: number; student_name: string }[]>({
		queryKey: ['students'],
		queryFn: () => getStudents({ orderBy: 'student_name asc' }),
	});

	useEffect(() => {
		setSearch(formData.general?.value);
	}, [formData.general?.value]);

	useEffect(() => {
		setStudentId(formData.student_id?.value);
	}, [formData.student_id?.value]);

	useEffect(() => {
		setClassId(formData.class_id?.value);
	}, [formData.class_id?.value]);

	useEffect(() => {
		setTeacherId(formData.teacher_id?.value);
	}, [formData.teacher_id?.value]);

	useEffect(() => {
		setStartDate(formData.start_date?.value);
	}, [formData.start_date?.value]);

	useEffect(() => {
		setEndDate(formData.end_date?.value);
	}, [formData.end_date?.value]);

	useEffect(() => {
		setYear(formData.payment_year?.value);
	}, [formData.payment_year?.value]);

	useEffect(() => {
		setMonth(formData.payment_month?.value);
	}, [formData.payment_month?.value]);

	useEffect(() => {
		setVoucherId(formData.voucher_id?.value);
	}, [formData.voucher_id?.value]);

	return (
		<SearchBar buttons={buttons}>
			<GeneralSearch />

			<ComboBox
				id="student-search"
				label="Student"
				name="student_id"
				columns={['id', 'student_name']}
				options={studentOptions}
				labelColumn="student_name"
				valueParser={value => value?.id}
				leftLabel
			/>

			<SelectClass id="class-search" label="Class" name="class_id" queryKey="classSearch" onlyId />

			<SelectInput
				id="teacher-search"
				label="Teacher"
				name="teacher_id"
				queryFn={() => getTeachers({ is_active: true, orderBy: 'teacher_name asc' })}
				leftLabel
			/>

			<DateRangeInput label="Date" startName="start_date" endName="end_date" />

			<NumberInput
				id="year-search"
				label="Year"
				name="payment_year"
				min={2000}
				max={2200}
				step={1}
				leftLabel
			/>

			<SelectInput
				id="month-search"
				label="Month"
				name="payment_month"
				options={MONTH_OPTIONS}
				leftLabel
			/>

			<SelectInput
				id="voucher-search"
				label="Voucher"
				name="voucher_id"
				queryFn={() => getVouchers({ orderBy: 'id asc' })}
				leftLabel
			/>
		</SearchBar>
	);
}

import clsx from 'clsx';
import { PrinterIcon } from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ComboBox } from '../../components/inputs/combo-box';
import { DateRangeInput } from '../../components/inputs/date-range-input';
import { Form } from '../../components/inputs/form';
import { NumberInput } from '../../components/inputs/number-input';
import { SelectClass } from '../../components/inputs/select-class';
import { SelectInput } from '../../components/inputs/select-input';
import { LastUpdatedAt } from '../../components/last-updated';
import { Loader } from '../../components/loader';
import { useFormContext } from '../../components/providers/form-providers';
import { SearchBar } from '../../components/search-bar';
import { GeneralSearch } from '../../components/searches/general-search';
import {
	DefaultSort,
	TableColumnType,
	TableTemplate,
} from '../../components/tables/table-template';
import { useCustomQuery } from '../../hooks/use-custom-query';
import { useGet, useGetOptions } from '../../hooks/use-get';
import { useGetStudentComboBoxOptionsIdOnly } from '../../hooks/use-get-student-options';
import { Layout } from '../../layouts/basic_layout';
import {
	MONTH_OPTIONS,
	RECEIPT_API_PATH,
	RECEIPT_PRINT_PREVIEW_SIZE,
	TEACHER_API_PATH,
	VOUCHER_API_PATH,
} from '../../utils/constants/constants';
import { dateFormatter, parseDateTime } from '../../utils/dateOperations';
import { BlueButtonClass, GrayButtonClass } from '../../utils/tailwindClass/button';
import { ContentContainer } from '../../utils/tailwindClass/containers';
import { RedBoldText } from '../../utils/tailwindClass/text';
import { ReceiptsGetDto } from '../../utils/types/dtos/receipts/get';
import { TeachersGetDto } from '../../utils/types/dtos/teachers/get';
import { VouchersGetDto } from '../../utils/types/dtos/vouchers/get';
import {
	ReceiptsGetResponse,
	ReceiptsGetResponses,
} from '../../utils/types/responses/receipts/get';
import { TeachersGetResponse } from '../../utils/types/responses/teachers/get';
import { VouchersGetResponse } from '../../utils/types/responses/vouchers/get';
import { SearchBarButtons } from '../../utils/types/search-bar-button';

const SearchFormId = 'receipts-searchbar';
const defaultSort: DefaultSort = { field: 'id', asc: true };
const defaultSortString: string = `${defaultSort.field} ${defaultSort.asc ? 'asc' : 'desc'}`;

type SearchDataType = {
	general: string;
	student_id: number;
	class_id: number;
	teacher_id: number;
	start_date: Date;
	end_date: Date;
	payment_year: number;
	payment_month: number;
	voucher_id: string;
};

const columns: TableColumnType<ReceiptsGetResponse>[] = [
	{ title: 'ID', columnName: 'id', valueParser: value => value.receipt_no },
	{ title: 'Date', columnName: 'date', valueParser: value => dateFormatter(value.date) },
	{ title: 'Year', columnName: 'payment_year' },
	{ title: 'Student', columnName: 'student_name' },
	{ title: 'Form', columnName: 'form_name' },
	{
		title: 'Fees',
		columnName: 'total',
		valueParser: value => {
			if (value?.status !== 'Received') {
				return <span className={RedBoldText}>{value?.status?.toUpperCase()}</span>;
			} else {
				return `RM ${value.total.toFixed(2)}`;
			}
		},
	},
	{
		title: 'Print',
		columnName: 'action',
		addOnClass: 'w-[60px]',
		valueParser: value => (
			<button
				onClick={() =>
					window.open(
						`/receipts/${value?.id}`,
						'_blank',
						`${RECEIPT_PRINT_PREVIEW_SIZE},contextIsolation=no,nodeIntegration=yes`,
					)
				}
				className={clsx(GrayButtonClass, 'w-[55px]')}
			>
				<PrinterIcon />
			</button>
		),
		notClickable: true,
		notSortable: true,
	},
];

const parseGetData = (data: ReceiptsGetResponses) =>
	data.map(value => {
		value.date = parseDateTime(value.date);
		return value;
	});

function Receipts() {
	const router = useRouter();
	const { formData, getValues } = useFormContext<SearchDataType>(SearchFormId);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);

	// Fetch Data
	const getReceipts = useGet<ReceiptsGetDto, ReceiptsGetResponses>(RECEIPT_API_PATH, parseGetData);
	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<ReceiptsGetResponses>({
		queryKey: ['receipt-list'],
		queryFn: () => {
			const {
				student_id,
				class_id,
				teacher_id,
				start_date,
				end_date,
				payment_year,
				payment_month,
				voucher_id,
			} = getValues();
			return getReceipts({
				student_id,
				class_id,
				teacher_id,
				start_date,
				end_date,
				payment_year,
				payment_month,
				voucher_id,
				orderBy,
			});
		},
		fetchOnVariable: [
			formData?.student_id?.value,
			formData?.class_id?.value,
			formData?.teacher_id?.value,
			formData?.start_date?.value,
			formData?.end_date?.value,
			formData?.payment_year?.value,
			formData?.payment_month?.value,
			formData?.voucher_id?.value,
			orderBy,
		],
	});

	const handleEdit = (data: ReceiptsGetResponse) => {
		router.push(`/receipts/${data.id}`);
	};

	const handleCreate = () => {
		router.push(`/receipts/new`);
	};

	const buttons: SearchBarButtons = [
		{
			text: 'Create Receipt',
			className: BlueButtonClass,
			onClick: () => handleCreate(),
		},
	];

	// Fetch Options
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
		queryKey: ['student-options'],
		queryFn: () => getStudents({ orderBy: 'student_name asc' }),
	});

	const [tableData, setTableData] = useState<ReceiptsGetResponses>([]);
	useEffect(() => {
		let filteredData = data;
		const search = getValues()?.general?.trim().toLowerCase();
		if (search) {
			filteredData = filteredData.filter(
				value =>
					'#' + value.id === search ||
					value.receipt_no?.toLowerCase().includes(search) ||
					value.student_name?.toLowerCase().includes(search) ||
					value.remarks?.toLowerCase().includes(search) ||
					value.status?.toLowerCase().includes(search),
			);
		}

		setTableData(filteredData);
	}, [data, formData?.general?.value]);

	return (
		<React.Fragment>
			<Head>
				<title>Receipts</title>
			</Head>
			<Layout headerTitle="Receipts">
				<Loader isLoading={isLoading}>
					<div className={ContentContainer}>
						<Form formId={SearchFormId} keepData revertible>
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

								<SelectClass
									id="class-search"
									label="Class"
									name="class_id"
									queryKey="classSearch"
									onlyId
								/>

								<SelectInput
									id="teacher-search"
									label="Teacher"
									name="teacher_id"
									queryFn={() => getTeachers({ is_active: true, orderBy: 'teacher_name asc' })}
									leftLabel
								/>

								<DateRangeInput label="Date" startId="start_date" endId="end_date" />

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
						</Form>

						<TableTemplate
							columns={columns}
							data={tableData}
							setOrderBy={setOrderBy}
							defaultSort={defaultSort}
							handleEdit={handleEdit}
						/>
						<LastUpdatedAt lastUpdatedAt={dataUpdatedAt} refetch={refetch} />
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default Receipts;

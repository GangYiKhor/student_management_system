import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ComboBox } from '../../components/inputs/combo-box';
import { Form } from '../../components/inputs/form';
import { LastUpdatedAt } from '../../components/last-updated';
import { Loader } from '../../components/loader';
import { useFormContext } from '../../components/providers/form-providers';
import { SearchBar } from '../../components/search-bar';
import { GeneralSearch } from '../../components/searches/general-search';
import { StatusSearch } from '../../components/searches/status-search';
import {
	DefaultSort,
	TableColumnType,
	TableTemplate,
} from '../../components/tables/table-template';
import { useCustomQuery } from '../../hooks/use-custom-query';
import { useGet } from '../../hooks/use-get';
import { useGetStudentComboBoxOptionsIdOnly } from '../../hooks/use-get-student-options';
import { Layout } from '../../layouts/basic_layout';
import { VOUCHER_API_PATH } from '../../utils/constants/constants';
import {
	dateFormatter,
	getToday,
	isSameDayOrAfter,
	parseDateTime,
} from '../../utils/dateOperations';
import { BlueButtonClass } from '../../utils/tailwindClass/button';
import { GreenBoldText, RedBoldText } from '../../utils/tailwindClass/text';
import { VouchersGetDto } from '../../utils/types/dtos/vouchers/get';
import {
	VouchersGetResponse,
	VouchersGetResponses,
} from '../../utils/types/responses/vouchers/get';
import { SearchBarButtons } from '../../utils/types/search-bar-button';

const SearchFormId = 'vouchers-searchbar';
const defaultSort: DefaultSort = { field: 'start_date', asc: true };
const defaultSortString: string = `${defaultSort.field} ${defaultSort.asc ? 'asc' : 'desc'}`;

type SearchDataType = {
	general: string;
	student_id: number;
	status: boolean;
};

const getUsedStatus = (used: boolean, expired_at: Date) => {
	let text = 'Unused';
	let colour = GreenBoldText;
	if (used) {
		text = 'Used';
		colour = RedBoldText;
	}
	if (expired_at && !isSameDayOrAfter(expired_at, getToday())) {
		text = 'Expired';
		colour = RedBoldText;
	}

	return <span className={colour}>{text}</span>;
};

const columns: TableColumnType<VouchersGetResponse>[] = [
	{ title: 'ID', columnName: 'id' },
	{
		title: 'Student',
		columnName: 'student_name',
		valueParser: value => value?.student?.student_name || 'Everyone',
	},
	{
		title: 'Discount',
		columnName: 'discount',
		valueParser: value => {
			if (value.is_percentage) {
				return value?.discount?.toFixed(2) + ' %';
			} else {
				return 'RM ' + value?.discount?.toFixed(2);
			}
		},
	},
	{
		title: 'Start Date',
		columnName: 'start_date',
		valueParser: value => dateFormatter(value?.start_date),
	},
	{
		title: 'Expired At',
		columnName: 'expired_at',
		valueParser: value => dateFormatter(value?.expired_at),
	},
	{
		title: 'Status',
		columnName: 'used',
		valueParser: value => getUsedStatus(value?.used, value?.expired_at),
	},
];

const parseGetData = (data: VouchersGetResponses) =>
	data.map(value => {
		value.start_date = parseDateTime(value.start_date);
		value.expired_at = parseDateTime(value.expired_at);
		return value;
	});

function Vouchers() {
	const router = useRouter();
	const { formData, getValues } = useFormContext<SearchDataType>(SearchFormId);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);

	const getVouchers = useGet<VouchersGetDto, VouchersGetResponses>(VOUCHER_API_PATH, parseGetData);
	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<VouchersGetResponses>({
		queryKey: ['voucher-list'],
		queryFn: () => {
			const { student_id, status: is_active } = getValues();
			return getVouchers({ student_id, is_active, orderBy });
		},
		fetchOnVariable: [formData?.student_id?.value, formData?.status?.value, orderBy],
	});

	const handleEdit = (data: VouchersGetResponse) => {
		router.push(`/vouchers/${data.id}`);
	};

	const handleCreate = () => {
		router.push(`/vouchers/new`);
	};

	const buttons: SearchBarButtons = [
		{
			text: 'New Voucher',
			className: BlueButtonClass,
			onClick: () => handleCreate(),
		},
	];

	const getStudents = useGetStudentComboBoxOptionsIdOnly();
	const { data: studentOptions } = useCustomQuery<{ id: number; student_name: string }[]>({
		queryKey: ['students'],
		queryFn: () => getStudents({ orderBy: 'student_name asc' }),
	});

	const [tableData, setTableData] = useState<VouchersGetResponses>([]);
	useEffect(() => {
		let filteredData = data;
		const search = getValues()?.general?.trim().toLowerCase();
		if (search) {
			filteredData = filteredData.filter(
				value =>
					'#' + value.id.toLowerCase() === search ||
					value.student?.student_name?.toLowerCase().includes(search),
			);
		}

		setTableData(filteredData);
	}, [data, formData?.general?.value]);

	return (
		<React.Fragment>
			<Head>
				<title>Vouchers</title>
			</Head>
			<Layout headerTitle="Vouchers">
				<Loader isLoading={isLoading}>
					<div className={clsx('flex', 'flex-col', 'gap-4')}>
						<SearchBar buttons={buttons}>
							<Form formId={SearchFormId} keepData revertible>
								<GeneralSearch />

								<ComboBox
									id="student-search"
									label="Student"
									name="student_id"
									columns={['id', 'student_name']}
									options={[{ id: -1, student_name: 'Everyone' }, ...(studentOptions ?? [])]}
									labelColumn="student_name"
									valueParser={value => value?.id}
									leftLabel
								/>

								<StatusSearch />
							</Form>
						</SearchBar>

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

export default Vouchers;

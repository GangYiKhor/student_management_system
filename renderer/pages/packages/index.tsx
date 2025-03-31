import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Form } from '../../components/inputs/form';
import { NumberInput } from '../../components/inputs/number-input';
import { SelectInput } from '../../components/inputs/select-input';
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
import { useGetFormOptionsIdOnly } from '../../hooks/use-get-form-options';
import { Layout } from '../../layouts/basic_layout';
import { PACKAGE_API_PATH } from '../../utils/constants/constants';
import {
	dateFormatter,
	getToday,
	isDayAfter,
	isSameDayOrAfter,
	parseDateTime,
} from '../../utils/dateOperations';
import { BlueButtonClass } from '../../utils/tailwindClass/button';
import { GreenBoldText, RedBoldText, YellowBoldText } from '../../utils/tailwindClass/text';
import { PackagesGetDto } from '../../utils/types/dtos/packages/get';
import {
	PackagesGetResponse,
	PackagesGetResponses,
} from '../../utils/types/responses/packages/get';
import { SearchBarButtons } from '../../utils/types/search-bar-button';

const SearchFormId = 'packages-searchbar';
const defaultSort: DefaultSort = { field: 'form_name', asc: true };
const defaultSortString: string = `${defaultSort.field} ${defaultSort.asc ? 'asc' : 'desc'}`;

type SearchDataType = {
	general: string;
	form_id: number;
	subject_count: number;
	status: boolean;
};

const getActiveCssClass = (start_date: Date, end_date: Date) => {
	let textColour = '';
	const today = getToday();

	if (isDayAfter(start_date, today)) {
		textColour = YellowBoldText;
	} else if (end_date === undefined || isSameDayOrAfter(end_date, today)) {
		textColour = GreenBoldText;
	} else {
		textColour = RedBoldText;
	}

	return textColour;
};

const columns: TableColumnType<PackagesGetResponse>[] = [
	{ title: 'ID', columnName: 'id', addOnClass: 'w-[5rem]' },
	{ title: 'Form', columnName: 'form_name', valueParser: value => value.form.form_name },
	{
		title: 'Start Date',
		columnName: 'start_date',
		valueParser: value => (
			<span className={getActiveCssClass(value.start_date, value.end_date)}>
				{dateFormatter(value.start_date)}
			</span>
		),
	},
	{
		title: 'End Date',
		columnName: 'end_date',
		valueParser: value => (
			<span className={getActiveCssClass(value.start_date, value.end_date)}>
				{dateFormatter(value.end_date, { defaultValue: 'Active' })}
			</span>
		),
	},
	{
		title: 'Number of Subject',
		columnName: 'subject_count_from',
		valueParser: value =>
			value.subject_count_from +
			(value.subject_count_to === null ? '+' : ' - ' + value.subject_count_to),
	},
	{
		title: 'Discount',
		columnName: 'discount_per_subject',
		valueParser: value => 'RM ' + value.discount_per_subject.toFixed(2),
		notSortable: true,
	},
];

const parseGetData = (data: PackagesGetResponses) =>
	data.map(value => {
		value.start_date = parseDateTime(value.start_date);
		value.end_date = parseDateTime(value.end_date);
		return value;
	});

function Packages() {
	const router = useRouter();
	const { formData, getValues } = useFormContext<SearchDataType>(SearchFormId);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);

	// Fetch Data
	const getPackages = useGet<PackagesGetDto, PackagesGetResponses>(PACKAGE_API_PATH, parseGetData);
	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<PackagesGetResponses>({
		queryKey: ['package-list'],
		queryFn: () => {
			const { form_id, subject_count, status: is_active } = getValues();
			return getPackages({ form_id, subject_count, is_active, orderBy });
		},
		fetchOnVariable: [
			formData?.form_id?.value,
			formData?.subject_count?.value,
			formData?.status?.value,
			orderBy,
		],
	});

	const handleEdit = (data: PackagesGetResponse) => {
		router.push(`/packages/${data.id}`);
	};

	const handleCreate = () => {
		router.push(`/packages/new`);
	};

	const buttons: SearchBarButtons = [
		{
			text: 'New Package',
			className: BlueButtonClass,
			onClick: () => handleCreate(),
		},
	];

	// Fetch Options
	const getForms = useGetFormOptionsIdOnly();

	const [tableData, setTableData] = useState<PackagesGetResponses>([]);
	useEffect(() => {
		let filteredData = data;
		const search = getValues()?.general?.trim().toLowerCase();
		if (search) {
			filteredData = filteredData.filter(
				value =>
					'#' + value.id === search ||
					value.form?.form_name?.toLowerCase().includes(search) ||
					(parseInt(search) <= value.subject_count_to &&
						parseInt(search) >= value.subject_count_from),
			);
		}

		setTableData(filteredData);
	}, [data, formData?.general?.value]);

	return (
		<React.Fragment>
			<Head>
				<title>Packages</title>
			</Head>
			<Layout headerTitle="Packages">
				<Loader isLoading={isLoading}>
					<div className={clsx('flex', 'flex-col', 'gap-4')}>
						<SearchBar buttons={buttons}>
							<Form formId={SearchFormId} keepData revertible>
								<GeneralSearch />
								<SelectInput
									id="form_id"
									label="Form"
									placeholder="All"
									queryFn={() => getForms({ is_active: true, orderBy: 'form_name asc' })}
									leftLabel
								/>
								<NumberInput id="subject_count" label="Count" min={0} step={1} leftLabel />
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

export default Packages;

import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
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
import { Layout } from '../../layouts/basic_layout';
import { TAX_API_PATH } from '../../utils/constants/constants';
import {
	dateFormatter,
	getToday,
	isDayAfter,
	isSameDayOrAfter,
	parseDateTime,
} from '../../utils/dateOperations';
import { BlueButtonClass } from '../../utils/tailwindClass/button';
import { ContentContainer } from '../../utils/tailwindClass/containers';
import { GreenBoldText, RedBoldText, YellowBoldText } from '../../utils/tailwindClass/text';
import { TaxesGetDto } from '../../utils/types/dtos/taxes/get';
import { TaxesGetResponse, TaxesGetResponses } from '../../utils/types/responses/taxes/get';
import { SearchBarButtons } from '../../utils/types/search-bar-button';

const SearchFormId = 'taxes-searchbar';
const defaultSort: DefaultSort = { field: 'start_date', asc: true };
const defaultSortString: string = `${defaultSort.field} ${defaultSort.asc ? 'asc' : 'desc'}`;

export type SearchDataType = {
	general: string;
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

const columns: TableColumnType<TaxesGetResponse>[] = [
	{ title: 'ID', columnName: 'id', addOnClass: 'w-[5rem]', notSortable: true },
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
		notSortable: true,
	},
	{
		title: 'Percentage',
		columnName: 'percentage',
		valueParser: value => value.percentage.toFixed(2) + '%',
		notSortable: true,
	},
	{
		title: 'Inclusive',
		columnName: 'inclusive',
		valueParser: value => (value.inclusive ? 'Yes' : 'No'),
		notSortable: true,
	},
];

const parseGetData = (data: TaxesGetResponses) =>
	data.map(value => {
		value.start_date = parseDateTime(value.start_date);
		value.end_date = parseDateTime(value.end_date);
		return value;
	});

function Taxes() {
	const router = useRouter();
	const { formData, getValues } = useFormContext<SearchDataType>(SearchFormId);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);

	// Fetch Data
	const getTaxes = useGet<TaxesGetDto, TaxesGetResponses>(TAX_API_PATH, parseGetData);
	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<TaxesGetResponses>({
		queryKey: ['tax-list'],
		queryFn: () => {
			const { status: is_active } = getValues();
			return getTaxes({ is_active, orderBy });
		},
		fetchOnVariable: [formData?.status?.value, orderBy],
	});

	const handleEdit = (data: TaxesGetResponse) => {
		router.push(`/taxes/${data.id}`);
	};

	const handleCreate = () => {
		router.push(`/taxes/new`);
	};

	const buttons: SearchBarButtons = [
		{
			text: 'New Tax',
			className: BlueButtonClass,
			onClick: () => handleCreate(),
		},
	];

	const [tableData, setTableData] = useState<TaxesGetResponses>([]);
	useEffect(() => {
		let filteredData = data;
		const search = formData?.general?.value?.trim().toLowerCase();
		if (search) {
			filteredData = filteredData.filter(value => '#' + value.id === search);
		}

		setTableData(filteredData);
	}, [data, formData?.general?.value]);

	return (
		<React.Fragment>
			<Head>
				<title>Taxes</title>
			</Head>
			<Layout headerTitle="Taxes">
				<Loader isLoading={isLoading}>
					<div className={ContentContainer}>
						<Form formId={SearchFormId} keepData revertible>
							<SearchBar buttons={buttons}>
								<GeneralSearch />
								<StatusSearch />
							</SearchBar>
						</Form>

						<TableTemplate
							columns={columns}
							data={tableData}
							handleEdit={handleEdit}
							defaultSort={defaultSort}
							setOrderBy={setOrderBy}
						/>
						<LastUpdatedAt lastUpdatedAt={dataUpdatedAt} refetch={refetch} />
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default Taxes;

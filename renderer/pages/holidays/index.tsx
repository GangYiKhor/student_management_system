import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { DateInput } from '../../components/inputs/date-input';
import { Form } from '../../components/inputs/form';
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
import { useGet } from '../../hooks/use-get';
import { Layout } from '../../layouts/basic_layout';
import { HOLIDAY_API_PATH } from '../../utils/constants/constants';
import {
	dateFormatter,
	dateOperator,
	getToday,
	parseDateTime,
	removeTimezoneOffset,
} from '../../utils/dateOperations';
import { tryParseInt } from '../../utils/numberParsers';
import { BlueButtonClass } from '../../utils/tailwindClass/button';
import { ContentContainer } from '../../utils/tailwindClass/containers';
import { HolidaysGetDto } from '../../utils/types/dtos/holidays/get';
import {
	HolidaysGetResponse,
	HolidaysGetResponses,
} from '../../utils/types/responses/holidays/get';
import { SearchBarButtons } from '../../utils/types/search-bar-button';

const SearchFormId = 'holidays-searchbar';
const defaultSort: DefaultSort = { field: 'date', asc: true };
const defaultSortString = `${defaultSort.field} ${defaultSort.asc ? 'asc' : 'desc'}`;

const periodOptions = [
	{ value: 'last-month', label: 'Last Month' },
	{ value: 'this-month', label: 'This Month' },
	{ value: 'next-month', label: 'Next Month' },
	{ value: 'this-year', label: 'This Year' },
	{ value: 'next-year', label: 'Next Year' },
	{ value: '-7', label: 'Last 7 Days' },
	{ value: '-30', label: 'Last 30 Days' },
	{ value: '-90', label: 'Last 90 Days' },
	{ value: '7', label: 'Next 7 Days' },
	{ value: '30', label: 'Next 30 Days' },
	{ value: '90', label: 'Next 90 Days' },
];

type SearchDataType = {
	general: string;
	start_date: Date;
	end_date: Date;
	period: string;
};

const columns: TableColumnType<HolidaysGetResponse>[] = [
	{ title: 'ID', columnName: 'id', addOnClass: 'w-[5rem]', notSortable: true },
	{
		title: 'Date',
		columnName: 'date',
		valueParser: value => dateFormatter(value.date),
	},
	{ title: 'Description', columnName: 'description', notSortable: true },
];

const parseGetData = (data: HolidaysGetResponses) =>
	data.map(value => {
		value.date = parseDateTime(value.date);
		return value;
	});

function Holidays() {
	const router = useRouter();
	const { formData, getValues, updateFieldValue } = useFormContext<SearchDataType>(SearchFormId);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);

	// Fetch Data
	const getHolidays = useGet<HolidaysGetDto, HolidaysGetResponses>(HOLIDAY_API_PATH, parseGetData);
	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<HolidaysGetResponses>({
		queryKey: ['holiday-list'],
		queryFn: () => {
			const { start_date, end_date } = getValues();
			return getHolidays({ start_date, end_date, orderBy });
		},
		fetchOnVariable: [formData?.start_date?.value, formData?.end_date?.value, orderBy],
	});

	const handleEdit = (data: HolidaysGetResponse) => {
		router.push(`/holidays/${data.id}`);
	};

	const handleCreate = () => {
		router.push(`/holidays/new`);
	};

	const buttons: SearchBarButtons = [
		{
			text: 'New Holiday',
			className: BlueButtonClass,
			onClick: () => handleCreate(),
		},
	];

	// Period Operations
	useEffect(() => {
		const firstDate = getToday();
		const secondDate = getToday();
		const period = getValues()?.period;

		switch (period) {
			case '':
				updateFieldValue([
					{ field: 'start_date', value: null },
					{ field: 'end_date', value: null },
				]);
				return;

			case undefined:
			case null:
				return;

			case 'last-month':
				firstDate.setDate(0);
				firstDate.setDate(1);
				secondDate.setDate(0);
				break;

			case 'this-month':
				firstDate.setDate(1);
				secondDate.setDate(35);
				secondDate.setDate(0);
				break;

			case 'next-month':
				firstDate.setDate(35);
				firstDate.setDate(1);
				secondDate.setDate(70);
				secondDate.setDate(0);
				break;

			case 'this-year':
				firstDate.setMonth(0, 1);
				secondDate.setMonth(11, 31);
				break;

			case 'next-year':
				firstDate.setFullYear(firstDate.getFullYear() + 1, 0, 1);
				secondDate.setFullYear(secondDate.getFullYear() + 1, 11, 31);
				break;

			default:
				if (tryParseInt(period) > 0) {
					secondDate.setDate(secondDate.getDate() + tryParseInt(period));
				} else {
					firstDate.setDate(firstDate.getDate() + tryParseInt(period));
				}
		}

		updateFieldValue([
			{ field: 'start_date', value: removeTimezoneOffset(firstDate) },
			{ field: 'end_date', value: removeTimezoneOffset(secondDate) },
		]);
	}, [formData?.period?.value]);

	const [tableData, setTableData] = useState<HolidaysGetResponses>([]);
	useEffect(() => {
		let filteredData = data;
		const search = getValues()?.general?.trim().toLowerCase();
		if (search) {
			filteredData = filteredData.filter(
				value => '#' + value.id === search || value.description?.toLowerCase().includes(search),
			);
		}

		setTableData(filteredData);
	}, [data, formData?.general?.value]);

	return (
		<React.Fragment>
			<Head>
				<title>Holidays</title>
			</Head>
			<Layout headerTitle="Holidays">
				<Loader isLoading={isLoading}>
					<div className={ContentContainer}>
						<SearchBar buttons={buttons}>
							<Form formId={SearchFormId} keepData revertible>
								<GeneralSearch />

								<DateInput
									id="start_date"
									label="From"
									name="From Date"
									defaultValue={removeTimezoneOffset(getToday())}
									leftLabel
								/>

								<DateInput
									id="end_date"
									label="To"
									name="To Date"
									defaultValue={removeTimezoneOffset(dateOperator(getToday(), 30, 'd'))}
									min={formData?.start_date?.value}
									leftLabel
								/>

								<SelectInput
									id="period"
									label="Period"
									defaultValue="30"
									placeholder="All"
									placeholderValue=""
									options={periodOptions}
									leftLabel
								/>
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

export default Holidays;

import { QueryObserverResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { FormProvider } from '../../../components/providers/form-providers';
import { TableColumnType, TableTemplate } from '../../../components/tables/table-template';
import { usePost } from '../../../hooks/use-post';
import {
	dateFormatter,
	getToday,
	isSameDayOrAfter,
	isSameDayOrBefore,
} from '../../../utils/dateOperations';
import { GreenBoldText, RedBoldText, YellowBoldText } from '../../../utils/tailwindClass/text';
import { TaxUpdateDto } from '../../../utils/types/dtos/taxes/update';
import { ErrorResponse } from '../../../utils/types/responses/error';
import { TaxesGetResponse, TaxesGetResponses } from '../../../utils/types/responses/taxes/get';
import { BackendPath, defaultSort, formDefaultValueFilled } from '../constants';
import { EditData } from '../types';
import { TaxesModal } from './taxes-modal';

const getActiveCssClass = (start_date: Date, end_date: Date) => {
	let textColour = '';
	const today = getToday();

	if (!isSameDayOrBefore(start_date, today)) {
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

type PropType = {
	data: TaxesGetResponses;
	search?: string;
	refetch: () => Promise<QueryObserverResult<TaxesGetResponses, AxiosError<ErrorResponse, any>>>;
	setOrderBy: (value: string) => void;
};

export function HolidaysTable({ data, search, refetch, setOrderBy }: Readonly<PropType>) {
	const [tableData, setTableData] = useState<TaxesGetResponses>([]);
	const [selected, setSelected] = useState<EditData>(undefined);
	const postTax = usePost<TaxUpdateDto, void>(BackendPath);

	const handleEdit = (data: EditData) => {
		setSelected(data);
	};

	const handleUpdate = async (data: TaxUpdateDto) => {
		await postTax(data, selected.id);
		await refetch();
	};

	useEffect(() => {
		let filteredData = data;
		if (search) {
			search = search.trim().toLowerCase();
			filteredData = filteredData.filter(value => '#' + value.id === search);
		}

		setTableData(filteredData);
	}, [data, search]);

	return (
		<React.Fragment>
			<TableTemplate
				columns={columns}
				data={tableData}
				handleEdit={handleEdit}
				defaultSort={defaultSort}
				setOrderBy={setOrderBy}
			/>

			{selected ? (
				<FormProvider defaultValue={formDefaultValueFilled(selected)}>
					<TaxesModal
						closeModal={() => setSelected(undefined)}
						handler={handleUpdate}
						data={selected}
					/>
				</FormProvider>
			) : null}
		</React.Fragment>
	);
}

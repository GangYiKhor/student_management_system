import { QueryObserverResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useFormContextWithId } from '../../../components/providers/form-providers';
import { TableColumnType, TableTemplate } from '../../../components/tables/table-template';
import { usePost } from '../../../hooks/use-post';
import {
	dateFormatter,
	getToday,
	isSameDayOrAfter,
	isSameDayOrBefore,
} from '../../../utils/dateOperations';
import { GreenBoldText, RedBoldText, YellowBoldText } from '../../../utils/tailwindClass/text';
import { PackageUpdateDto } from '../../../utils/types/dtos/packages/update';
import { ErrorResponse } from '../../../utils/types/responses/error';
import {
	PackagesGetResponse,
	PackagesGetResponses,
} from '../../../utils/types/responses/packages/get';
import { BackendPath, defaultSort, SearchFormId } from '../constants';
import { EditData, SearchDataType } from '../types';
import { PackagesModal } from './packages-modal';

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

type PropType = {
	data: PackagesGetResponses;
	refetch: () => Promise<QueryObserverResult<PackagesGetResponses, AxiosError<ErrorResponse, any>>>;
	setOrderBy: (value: string) => void;
};

export function PackagesTable({ data, refetch, setOrderBy }: Readonly<PropType>) {
	const { formData } = useFormContextWithId<SearchDataType>(SearchFormId);
	const [tableData, setTableData] = useState<PackagesGetResponses>([]);
	const [selected, setSelected] = useState<EditData>(undefined);
	const postPackage = usePost<PackageUpdateDto, void>(BackendPath);

	const handleEdit = (data: EditData) => {
		setSelected(data);
	};

	const handleUpdate = async (data: PackageUpdateDto) => {
		await postPackage(data, selected.id);
		await refetch();
	};

	useEffect(() => {
		let filteredData = data;
		const search = formData?.general?.value?.trim().toLowerCase();
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
			<TableTemplate
				columns={columns}
				data={tableData}
				setOrderBy={setOrderBy}
				defaultSort={defaultSort}
				handleEdit={handleEdit}
			/>

			{selected ? (
				<PackagesModal
					closeModal={() => setSelected(undefined)}
					handler={handleUpdate}
					data={selected}
				/>
			) : null}
		</React.Fragment>
	);
}

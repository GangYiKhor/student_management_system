import { QueryObserverResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { FormProvider } from '../../../components/providers/form-providers';
import { TableColumnType, TableTemplate } from '../../../components/tables/table-template';
import { usePost } from '../../../hooks/use-post';
import { dateFormatter } from '../../../utils/dateOperations';
import { GreenBoldText, RedBoldText } from '../../../utils/tailwindClass/text';
import { VoucherUpdateDto } from '../../../utils/types/dtos/vouchers/update';
import { ErrorResponse } from '../../../utils/types/responses/error';
import {
	VouchersGetResponse,
	VouchersGetResponses,
} from '../../../utils/types/responses/vouchers/get';
import { BackendPath, defaultSort, formDefaultValueFilled } from '../constants';
import { EditData } from '../types';
import { VouchersModal } from './vouchers-modal';

const columns: TableColumnType<VouchersGetResponse>[] = [
	{ title: 'ID', columnName: 'id' },
	{
		title: 'Student',
		columnName: 'student_name',
		valueParser: value => value?.student?.student_name || 'Everyone',
	},
	{
		title: 'discount',
		columnName: 'discount',
		valueParser: value => {
			if (value.is_percentage) {
				return value?.discount.toFixed(2) + ' %';
			} else {
				return 'RM ' + value?.discount.toFixed(2);
			}
		},
	},
	{
		title: 'start_date',
		columnName: 'start_date',
		valueParser: value => dateFormatter(value?.start_date),
	},
	{
		title: 'expired_at',
		columnName: 'expired_at',
		valueParser: value => dateFormatter(value?.expired_at),
	},
	{
		title: 'used',
		columnName: 'used',
		valueParser: value => (
			<span className={value.used ? RedBoldText : GreenBoldText}>
				{value.used ? 'Used' : 'Unused'}
			</span>
		),
	},
];

type PropType = {
	data: VouchersGetResponses;
	search?: string;
	refetch: () => Promise<QueryObserverResult<VouchersGetResponses, AxiosError<ErrorResponse, any>>>;
	setOrderBy: (value: string) => void;
};

export function VoucherTable({ data, search, refetch, setOrderBy }: Readonly<PropType>) {
	const [tableData, setTableData] = useState<VouchersGetResponses>([]);
	const [selected, setSelected] = useState<EditData>(undefined);
	const postVoucher = usePost<VoucherUpdateDto, void>(BackendPath);

	const handleEdit = (data: EditData) => {
		setSelected(data);
	};

	const handleUpdate = async (data: VoucherUpdateDto) => {
		await postVoucher(data, selected.id);
		await refetch();
	};

	useEffect(() => {
		let filteredData = data;
		if (search) {
			search = search.trim().toLowerCase();
			filteredData = filteredData.filter(
				value =>
					'#' + value.id.toLowerCase() === search ||
					value.student.student_name?.toLowerCase().includes(search),
			);
		}

		setTableData(filteredData);
	}, [data, search]);

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
				<FormProvider defaultValue={formDefaultValueFilled(selected)}>
					<VouchersModal
						closeModal={() => setSelected(undefined)}
						handler={handleUpdate}
						data={selected}
					/>
				</FormProvider>
			) : null}
		</React.Fragment>
	);
}

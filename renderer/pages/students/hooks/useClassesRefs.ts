import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useGet } from '../../../hooks/use-get';
import { useSelectRef } from '../../../hooks/use-select-ref';
import { ErrorResponse } from '../../../utils/types/responses/error';
import { StudentClassesGetResponses } from '../../../utils/types/responses/student-classes/get';

type PropType = {
	studentId?: number;
};

export function useStudentClassesRefs({ studentId }: Readonly<PropType>) {
	const [ref1, valid1] = useSelectRef();
	const [ref2, valid2] = useSelectRef();
	const [ref3, valid3] = useSelectRef();
	const [ref4, valid4] = useSelectRef();
	const [ref5, valid5] = useSelectRef();
	const [ref6, valid6] = useSelectRef();
	const [ref7, valid7] = useSelectRef();
	const [ref8, valid8] = useSelectRef();
	const [ref9, valid9] = useSelectRef();
	const [ref10, valid10] = useSelectRef();

	const refs = [ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, ref10];
	const valids = [valid1, valid2, valid3, valid4, valid5, valid6, valid7, valid8, valid9, valid10];

	const getClasses = useGet<null, StudentClassesGetResponses>(`/api/student-classes/${studentId}`);
	const { data } = useQuery<StudentClassesGetResponses, AxiosError<ErrorResponse>>({
		queryKey: ['studentClasses'],
		queryFn: () => getClasses(),
		enabled: true,
	});

	useEffect(() => {
		if (data) {
			data.map((value, index) => {
				refs[index].current.value = value?.class?.id.toString() ?? '';
			});
		}
	}, [data]);

	return { refs, valids, data };
}

export type SubjectsGetResponse = {
	id: number;
	form: {
		id: number;
		form_name: string;
	};
	subject_name: string;
	is_active: boolean;
}[];

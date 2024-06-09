export type TaxCreateDto = {
	percentage: number;
	start_date: Date;
	end_date?: Date;
	inclusive: boolean;
};

export type TaxesGetResponse = {
	id: number;
	percentage: number;
	start_date: Date;
	end_date: Date;
	inclusive: boolean;
};

export type TaxesGetResponses = TaxesGetResponse[];

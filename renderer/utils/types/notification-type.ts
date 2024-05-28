export type GeneralNotification = {
	id: string;
	title: string;
	message: string;
	occurredAt: Date;
	source?: string;
	type: 'INFO' | 'WARN' | 'ERROR';
};

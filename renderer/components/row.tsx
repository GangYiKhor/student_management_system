import clsx from 'clsx';
import { ReactNode } from 'react';

type PropType = {
	children: ReactNode;
};

export default function Row({ children }: Readonly<PropType>) {
	return <div className={clsx('flex', 'gap-x-5', 'flex-wrap')}>{children}</div>;
}

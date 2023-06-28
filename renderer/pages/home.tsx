import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useGet } from '../hooks/use-get';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '../layouts/basic_layout';

function Home() {
	const getHelloWorld = useGet('/api/hello-world');
	const { data, isLoading, isSuccess, isError, dataUpdatedAt } = useQuery({
		queryKey: ['hello_world'],
		queryFn: getHelloWorld,
		enabled: true,
	});
	const [getData, setGetData] = useState('');
	useEffect(() => {
		if (data) {
			setGetData(data as string);
		}
	}, [data]);

	return (
		<React.Fragment>
			<Head>
				<title>Home - Nextron (with-typescript-tailwindcss)</title>
			</Head>
			<Layout headerTitle={'Hello World'}>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
				<h1>Hello World</h1>
			</Layout>
		</React.Fragment>
	);
}

export default Home;

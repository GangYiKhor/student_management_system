import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useGet } from "../hooks/use-get";
import { useQuery } from "@tanstack/react-query";
import { Header } from "../components/header";

function Home() {
	const getHelloWorld = useGet("/api/hello-world");
	const { data, isLoading, isSuccess, isError, dataUpdatedAt } = useQuery({
		queryKey: ["hello_world"],
		queryFn: getHelloWorld,
		enabled: true,
	});
	const [getData, setGetData] = useState("");
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
			<Header />
			<div className="grid grid-col-1 text-2xl w-full text-center">
				<img className="ml-auto mr-auto" src="/images/logo.png" />
				<span>⚡ Electron ⚡</span>
				<span>+</span>
				<span>Next.js</span>
				<span>{getData}</span>
				<span>+</span>
				<span>tailwindcss</span>
				<span>=</span>
				<span>💕 </span>
			</div>
			<div className="mt-1 w-full flex-wrap flex justify-center">
				<Link href="/next">
					<a className="btn-blue">Go to next page</a>
				</Link>
			</div>
		</React.Fragment>
	);
}

export default Home;

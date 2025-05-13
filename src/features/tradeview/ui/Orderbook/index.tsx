import { useCallback, useEffect, useState } from 'react';
import OrderbookChart from './chart';

const INITIAL_DATA = [
	{
		offerPrice: '10000',
		quantity: 10,
	},
	{
		offerPrice: '10001',
		quantity: 20,
	},
	{
		offerPrice: '10002',
		quantity: 30,
	},
	{
		offerPrice: '10003',
		quantity: 40,
	},
	{
		offerPrice: '10004',
		quantity: 50,
	},
	{
		offerPrice: '10005',
		quantity: 60,
	},
	{
		offerPrice: '10006',
		quantity: 70,
	},
	{
		offerPrice: '10007',
		quantity: 80,
	},
	{
		offerPrice: '10008',
		quantity: 90,
	},
	{
		offerPrice: '10009',
		quantity: 100,
	},
];

function useMockData() {
	const [data, setData] = useState(INITIAL_DATA);

	const updateRandomData = useCallback(() => {
		setData((prevData) =>
			prevData.map((item) => ({
				...item,
				quantity: Math.random() * 100,
			})),
		);
	}, []);

	useEffect(() => {
		const intervalId = setInterval(() => {
			updateRandomData();
		}, 1000);

		return () => clearInterval(intervalId);
	}, [updateRandomData]);

	return data;
}

export default function Orderbook() {
	const bearData = useMockData();
	const bullData = useMockData();

	return (
		<div className="h-full w-full overflow-y-scroll">
			<OrderbookChart data={bearData} type="bear" />
			<OrderbookChart data={bullData} />
		</div>
	);
}

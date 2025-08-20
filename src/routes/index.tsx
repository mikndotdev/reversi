import { hc } from 'hono/client'
import { type AppType } from '@/worker/index.ts';

import useSWR from 'swr';

function Index() {
    const client = hc<AppType>(window.location.href);

    const playerCountFetcher = async () => {
        // @ts-ignore
        const res = await client.api.count.$get();
        return await res.json()
    }

    const { data, isLoading } = useSWR('stats/count', playerCountFetcher)

    return (
        <>
            <h1>Vite + React</h1>
            <div className="card">
                {isLoading ? <p>Loading...</p> : <p>count is {data.count}</p>}

                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    );
}

export default Index;

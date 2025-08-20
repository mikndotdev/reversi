import { hc } from 'hono/client';
import { NavLink } from 'react-router';
import useSWR from 'swr';
import type { AppType } from '@/worker/index.ts';

function Index() {
  const client = hc<AppType>(window.location.origin);

  const playerCountFetcher = async () => {
    // @ts-expect-error
    const res = await client.api.count.$get();
    return await res.json();
  };

  const { data, isLoading } = useSWR(
    window.location.origin,
    playerCountFetcher
  );

  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className={'font-bold text-6xl'}>Reversi</h1>
          <div className={'mt-2'}>
            {isLoading ? (
              <span className="loading loading-dots loading-lg" />
            ) : (
              <p>{data.count} players online</p>
            )}
          </div>
          <div
            className={
              'mt-5 flex flex-row items-center justify-center space-x-2'
            }
          >
            <NavLink className="btn btn-primary btn-md" to="/create">
              Create Game
            </NavLink>
            <NavLink className="btn btn-secondary btn-md" to="/join">
              Join Game
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;

import { hc } from 'hono/client';
import { useEffect, useState } from 'react';
import Turnstile from 'react-turnstile';
import useSWR from 'swr';
import type { AppType } from '@/worker/index.ts';

function Create() {
  const client = hc<AppType>(window.location.origin);

  const userInfoFetcher = async () => {
    // @ts-expect-error
    const res = await client.api.userinfo.$get();
    return await res.json();
  };

  const { data, isLoading, error } = useSWR(
    window.location.origin,
    userInfoFetcher
  );

  const [name, setName] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [side, setSide] = useState<'black' | 'white'>('black');

  useEffect(() => {
    if (data) setName(data.name);
  }, [data, error]);

  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className={'font-bold text-6xl'}>Create a game</h1>
          <div
            className={
              'card mt-5 flex flex-row items-center justify-center space-x-2 bg-base-100'
            }
          >
            <div className="card-body">
              <div className="flex flex-col items-center justify-center space-y-2">
                <span className="font-bold text-lg">Username</span>
                <input
                  className="input input-bordered input-primary w-full max-w-xs"
                  disabled={isLoading}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter a username"
                  type="text"
                  value={name}
                />
                <span className="font-bold text-lg">Pick a side</span>
                <div className="flex flex-row items-center justify-center space-x-2">
                  <button
                    className={'btn btn-secondary btn-xl'}
                    disabled={side === 'black'}
                    onClick={() => setSide('black')}
                  >
                    ⚫
                  </button>
                  <button
                    className={'btn btn-secondary btn-xl'}
                    disabled={side === 'white'}
                    onClick={() => setSide('white')}
                  >
                    ⚪
                  </button>
                </div>
                <Turnstile
                  onVerify={(token) => {
                    setToken(token);
                  }}
                  sitekey={import.meta.env.VITE_TURNSTILE_SITEKEY}
                />
                <button
                  className="btn btn-primary btn-lg"
                  disabled={isLoading || !name || !token}
                >
                  Start Game
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Create;

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Turnstile } from "next-turnstile";
import { Color } from "@/generated/prisma";
import { createGame } from "@/app/actions/join";

export function CreateGame() {
  const [name, setName] = useState("");
  const [color, setColor] = useState<Color>("BLACK");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const create = async () => {
    setLoading(true);
    await createGame(name, color, token!);
  };

  return (
    <div className={"card w-1/3 bg-base-300 shadow-xl flex flex-col gap-3"}>
      <div className={"card-body"}>
        <h2 className={"card-title text-xl font-bold"}>Create Game</h2>
        <input
          type="text"
          placeholder="Userame"
          className="input input-bordered w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <h2 className={"text-lg font-bold"}>Pick a side</h2>
        <div className="btn-group">
          <button
            className={`btn btn-primary`}
            onClick={() => setColor("BLACK")}
            disabled={color === "BLACK"}
          >
            Black
          </button>
          <button
            className={`btn btn-primary`}
            disabled={color === "WHITE"}
            onClick={() => setColor("WHITE")}
          >
            White
          </button>
        </div>
        <Turnstile
          className={"py-3"}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY!}
          onVerify={(token) => {
            setToken(token);
          }}
          theme={"auto"}
        />
        <div className="card-actions w-full">
          <button
            className="btn btn-primary w-full"
            disabled={!name || !token || loading}
            onClick={create}
          >
            {loading && <span className="loading loading-spinner" />}
            Create Game
          </button>
        </div>
      </div>
    </div>
  );
}

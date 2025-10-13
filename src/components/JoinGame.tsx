"use client";
import { Game } from "@/generated/prisma";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useRealtime } from "@upstash/realtime/client";
import { RealtimeEvents } from "@/lib/realtime";
import { requestJoin, registerP2 } from "@/app/actions/join";
import { Howl } from "howler";
import { useRouter } from "next/navigation";

interface Props {
  game: Game;
}

export function JoinGame({ game }: Props) {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const nameRef = useRef(name);
  const start = new Howl({ src: ["/sounds/start.mp3"] });
  const router = useRouter();

  useEffect(() => {
    nameRef.current = name;
  }, [name]);

  useRealtime<RealtimeEvents>({
    channel: game.id,
    events: {
      reject: {
        name: (data) => {
          setLoading(false);
          toast.error(`Host rejected your request.`);
        },
      },
      start: {
        player2Name: (data) => {
          if (data !== nameRef.current) {
            toast.error("Game started with a different player.");
            return router.push("/");
          }
          start.play();
          registerP2(game.id, data);
        },
      },
    },
  });

  const sendJoinRequest = async () => {
    setLoading(true);
    requestJoin(game.id, name);
  };

  return (
    <div className={"card w-1/2 bg-base-300 shadow-xl flex flex-col gap-3"}>
      <div className={"card-body"}>
        <p className={"text-center text-2xl font-bold mb-2"}>Hosted by</p>
        <div
          className={
            "card w-1/2 bg-base-100 shadow-xl flex flex-col gap-3 w-full mb-5"
          }
        >
          <div className={"card-body"}>
            <div className={"flex justify-center"}>
              {/* @ts-ignore */}
              <span className={"text-xl font-bold"}>{game.player1.name}</span>
            </div>
          </div>
        </div>
        <h2 className={"card-title text-xl font-bold"}>Input a name</h2>
        <input
          type="text"
          placeholder="Userame"
          className="input input-bordered w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="card-actions w-full mt-5">
          <button
            className="btn btn-primary w-full"
            disabled={!name || loading}
            onClick={sendJoinRequest}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner" />
                Waiting for host to start the game...
              </>
            ) : (
              <>Send join request</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

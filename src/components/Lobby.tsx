"use client";
import { useRealtime } from "@upstash/realtime/client";
import { Howl } from "howler";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
import { toast } from "sonner";
import { rejectJoin, startGame } from "@/app/actions/join";
import type { Game } from "@/generated/prisma";
import type { RealtimeEvents } from "@/lib/realtime";

interface Props {
  game: Game;
  name: string;
  opponent?: string;
}

export function Lobby({ game, name, opponent }: Props) {
  const [player1] = useState<string>(name);
  const [player2, setPlayer2] = useState<string | null>(opponent || null);
  const [starting, setStarting] = useState(false);
  const ding = new Howl({ src: ["/sounds/ding.mp3"] });
  const router = useRouter();

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Invite link copied to clipboard!");
  };

  const rejectJoinRequest = async () => {
    if (player2) {
      await rejectJoin(game.id, player2);
      setPlayer2(null);
      toast.success("Join request rejected.");
    }
  };

  const start = async () => {
    setStarting(true);
    await startGame(game.id, player2!);
  };

  useRealtime<RealtimeEvents>({
    channel: game.id,
    events: {
      join: {
        name: (data) => {
          setPlayer2(data);
          ding.play();
        },
      },
      p2Ready: {
        name: (data) => {
          router.push(`/play/${game.id}`);
        },
      },
    },
  });

  return (
    <div className={"card w-1/2 bg-base-300 shadow-xl flex flex-col gap-3"}>
      <div className={"card-body"}>
        <div className={"flex flex-col gap-2"}>
          <div
            className={
              "card w-1/2 bg-base-100 shadow-xl flex flex-col gap-3 w-full"
            }
          >
            <div className={"card-body"}>
              <div className={"flex justify-center"}>
                <span className={"text-xl font-bold"}>{player1}</span>
              </div>
            </div>
          </div>
          <p className={"text-center text-2xl font-bold"}>VS</p>
          <div
            className={
              "card w-1/2 bg-base-100 shadow-xl flex flex-col gap-3 w-full"
            }
          >
            <div className={"card-body"}>
              <div className={"flex justify-center"}>
                {player2 ? (
                  <span className={"text-xl font-bold"}>{player2}</span>
                ) : (
                  <>
                    <span className={"loading loading-dots mr-3"} />
                    <span className={"text-xl font-bold italic"}>
                      Waiting for opponent...
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="card-actions w-full mt-5">
          <div className="collapse bg-base-100 border border-base-300">
            <input type="checkbox" />
            <div className="collapse-title font-semibold">
              Show join instructions
            </div>
            <div className="collapse-content">
              <div className={"flex flex-row justify-between w-full"}>
                <div className={"flex flex-col"}>
                  <p className={"text-md"}>Go to</p>
                  <p className={"text-3xl font-bold"}>
                    {process.env.NEXT_PUBLIC_BASE_URL}/join
                  </p>
                </div>
                <div className={"flex flex-col text-right"}>
                  <p className={"text-md"}>Enter code:</p>
                  <span className={"text-6xl font-bold ml-3"}>
                    {game.inviteId}
                  </span>
                </div>
              </div>
              <div className={"flex justify-center mt-5"}>
                <QRCodeCanvas
                  value={`${process.env.NEXT_PUBLIC_BASE_URL}/join/${game.inviteId}`}
                  size={150}
                  marginSize={2}
                  level={"H"}
                />
              </div>
            </div>
          </div>
          <div className={"w-full flex flex-row space-x-3"}>
            <input
              value={`${process.env.NEXT_PUBLIC_BASE_URL}/join/${game.inviteId}`}
              readOnly
              className="input input-bordered w-full pr-16"
            />
            <button
              className="btn btn-success join-item"
              onClick={() =>
                copyToClipboard(
                  `${process.env.NEXT_PUBLIC_BASE_URL}/join/${game.inviteId}`,
                )
              }
            >
              Copy Invite Link
            </button>
          </div>
          <button
            className="btn btn-primary w-full"
            disabled={!player2 || starting}
            onClick={() => start()}
          >
            {starting ? (
              <>
                <span className="loading loading-spinner" />
                Starting game...
              </>
            ) : (
              <>Start Game</>
            )}
          </button>
          {player2 && (
            <button
              className="btn btn-error w-full"
              disabled={!player2}
              onClick={rejectJoinRequest}
            >
              Reject join request
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

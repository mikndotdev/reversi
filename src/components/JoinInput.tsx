"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { verifyCode } from "@/app/actions/join";

export function JoinInput() {
  const [c1, setC1] = useState("");
  const [c2, setC2] = useState("");
  const [c3, setC3] = useState("");
  const [c4, setC4] = useState("");
  const [c5, setC5] = useState("");
  const [c6, setC6] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const handleChange = (
    index: number,
    value: string,
    setter: (val: string) => void,
  ) => {
    const upperValue = value.toUpperCase();
    setter(upperValue);
    if (upperValue.length === 1 && index < 5) {
      inputsRef.current[index + 1]?.focus();
    } else if (upperValue.length === 0 && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    setCode(c1 + c2 + c3 + c4 + c5 + c6);
  }, [c1, c2, c3, c4, c5, c6]);

  const join = async () => {
    setLoading(true);
    try {
      await verifyCode(code);
      router.push(`/join/${code}`);
    } catch (e) {
      toast.error("Game not found.");
    }
    setLoading(false);
  };

  return (
    <div className={"card w-1/3 bg-base-300 shadow-xl flex flex-col gap-3"}>
      <div className={"card-body"}>
        <div className="flex space-x-2 justify-center">
          <input
            ref={(el) => {
              inputsRef.current[0] = el;
            }}
            type="text"
            maxLength={1}
            className="input input-bordered w-12 text-center"
            value={c1}
            onChange={(e) => handleChange(0, e.target.value, setC1)}
          />
          <input
            ref={(el) => {
              inputsRef.current[1] = el;
            }}
            type="text"
            maxLength={1}
            className="input input-bordered w-12 text-center"
            value={c2}
            onChange={(e) => handleChange(1, e.target.value, setC2)}
          />
          <input
            ref={(el) => {
              inputsRef.current[2] = el;
            }}
            type="text"
            maxLength={1}
            className="input input-bordered w-12 text-center"
            value={c3}
            onChange={(e) => handleChange(2, e.target.value, setC3)}
          />
          <input
            ref={(el) => {
              inputsRef.current[3] = el;
            }}
            type="text"
            maxLength={1}
            className="input input-bordered w-12 text-center"
            value={c4}
            onChange={(e) => handleChange(3, e.target.value, setC4)}
          />
          <input
            ref={(el) => {
              inputsRef.current[4] = el;
            }}
            type="text"
            maxLength={1}
            className="input input-bordered w-12 text-center"
            value={c5}
            onChange={(e) => handleChange(4, e.target.value, setC5)}
          />
          <input
            ref={(el) => {
              inputsRef.current[5] = el;
            }}
            type="text"
            maxLength={1}
            className="input input-bordered w-12 text-center"
            value={c6}
            onChange={(e) => handleChange(5, e.target.value, setC6)}
          />
        </div>
        <div className="card-actions w-full mt-5">
          <button
            className="btn btn-primary w-full"
            disabled={code.length < 6 || loading}
            onClick={join}
          >
            {loading && <span className="loading loading-spinner" />}
            Join Game
          </button>
        </div>
      </div>
    </div>
  );
}

import { JoinInput } from "@/components/JoinInput";

export default function JoinPage() {
  return (
    <div className={"flex flex-col items-center justify-center min-h-screen"}>
      <h1 className={"text-4xl font-bold mb-5"}>Enter join code</h1>
      <JoinInput />
    </div>
  );
}

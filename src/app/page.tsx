import { CreateGame } from "@/components/CreateGame";

export default function Page() {
  return (
    <div className={"flex flex-col items-center justify-center min-h-screen"}>
      <h1 className={"text-4xl font-bold mb-5"}>Reversi</h1>
      <CreateGame />
    </div>
  );
}

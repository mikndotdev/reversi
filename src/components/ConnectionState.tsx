import { FaWifi } from "react-icons/fa";

interface Props {
  status: "connected" | "disconnected" | "error" | "connecting";
}

export function ConnectionState({ status }: Props) {
  if (status === "connected") {
    return (
      <div className={"badge badge-lg badge-success"}>
        <FaWifi className={"inline mr-2"} />
        Connected
      </div>
    );
  }
  if (status === "connecting") {
    return (
      <div className={"badge badge-lg badge-warning"}>
        <span className={"loading loading-spinner loading-sm inline mr-2"} />
        Connecting
      </div>
    );
  }
  return (
    <dialog className="modal" open>
      <div className="modal-box">
        <div className={"flex flex-col justify-center items-center"}>
          <h3 className="font-bold text-xl">Disconnected from server</h3>
          <button
            className="btn btn-primary mt-4"
            onClick={() => location.reload()}
          >
            Reload Page
          </button>
        </div>
      </div>
    </dialog>
  );
}

import { deleteSquad } from "@/actions/actions";
import { Trash2 } from "lucide-react";

const Delete = ({ id } : { id: string }) => {
  return (
    <form action={deleteSquad}>
      <input type="hidden" name="id" value={id} />
      <button className="bg-red-500 hover:bg-red-700 text-white font-bold rounded p-2">
        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </form>
  );
};

export default Delete;
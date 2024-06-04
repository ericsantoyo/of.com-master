import { updateSquad } from "@/actions/actions";
import { Pencil } from "lucide-react";

const Update = ({ id } : { id: string }) => {
  return (
    <form action={updateSquad}>
      <input type="hidden" name="id" value={id} />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded p-2">
        <Pencil className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </form>
  );
};

export default Update;
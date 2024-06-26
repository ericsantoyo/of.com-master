import { deleteSquad } from "@/actions/myTeamsActions";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Delete = ({ id }: { id: string }) => {
  return (
    <form action={deleteSquad}>
      <input type="hidden" name="id" value={id} />
      <Button variant={"red"} size={"icon"} className="">
        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
      </Button>
    </form>
  );
};

export default Delete;

import TopBar from "./TopBar";
import ClubIcons from "./ClubIcons";
import { Card } from "@/components/ui/card";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <Card className="w-full transition-all pt-0.5 mb-5 border-none rounded shadow-md shadow-neutral-300">
      {/* NAVBAR - TOP ROW */}
      <TopBar />
      {/* NAVBAR - BOTTOM ROW */}
      <ClubIcons />
    </Card>
  );
};

export default Navbar;

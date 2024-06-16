import TopBar from "./TopBar";
import ClubIcons from "./ClubIcons";
import { Card } from "@/components/ui/card";
import UserStatusBar from "./UserStatusBar";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <Card className="w-full transition-all pt-0.5 mb-5 border-none rounded shadow-md shadow-neutral-300">
      {/* NAVBAR - TOP ROW */}
      <TopBar />
      {/* NAVBAR - BOTTOM ROW */}
      <ClubIcons />
      <UserStatusBar />
    </Card>
  );
};

export default Navbar;

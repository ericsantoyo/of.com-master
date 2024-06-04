import CommingWeek from "./CommingWeek";
import GamesSheet from "../GamesSheet";
import Logo from "../navbar/Logo";
import SocialIcons from "../navbar/SocialIcons";

export default function Footer() {
  return (
    <footer className="border-t-2 pt-4 my-6 pb-16 container max-w-6xl w-full flex flex-col justify-start items-center gap-3">
      <div className="w-full flex flex-col md:flex-row justify-start items-center gap-3">
        <div className="flex justify-center items-center gap-4 ">
          <p className="scroll-m-20 text-2xl font-extrabold tracking-tight ">
            <span className="text-neutral-800">Once</span>
            <span className="text-neutral-500">Fantasy</span>
          </p>

          <SocialIcons className="flex gap-3" />
        </div>
        {/* <CommingWeek /> */}
        <div className=""></div>
      </div>
      <p className="text-gray-500 text-sm text-right ">
        &copy; 2023 Once Fantasy. All rights reserved.
      </p>
    </footer>
  );
}

import Link from "next/link";

import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";

import { ThemeSwitcher } from "./ThemeSwitcher";
import { Button } from "@/components/ui/button";

interface SocialIconsProps {
  className: string;
}

export default function SocialIcons({ className }: SocialIconsProps) {
  return (
    <div className={`${className} `}>
      {/* TWITTER LOGO */}
      <Link
        className="group flex flex-col justify-center items-center transition-all w-10"
        target="_blank"
        href="https://twitter.com/home"
      >
        <p className="transition-all text-transparent text-center text-[8px] p-0 m-0 hidden md:flex">
          _______
        </p>
        <Button
          variant="navbar"
          size={"icon"}
          className={` transition-all group-hover:bg-sky-600 group-hover:border-none my-1.5 `}
        >
          <TwitterIcon
            color="primary"
            className="group-hover:text-neutral-100 transition  "
          />
        </Button>
        <p className="transition-all group-hover:text-inherit text-transparent text-center text-xs hidden md:flex">
          Twitter
        </p>
      </Link>
      {/* YOUTUBE LOGO */}

      <Link
        className="group flex flex-col justify-center items-center transition-all w-10"
        target="_blank"
        href="https://www.youtube.com/"
      >
        <p className="transition-all text-transparent text-center text-[8px] p-0 m-0 hidden md:flex">
          _______
        </p>
        <Button
          variant="navbar"
          size={"icon"}
          className={` transition-all  group-hover:bg-red-600 group-hover:border-none my-1.5`}
        >
          <YouTubeIcon
            color="error"
            className="group-hover:text-neutral-100 transition  "
          />
        </Button>
        <p className="transition-all group-hover:text-inherit text-transparent text-center text-xs hidden md:flex">
          YouTube
        </p>
      </Link>

      {/*     
          <Button
            variant="default"
            size={"icon"}
            className={`group transition-all bg-neutral-50 dark:bg-neutral-300 dark:hover:bg-red-600 hover:bg-red-600`}
          >
            <YouTubeIcon
              color="error"
              className="group-hover:text-neutral-100 transition "
            />
          </Button>
        </Tooltip> */}

      {/* <ThemeSwitcher className="" /> */}

      {/* THREADS LOGO */}
      {/* <Link className="bg-gradient-to-r from-white to-white hover:from-[#7a7a7a] hover:to-[#7a7a7aab] transition flex justify-center items-center rounded-full w-7 h-7 align-middle drop-shadow-md shadow-black" target="_blank" href="https://threads.net/">
            <span className="">
                <Image 
                src="/threads.svg" 
                height={20} 
                width={20}
                alt='Threads'
                className='hover:invert' />
              </span>
          </Link> */}

      {/* FACEBOOK LOGO */}
      {/* <Link className="bg-gradient-to-r from-white to-white hover:from-[#4267B2] hover:to-[#4267b2ab] transition flex justify-center items-center rounded-full w-7 h-7 align-middle drop-shadow-md shadow-black" target="_blank" href="https://facebook.com/">
            <span className="">
                <Image 
                src="/facebook.svg" 
                height={20} 
                width={20}
                alt='Facebook'
                className='hover:invert' />
              </span>
          </Link> */}

      {/* INSTAGRAM LOGO */}
      {/* <Link className="bg-gradient-to-r from-white to-white hover:from-pink-500 hover:to-yellow-500 transition flex justify-center items-center rounded-full w-7 h-7 align-middle drop-shadow-md shadow-black" target="_blank" href="https://instagram.com/">
            <span className="">
                <Image 
                src="/instagram.svg" 
                height={20} 
                width={20}
                alt='Instagram'
                className='hover:invert' />
              </span>
          </Link> */}
    </div>
  );
}

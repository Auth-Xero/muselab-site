import React from "react";
import Head from "next/head";
import Nav from "../../components/nav";
import Downloader from "../../components/downloader";
import { FaWindows, FaApple, FaLinux } from "react-icons/fa";
import { MdFolderZip } from "react-icons/md";
import Link from "next/link";

const downloads = [
  {
    title: "Windows",
    filename: "muselab-win.exe",
    icon: <FaWindows />,
  },
  {
    title: "MacOS",
    filename: "muselab-mac.zip",
    icon: <FaApple />,
  },
  {
    title: "Linux",
    filename: "muselab-linux",
    icon: <FaLinux />,
  },
];

export default function Download() {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Head>
        <title>Download MuseLab</title>
        <meta
          name="description"
          content="A free plugin for MuseScore 3 enabling real-time collaboration with
          other users."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <main className="w-screen h-screen py-24 flex flex-col items-center justify-center bg-[url('/assets/background.png')] bg-no-repeat bg-cover px-10 md:px-20 lg:px-32">
        <h1 className="text-center text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white portrait:mb-3 mb-6">
          Download MuseLab
        </h1>
        <p className="w-full text-sm sm:text-base md:text-lg xl:text-2xl font-normal text-white text-center max-w-5xl">
          Select the right <b className="text-rose-400">installer</b> for your{" "}
          <b className="text-indigo-300">machine</b>.
        </p>
        <p className="w-full text-sm sm:text-base md:text-lg xl:text-2xl font-normal text-white text-center max-w-5xl">
          <b className="text-purple-300">Double-click</b> to run the{" "}
          <b className="text-pink-300">executable</b> to automatically install
          MuseLab.
        </p>
        <div className="flex flex-col w-full items-center justify-center space-y-4 md:space-y-0 md:flex-row md:space-x-10 portrait:mt-4 mt-7">
          {downloads.map((download) => (
            <Downloader
              title={download.title}
              filename={download.filename}
              icon={download.icon}
              key={download.title}
            />
          ))}
        </div>
        <p className="w-full text-sm sm:text-base md:text-lg xl:text-2xl font-normal text-white text-center max-w-5xl portrait:my-3 my-6">
          Or, if you prefer to install MuseLab{" "}
          <b className="text-orange-300">manually:</b>
        </p>
        <Link
          className="relative flex flex-col cursor-pointer items-center justify-center rounded-lg backdrop-blur-sm py-[2vh] ring-1 ring-slate-600 bg-blue-950/30 hover:scale-105 hover:shadow-sm duration-300 ease-in-out portrait:w-2/3 w-1/4"
          href="/download/manual"
        >
          <div className="absolute z-0 w-full h-full flex flex-col items-center justify-center text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-slate-700/50">
            <MdFolderZip />
          </div>
          <h2 className="relative z-10 text-base sm:text-lg md:text-xl xl:text-3xl font-black text-white">
            Zip file
          </h2>
          <p className="relative z-10 text-white/50 font-regular text-xs sm:text-base xl:text-lg">
            Instructions
          </p>
        </Link>
      </main>
      <footer className="w-screen h-20 fixed bottom-0 flex flex-row justify-center items-center bg-transparent">
        <p className="text-white/20 font-medium text-xs lg:text-sm">
          Not affiliated with MuseScore.
        </p>
      </footer>
    </div>
  );
}

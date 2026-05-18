import React from "react";
import Head from "next/head";
import Button from "../components/button";
import { IoLogoDiscord } from "react-icons/io5";
import Nav from "../components/nav";

export default function Home() {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Head>
        <title>MuseLab</title>
        <meta
          name="description"
          content="A free plugin for MuseScore 3 (and MuseScore 4, alpha) enabling
          real-time collaboration with other users."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <main className="w-screen h-screen flex flex-col items-center justify-center bg-[url('/assets/background.png')] bg-no-repeat bg-cover px-10 md:px-20 lg:px-32">
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white text-center mb-5 max-w-6xl">
          Music collaboration made easy.
        </h1>
        <h2 className="w-full text-base md:text-2xl xl:text-3xl font-normal text-white text-center max-w-5xl">
          Create <b className="text-fuchsia-400">incredible music</b> together
          in <b className="text-lime-300">real-time</b> with MuseLab, a{" "}
          <b className="text-teal-400">free plugin</b> for{" "}
          <b className="text-blue-300">MuseScore 3</b> — now with{" "}
          <b className="text-blue-300">MuseScore 4</b>{" "}
          <b className="text-amber-300">(alpha)</b> support.
        </h2>
        <div className="flex flex-col portrait:space-y-5 landscape:flex-row landscape:space-x-5 mt-10">
          <Button text="Download" onClick="/download" type="primary" />
          <Button
            text={
              <p className="flex items-center justify-between">
                Join our Discord
                <IoLogoDiscord className="ml-2 text-2xl" />
              </p>
            }
            onClick="https://discord.gg/SKkwy6uDHP"
            type="secondary"
          />
        </div>
      </main>
      <footer className="w-screen h-32 fixed bottom-0 flex flex-row justify-center items-center bg-transparent">
        <p className="text-white/20 font-medium text-sm">
          Not affiliated with MuseScore.
        </p>
      </footer>
    </div>
  );
}
import React, { useState } from "react";

import Head from "next/head";
import Nav from "../../components/nav";
import Image from "next/image";
import { showError, showSuccess } from "../../utils/verify";

export default function Download() {
  const [version, setVersion] = useState(3);
  const downloadZip = () => {
    fetch("https://api.muselab.app/api/plugin/download?v=" + version, {
      method: "GET",
      headers: {
        authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
      .then((res) => {
        if (res.ok) {
          res.blob().then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = version >= 4 ? "Muselab-v4.zip" : "Muselab.zip";
            a.click();
            showSuccess("Downloaded successfully!");
          });
        } else {
          throw new Error("Something went wrong.");
        }
      })
      .catch((error) => {
        showError(error.message);
      });
  };
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Head>
        <title>Manual Installation</title>
        <meta
          name="description"
          content="A free plugin for MuseScore 3 (and MuseScore 4, alpha) enabling
          real-time collaboration with other users."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav fixed={true} />
      <main className="w-screen pt-20 md:pt-28 lg:pt-40 flex flex-col items-center justify-center bg-[url('/assets/background.png')] bg-no-repeat bg-cover px-10 md:px-20 lg:px-32">
        <h1 className="text-center text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white portrait:mb-3 mb-6">
          Manual Installation
        </h1>
        <div className="w-full text-sm sm:text-base md:text-lg xl:text-2xl font-normal text-white text-center max-w-5xl grid grid-cols-1 gap-12 my-10">
          <div>
            <b className="font-black text-white">1. </b>
            Choose your MuseScore version{" "}
            <select
              value={version}
              onChange={(e) => setVersion(Number(e.target.value))}
              className="mx-1 align-middle bg-slate-800/70 ring-1 ring-slate-600 rounded-md px-2 py-1 text-sm sm:text-base md:text-lg text-white focus:outline-none focus:ring-teal-500/70 duration-200"
            >
              <option value={3}>MuseScore 3 (stable)</option>
              <option value={4}>MuseScore 4 (alpha)</option>
            </select>{" "}
            and download the{" "}
            <button
              className="text-teal-400 underline hover:text-teal-200"
              onClick={() => {
                downloadZip();
              }}
            >
              ZIP file
            </button>
            {version >= 4 ? " (alpha build)" : ""}.
          </div>
          <div className="w-full flex flex-row flex-nowrap items-center space-x-10 justify-center">
            <div className="w-1/2 text-right">
              <b className="font-black text-white">2. </b>
              Open <b className="text-blue-400">MuseScore</b> and go to{" "}
              <b className="text-purple-300">Edit{">"}Preferences.</b> Locate
              the path to the <b className="text-red-300">Plugins</b> folder.
            </div>
            <div className="w-1/2 flex items-center justify-start">
              <Image
                src="/assets/plugin-path.png"
                width={300}
                height={200}
                alt="MuseScore Preferences Path"
                className="ring-8 ring-teal-400"
              />
            </div>
          </div>
          <div>
            <b className="font-black text-white">3. </b>
            Extract the contents of the downloaded zip file and move them to the
            path you found in step 2.
          </div>
          <div className="w-full flex flex-row flex-nowrap items-center space-x-10 justify-center">
            <div className="w-1/2 flex items-center justify-end">
              <Image
                src="/assets/reload-plugin.png"
                width={400}
                height={300}
                alt="MuseScore Plugin Manager Reload Plugins"
                className="ring-8 ring-teal-400"
              />
            </div>
            <div className="w-1/2 text-left">
              <b className="font-black text-white">4. </b>
              In <b className="text-blue-400">MuseScore</b>, go to{" "}
              <b className="text-emerald-400">Plugins{" > "}Plugin Manager</b>{" "}
              and click <b className="text-lime-400">Reload Plugins</b>
            </div>
          </div>
          <div>
            <b className="font-black text-white">5. </b>
            On the left, make sure <b className="text-teal-300">MuseLab</b> is
            checked, then press &quot;<b className="text-green-300">OK</b>
            .&quot;
          </div>
          <div>
            <b className="font-black text-white">6. </b>
            You&apos;re all set! To use <b className="text-teal-300">MuseLab</b>
            , click on <b className="text-fuchsia-300">Plugins {">"} MuseLab</b>
            .
          </div>
        </div>
        <footer className="w-screen h-32 flex flex-row justify-center items-center bg-transparent">
          <p className="text-white/20 font-medium text-xs lg:text-sm">
            Not affiliated with MuseScore.
          </p>
        </footer>
      </main>
    </div>
  );
}
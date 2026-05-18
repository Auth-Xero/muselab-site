// components/adminlayout.js
import React from "react";
import Head from "next/head";
import Nav from "./nav";
import Spinner from "./spinner";
import { ToastContainer } from "react-toastify";

const DEFAULT_MAIN =
  "w-screen h-screen flex flex-col items-center justify-center bg-[url('/assets/background.png')] bg-no-repeat bg-cover px-10 md:px-20 lg:px-32";

export default function AdminLayout({
  authenticated,
  title,
  children,
  mainClass,
}) {
  if (!authenticated) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Head>
        <title>MuseLab</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <ToastContainer />
      <main className={mainClass || DEFAULT_MAIN}>
        {title && (
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-10 mt-2">
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}

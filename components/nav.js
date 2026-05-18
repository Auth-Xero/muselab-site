import Image from "next/image";
import React, { useState, useEffect } from "react";
import Button from "./button";
import Link from "next/link";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { HiMenu } from "react-icons/hi";
import { showError, showSuccess } from "../utils/verify";
import { ToastContainer } from "react-toastify";
import { apiRequest } from "../utils/api";

export default function Nav({ fixed }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { width, height } = useWindowDimensions();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    if (!loggedIn) return;

    try {
      const cached = JSON.parse(localStorage.getItem("roles") || "[]");
      if (Array.isArray(cached)) setIsAdmin(cached.includes("ROLE_ADMIN"));
    } catch {
    }

    apiRequest("/auth/roles")
      .then((roles) => {
        if (!Array.isArray(roles)) return;
        localStorage.setItem("roles", JSON.stringify(roles));
        setIsAdmin(roles.includes("ROLE_ADMIN"));
      })
      .catch(() => {
      });
  }, []);

  const logout = () => {
    fetch("https://api.muselab.app/api/auth/logout", {
      method: "GET",
      headers: {
        authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
      .then((res) => {
        if (res.ok) {
          showSuccess("Logged out successfully");
          setIsLoggedIn(false);
          localStorage.clear();
          if (
            window.location.pathname.includes("projects") ||
            window.location.pathname.includes("admin")
          )
            window.location.href = "/";
        } else {
          throw new Error("Something went wrong");
        }
      })
      .catch((error) => {
        showError(error.message);
      });
  };

  if (width < 900) {
    return (
      <nav
        className={
          "w-screen pt-3 z-30 flex flex-row justify-between items-center px-6 md:px-12 " +
          (!fixed && "fixed top-0 ")
        }
      >
        <ToastContainer />
        <Link href="/">
          <Image
            src="/assets/logo.png"
            alt="MuseLab"
            width={200}
            height={200}
            className="relative z-40"
          />
        </Link>
        <button
          className="w-20 h-20 -right-6 flex items-center justify-center text-white text-3xl relative z-20"
          onClick={() => setOpen(!open)}
        >
          <HiMenu />
        </button>
        <div
          className={
            "duration-500 ease-in-out absolute z-30 top-0 left-0 overflow-hidden " +
            (open ? "max-h-[600px]" : "max-h-0")
          }
        >
          <ul
            className={
              "backdrop-blur-lg bg-blue-950/50 relative z-30 pt-28 pb-16 px-12 text-base font-black text-white w-screen flex-col space-y-6 items-start justify-start"
            }
          >
            <li>
              <div className="h-[2px] bg-slate-400/50 z-20" />
            </li>
            {isLoggedIn && (
              <li>
                <Link
                  href="/projects"
                  className="hover:text-teal-500 duration-300 ease-in-out"
                >
                  Projects
                </Link>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <Link
                  href="/account"
                  className="hover:text-teal-500 duration-300 ease-in-out"
                >
                  Account
                </Link>
              </li>
            )}
            {isLoggedIn && isAdmin && (
              <>
                <li className="pt-2 text-xs uppercase tracking-widest text-teal-400/70">
                  Admin
                </li>
                <li>
                  <Link
                    href="/admin/stats"
                    className="hover:text-teal-500 duration-300 ease-in-out"
                  >
                    Stats
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/logs"
                    className="hover:text-teal-500 duration-300 ease-in-out"
                  >
                    Logs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/plugin"
                    className="hover:text-teal-500 duration-300 ease-in-out"
                  >
                    Upload Plugin
                  </Link>
                </li>
              </>
            )}
            {/*<li>
              <Link
                href="/about"
                className="hover:text-teal-500 duration-300 ease-in-out"
              >
                About
              </Link>
            </li>*/}
            <li>
              <Link
                href="/download"
                className="hover:text-teal-500 duration-300 ease-in-out"
              >
                Download
              </Link>
            </li>
            <li>
              <a
                href="https://discord.gg/SKkwy6uDHP"
                className="hover:text-teal-500 duration-300 ease-in-out"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord
              </a>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-teal-500 duration-300 ease-in-out"
              >
                Contact
              </Link>
            </li>
            <li className="w-1/3">
              {isLoggedIn ? (
                <Button text="Log out" onClick={logout} type="primary" />
              ) : (
                <Button text="Log in" onClick="/login" type="secondary" />
              )}
            </li>
            {!isLoggedIn && (
              <li className="w-1/3">
                <Button text="Sign up" onClick="/signup" type="primary" />
              </li>
            )}
          </ul>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={
        "w-screen h-28 z-30 flex flex-row justify-between items-center px-16 top-0 " +
        (!fixed ? "fixed" : "absolute")
      }
    >
      <Link href="/">
        <Image src="/assets/logo.png" alt="MuseLab" width={240} height={240} />
      </Link>
      <ul className="flex flex-row w-3/5 text-sm lg:text-lg font-black text-white justify-evenly">
        {isLoggedIn && (
          <li>
            <Link
              href="/projects"
              className="hover:text-teal-500 duration-300 ease-in-out"
            >
              Projects
            </Link>
          </li>
        )}
        {isLoggedIn && (
          <li>
            <Link
              href="/account"
              className="hover:text-teal-500 duration-300 ease-in-out"
            >
              Account
            </Link>
          </li>
        )}
        {isLoggedIn && isAdmin && (
          <li className="relative group">
            <span className="cursor-default hover:text-teal-500 duration-300 ease-in-out">
              Admin
            </span>
            <div className="absolute left-1/2 -translate-x-1/2 pt-3 hidden group-hover:block z-40">
              <div className="flex flex-col min-w-[160px] rounded-lg ring-1 ring-slate-600 bg-blue-950/80 backdrop-blur-md overflow-hidden">
                <Link
                  href="/admin/stats"
                  className="px-5 py-3 text-sm hover:bg-teal-500/20 hover:text-teal-300 duration-200 ease-in-out"
                >
                  Stats
                </Link>
                <Link
                  href="/admin/logs"
                  className="px-5 py-3 text-sm hover:bg-teal-500/20 hover:text-teal-300 duration-200 ease-in-out"
                >
                  Logs
                </Link>
                <Link
                  href="/admin/plugin"
                  className="px-5 py-3 text-sm hover:bg-teal-500/20 hover:text-teal-300 duration-200 ease-in-out"
                >
                  Upload Plugin
                </Link>
              </div>
            </div>
          </li>
        )}
        {/*<li>
          <Link
            href="/about"
            className="hover:text-teal-500 duration-300 ease-in-out"
          >
            About
          </Link>
        </li>*/}
        <li>
          <Link
            href="/download"
            className="hover:text-teal-500 duration-300 ease-in-out"
          >
            Download
          </Link>
        </li>
        <li>
          <a
            href="https://discord.gg/SKkwy6uDHP"
            className="hover:text-teal-500 duration-300 ease-in-out"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord
          </a>
        </li>
        <li>
          <Link
            href="/contact"
            className="hover:text-teal-500 duration-300 ease-in-out"
          >
            Contact
          </Link>
        </li>
      </ul>
      <div className="flex items-center justify-center h-full space-x-4">
        {isLoggedIn ? (
          <Button text="Log out" onClick={logout} type="primary" />
        ) : (
          <>
            <Button text="Log in" onClick="/login" type="secondary" />
            <Button text="Sign up" onClick="/signup" type="primary" />
          </>
        )}
      </div>
    </nav>
  );
}
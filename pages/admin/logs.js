import React, { useState, useEffect } from "react";
import useAdminAuth from "../../hooks/useAdminAuth";
import AdminLayout from "../../components/adminlayout";
import { apiRequest } from "../../utils/api";
import { showError } from "../../utils/verify";
import { FiList, FiSearch, FiHash } from "react-icons/fi";

export default function Logs() {
  const { authenticated, token } = useAdminAuth();
  const [content, setContent] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async (req) => {
    setLoading(true);
    try {
      const data = await req();
      setContent(
        typeof data === "string" ? data : JSON.stringify(data, null, 2)
      );
    } catch (e) {
      showError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const list = () => run(() => apiRequest("/logging/list", { token }));
  const search = () =>
    run(() =>
      apiRequest("/logging/search", { method: "POST", token, body: { query } })
    );
  const byId = () =>
    run(() =>
      apiRequest("/logging/get/" + encodeURIComponent(query), { token })
    );

  useEffect(() => {
    if (authenticated) list();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  const actionBtn =
    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-black text-white ring-1 ring-teal-500/90 bg-teal-500/90 hover:bg-teal-700/90 duration-300 ease-in-out disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <AdminLayout
      authenticated={authenticated}
      mainClass="flex flex-col items-center w-full min-h-screen bg-[url('/assets/background.png')] bg-no-repeat bg-cover px-10 md:px-20 lg:px-32 pt-28 pb-16"
    >
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-50 mb-2">
        Logs
      </h1>
      <p className="text-white/50 text-sm sm:text-base text-center max-w-lg mb-8">
        List all log files, search by keyword, or fetch a single log by its
        id.
      </p>

      <div className="w-full max-w-3xl flex flex-row flex-wrap gap-3 items-center justify-center">
        <input
          type="text"
          className="flex-1 min-w-[200px] h-11 px-4 rounded-lg bg-slate-700/40 ring-1 ring-slate-600 text-white placeholder:text-slate-400 focus:outline-none focus:ring-teal-500/70 duration-200"
          placeholder="Search keyword or log id…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        <button onClick={list} disabled={loading} className={actionBtn}>
          <FiList /> List all
        </button>
        <button onClick={search} disabled={loading} className={actionBtn}>
          <FiSearch /> Search
        </button>
        <button onClick={byId} disabled={loading} className={actionBtn}>
          <FiHash /> By id
        </button>
      </div>

      <pre className="w-full max-w-5xl max-h-[55vh] overflow-auto rounded-xl ring-1 ring-slate-600 bg-blue-950/40 text-slate-100 text-xs sm:text-sm mt-8 p-6 whitespace-pre-wrap break-words">
        {loading
          ? "Loading…"
          : content || "No results yet — run a query above."}
      </pre>
    </AdminLayout>
  );
}
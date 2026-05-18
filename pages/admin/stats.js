import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useAdminAuth from "../../hooks/useAdminAuth";
import AdminLayout from "../../components/adminlayout";
import Spinner from "../../components/spinner";
import { apiRequest } from "../../utils/api";
import { showError } from "../../utils/verify";
import { FiUsers, FiActivity, FiFolder, FiRefreshCw } from "react-icons/fi";

const DynamicReactJson = dynamic(() => import("../../components/jsonpreview"), {
  ssr: false,
  loading: () => <Spinner />,
});

function StatCard({ icon, label, value }) {
  return (
    <div className="flex-1 min-w-[180px] flex flex-col items-center gap-2 px-6 py-7 rounded-xl ring-1 ring-slate-600 bg-blue-950/30 hover:bg-blue-950/50 duration-300 ease-in-out">
      <div className="text-2xl text-teal-400">{icon}</div>
      <div className="text-3xl lg:text-4xl font-black text-white">
        {value ?? "—"}
      </div>
      <div className="text-white/50 text-xs sm:text-sm uppercase tracking-wider text-center">
        {label}
      </div>
    </div>
  );
}

export default function Stats() {
  const { authenticated, token } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    apiRequest("/stats/all", { token })
      .then(setStats)
      .catch((e) => showError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (authenticated) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  return (
    <AdminLayout
      authenticated={authenticated}
      title="Admin Stats"
      mainClass="w-screen min-h-screen flex flex-col items-center justify-start bg-[url('/assets/background.png')] bg-no-repeat bg-cover px-10 md:px-20 lg:px-32 pt-28 pb-16"
    >
      {!stats ? (
        <Spinner />
      ) : (
        <div className="w-full max-w-4xl flex flex-col gap-8">
          <div className="flex flex-row flex-wrap gap-5 justify-center">
            <StatCard
              icon={<FiUsers />}
              label="Total users"
              value={stats?.users?.total}
            />
            <StatCard
              icon={<FiActivity />}
              label="Online now"
              value={stats?.users?.online}
            />
            <StatCard
              icon={<FiFolder />}
              label="Total projects"
              value={stats?.projects?.total}
            />
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-white/70 font-black text-lg">Raw data</h2>
            <button
              onClick={load}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-black text-white ring-1 ring-teal-500/90 bg-teal-500/90 hover:bg-teal-700/90 duration-300 ease-in-out disabled:opacity-40"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          <div className="rounded-xl ring-1 ring-slate-600 bg-blue-950/30 p-5 overflow-auto max-h-[45vh]">
            <DynamicReactJson json={stats} />
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
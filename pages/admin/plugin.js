import React, { useState } from "react";
import useAdminAuth from "../../hooks/useAdminAuth";
import AdminLayout from "../../components/adminlayout";
import { apiRequest } from "../../utils/api";
import { showError, showSuccess } from "../../utils/verify";
import { FiUploadCloud } from "react-icons/fi";

export default function Plugin() {
  const { authenticated, token } = useAdminAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  
  const [targetVersion, setTargetVersion] = useState(3);

  const uploadPlugin = async () => {
    if (!file) {
      showError("Choose a file first.");
      return;
    }
    const isZip =
      file.type === "application/zip" ||
      file.name.toLowerCase().endsWith(".zip");

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const data = await apiRequest(
        "/plugin/" + (isZip ? "upload-zip" : "upload") + "?v=" + targetVersion,
        { method: "POST", token, body: formData, json: false }
      );
      showSuccess((data && data.message) || "Plugin uploaded successfully.");
      setFile(null);
    } catch (e) {
      showError(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout
      authenticated={authenticated}
      title="Upload Plugin"
      mainClass="flex flex-col items-center w-full min-h-screen bg-[url('/assets/background.png')] bg-no-repeat bg-cover px-10 md:px-20 lg:px-32 pt-28 pb-16"
    >
      <p className="text-white/50 text-sm sm:text-base text-center max-w-md mb-8 -mt-4">
        Upload a new MuseLab plugin bundle. Users will get this version the
        next time they download or check for updates.
      </p>

      <div className="w-full max-w-md flex flex-col items-center gap-5">
        <div className="w-full flex flex-col gap-2">
          <label className="text-white/50 text-sm font-medium">
            Target MuseScore version
          </label>
          <select
            className="w-full h-12 px-3 rounded-lg bg-slate-700/40 ring-1 ring-slate-600 text-white focus:outline-none focus:ring-teal-500/70 duration-200"
            value={targetVersion}
            onChange={(e) => setTargetVersion(Number(e.target.value))}
            disabled={uploading}
          >
            <option value={3}>MuseScore 3 (stable)</option>
            <option value={4}>MuseScore 4 (alpha)</option>
          </select>
          <span className="text-white/40 text-xs">
            v3 and v4 plugins are stored and served separately. Existing
            clients are unaffected by an upload to the other version.
          </span>
        </div>

        <label
          htmlFor="plugin-file"
          className="w-full cursor-pointer flex flex-col items-center justify-center gap-3 px-6 py-10 rounded-xl border-2 border-dashed border-slate-600 bg-slate-700/30 hover:border-teal-500/70 hover:bg-slate-600/40 duration-300 ease-in-out text-center"
        >
          <FiUploadCloud className="text-4xl text-teal-400" />
          {file ? (
            <span className="text-white font-medium break-all">
              {file.name}
            </span>
          ) : (
            <>
              <span className="text-white font-medium">
                Click to choose a .zip bundle
              </span>
              <span className="text-white/40 text-xs">
                Accepted: .zip plugin archive
              </span>
            </>
          )}
          <input
            id="plugin-file"
            type="file"
            accept=".zip"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0] || null)}
          />
        </label>

        <button
          onClick={uploadPlugin}
          disabled={!file || uploading}
          className="w-full h-12 rounded-lg font-black text-white ring-1 ring-teal-500/90 bg-teal-500/90 hover:bg-teal-700/90 duration-300 ease-in-out disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading…" : "Upload plugin"}
        </button>
      </div>
    </AdminLayout>
  );
}
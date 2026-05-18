import React from "react";
import Button from "./button";

export default function Project({ project }) {
  const collaborators = project.users ? project.users.length : 0;
  const versions = project.files ? project.files.length : 0;

  return (
    <section className="relative flex flex-col items-center justify-center rounded-lg backdrop-blur-sm pt-6 pb-9 ring-1 ring-slate-600 bg-blue-950/30 hover:scale-105 hover:shadow-sm duration-300 ease-in-out min-w-[250px]">
      {project.version && (
        <span className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-black text-teal-300 ring-1 ring-teal-500/60 bg-teal-500/10">
          v{project.version}
        </span>
      )}
      <h2 className="relative z-10 text-base sm:text-lg md:text-xl lg:text-2xl font-black text-white">
        {project.name}
      </h2>
      <p className="relative z-10 text-white/50 font-regular text-xs sm:text-base xl:text-lg">
        Collaborators: {collaborators}
      </p>
      <p className="relative z-10 text-white/50 font-regular text-xs sm:text-base xl:text-lg mb-2">
        Versions: {versions}
      </p>
      <Button onClick={"/projects/" + project.projectId} text="Edit project" />
    </section>
  );
}
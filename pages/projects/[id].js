import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Nav from "../../components/nav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showError, showSuccess } from "../../utils/verify";
import {
  FaDownload,
  FaEdit,
  FaFileUpload,
  FaTrash,
  FaUserMinus,
  FaUserPlus,
} from "react-icons/fa";
import Modal from "../../components/modal";
import Button from "../../components/button";
import { PulseLoader } from "react-spinners";

import JSZip from "jszip";

export default function ProjectPage() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState({});
  const [authToken, setAuthToken] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectGenre, setProjectGenre] = useState("");
  const [projectEnsemble, setProjectEnsemble] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState("");
  const [sortMethod, setSortMethod] = useState("newest");

  const [loading, setLoading] = useState(false);
  const updateProject = () => {
    let newProject = {};
    if (projectTitle) newProject.name = projectTitle;
    if (projectGenre) newProject.genre = projectGenre;
    if (projectEnsemble) newProject.ensemble = projectEnsemble;
    fetch(`https://api.muselab.app/api/projects/update/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
      body: JSON.stringify(newProject),
    })
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((data) => {
              showSuccess("Updated project details.");
              getProject();
            })
            .catch((error) => {
              showError(error.message);
            });
        } else {
          throw new Error("Failed to update project.");
        }
      })
      .catch((error) => {
        showError(error.message);
      });
    setShowModal("");
  };

  const deleteProject = () => {
    fetch(`https://api.muselab.app/api/projects/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + authToken,
      },
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/projects";
        } else {
          throw new Error("Failed to delete project.");
        }
      })
      .catch((error) => {
        showError(error.message);
      });
  };

  const addUser = () => {
    fetch(`https://api.muselab.app/api/projects/${id}/add/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
      body: JSON.stringify({ username }),
    })
      .then((response) => {
        response
          .json()
          .then((data) => {
            showSuccess("Added user " + username + ".");
          })
          .catch((error) => {
            showError(error.message);
          });
      })
      .catch((error) => {
        showError(error.message);
      });
    setShowModal("");
  };

  const removeUser = (user) => {
    fetch(`https://api.muselab.app/api/projects/${id}/remove/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
      body: JSON.stringify({ username: user }),
    })
      .then((response) => response.json())
      .then((data) => {
        showSuccess("Removed user " + user + ".");
        getProject();
      })
      .catch((error) => {
        showError(error.message);
      });
    setShowModal("");
  };

  const addFile = (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);
    formData.append("title", message);
    formData.append("project_id", id);
    fetch("https://api.muselab.app/api/files/upload", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + authToken,
      },
      body: formData,
    })
      .then((response) =>
        response
          .json()
          .then((data) => {
            setLoading(false);
            if (data.error) {
              throw new Error(data.error);
            }
            showSuccess("Uploaded file " + file.name + ".");
            getProject();
          })
          .catch((error) => showError(error.message))
      )
      .catch((error) => showError(error.message));
    setShowModal("");
  };

  const deleteFile = (file, fileId) => {
    console.log(file);
    fetch(
      `https://api.muselab.app/api/projects/get/${project.projectId}/files/delete/${fileId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + authToken,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          showSuccess("Deleted file.");
          getProject();
        } else {
          throw new Error("Failed to delete file.");
        }
      })
      .catch((error) => showError(error.message));
    setShowModal("");
  };

  const downloadFile = (fileId, fileName) => {
    fetch("https://api.muselab.app/api/files/get/" + fileId, {
      headers: {
        Authorization: "Bearer " + authToken,
      },
    })
      .then((response) =>
        response
          .blob()
          .then((blob) => {
            const link = document.createElement("a");
            blob = blob.slice(0, blob.size, "text/xml");
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            link.remove();
          })
          .catch((error) => showError(error.message))
      )
      .catch((error) => showError(error.message));
  };

  const sortBy = (value) => {
    if (!project.files) return;
    const newProject = { ...project };
    switch (value) {
      case "title":
        newProject.files.sort((a, b) => {
          return a.title.localeCompare(b.title, "en", { sensitivity: "base" });
        });
        break;
      case "user":
        newProject.files.sort((a, b) => {
          return a.user.username.localeCompare(b.user.username, "en", {
            sensitivity: "base",
          });
        });
        break;
      case "filename":
        newProject.files.sort((a, b) => {
          return a.fileName.localeCompare(b.fileName, "en", {
            sensitivity: "base",
          });
        });
        break;
      case "version":
        newProject.files.sort((a, b) => {
          return (b.version ?? 0) - (a.version ?? 0);
        });
        break;
      case "oldest":
        newProject.files.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        break;
      default:
        newProject.files.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        break;
    }
    setProject(newProject);
  };

  const getProject = () => {
    fetch("https://api.muselab.app/api/projects/get/" + id, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((data) => {
              setProjectTitle(data.name);
              setProjectGenre(data.genre);
              setProjectEnsemble(data.ensemble);
              setProject(data);
            })
            .catch((error) => {
              if (id) showError(error.message);
            });
        } else {
          throw new Error("Failed to fetch project.");
        }
      })
      .catch((error) => {
        if (id) showError(error.message);
      });
  };

  const unzipFile = () => {
    if (!file) {
      showError("Please select a file.");
      return;
    }
    if (!message) {
      showError("Please enter a version title.");
      return;
    }
    if (
      file.type !== "application/x-musescore" &&
      !file.name.endsWith(".mscz") &&
      !file.name.endsWith(".mscx")
    ) {
      showError("Please upload a MuseScore file.");
      return;
    }

    let reader = new FileReader();
    reader.onload = (event) => {
      let zip = new JSZip();
      zip
        .loadAsync(event.target.result)
        .then((zipData) => {
          let promises = [];
          zipData.forEach((relativePath, zipEntry) => {
            promises.push(
              zipEntry.async("blob").then((fileData) => {
                let extractedFile = new File([fileData], zipEntry.name, {
                  type: fileData.type,
                });
                if (zipEntry.name.endsWith(".mscx")) addFile(extractedFile);
              })
            );
          });
          Promise.all(promises).catch((error) => {
            showError("Error during file extraction or upload:" + error);
          });
        })
        .catch((error) => {
          showError("Error while loading zip:" + error);
        });
    };
    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      window.location.href = "/login";
    }
    if (id) {
      setAuthToken(localStorage.getItem("accessToken"));
      getProject();
    }
  }, [id]);

  useEffect(() => {
    sortBy(sortMethod);
  }, [sortMethod]);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Head>
        <title>MuseLab</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <ToastContainer />
      <main className="relative w-screen lg:h-screen min-h-screen overflow-y-scroll bg-[url('/assets/background.png')] bg-no-repeat bg-cover flex flex-col lg:flex-row items-center justify-center px-10 md:px-20 lg:px-32 py-32 gap-5">
        <div className="w-full lg:w-1/2 h-full flex flex-col justify-between items-center gap-5">
          <div className="w-full lg:w-full h-1/3 flex flex-col gap-2 items-start justify-center rounded-xl py-5 px-8 ring-1 ring-slate-600 bg-blue-950/30 ">
            <div className="w-full flex justify-between items-center">
              <p className="text-white font-regular text-sm sm:text-lg xl:text-xl">
                <b className="font-black text-red-300">Title: </b>
                {project.name || "Untitled project"}
              </p>
              <Modal
                preview={
                  <FaEdit className="text-white/50 hover:text-white duration-300 ease-in-out text-lg md:text-xl lg:text-2xl" />
                }
                content={
                  <div className="z-50 px-10 py-8 flex flex-col items-center justify-center ring-1 ring-slate-600 bg-blue-950/30 rounded-lg">
                    <h1 className="text-xl lg:text-2xl font-black text-white text-center">
                      Edit project details
                    </h1>
                    <p className="text-white/50 font-normal text-sm my-1 w-full">
                      Name
                    </p>
                    <input
                      type="text"
                      placeholder="Title"
                      className="w-full h-10 text-sm md:text-base lg:text-lg px-3 rounded-lg bg-slate-900/60 text-white/70 focus:outline-none focus:ring-1 focus:ring-slate-600"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                    />
                    <p className="text-white/50 font-normal text-sm my-1 w-full">
                      Genre
                    </p>
                    <input
                      type="text"
                      placeholder="Genre"
                      className="w-full h-10 text-sm md:text-base lg:text-lg px-3 rounded-lg bg-slate-900/60 text-white/70 focus:outline-none focus:ring-1 focus:ring-slate-600"
                      value={projectGenre}
                      onChange={(e) => setProjectGenre(e.target.value)}
                    />
                    <p className="text-white/50 font-normal text-sm my-1 w-full">
                      Ensemble
                    </p>
                    <input
                      type="text"
                      placeholder="Ensemble"
                      className="w-full h-10 text-sm md:text-base lg:text-lg px-3 mb-4 rounded-lg bg-slate-900/60 text-white/70 focus:outline-none focus:ring-1 focus:ring-slate-600"
                      value={projectEnsemble}
                      onChange={(e) => setProjectEnsemble(e.target.value)}
                    />
                    <Button
                      text="Save"
                      type="primary"
                      onClick={updateProject}
                    />
                  </div>
                }
                showModal={showModal}
                setShowModal={setShowModal}
                name={"edit"}
              />
            </div>
            <p className="text-white font-regular text-sm sm:text-lg xl:text-xl">
              <b className="font-black text-orange-300">Creation date: </b>
              {new Date(project.date).toLocaleString() || "Unknown date"}
            </p>
            <p className="text-white font-regular text-sm sm:text-lg xl:text-xl">
              <b className="font-black text-sky-300">Genre: </b>
              {project.genre || "Unknown genre"}
            </p>
            <p className="text-white font-regular text-sm sm:text-lg xl:text-xl">
              <b className="font-black text-teal-300">MuseScore version: </b>
              {project.version ? "v" + project.version : "Unknown"}
            </p>
            <div className="w-full flex justify-between items-center">
              <p className="text-white font-regular text-sm sm:text-lg xl:text-xl">
                <b className="font-black text-indigo-300">Ensemble: </b>
                {project.ensemble || "Unknown ensemble"}
              </p>
              <Modal
                preview={
                  <FaTrash className="text-white/50 hover:text-white duration-300 ease-in-out text-lg md:text-xl lg:text-2xl" />
                }
                content={
                  <div className="z-50 px-10 py-8 flex flex-col items-center justify-center gap-1 ring-1 ring-slate-600 bg-blue-950/30 rounded-lg">
                    <h1 className="text-xl font-normal text-white text-center">
                      Are you sure you want to{" "}
                      <b className="font-bold text-indigo-400">delete</b> this
                      project?
                    </h1>
                    <p className="text-white/50 font-normal text-lg mb-3">
                      This action <b className="text-rose-400">cannot</b> be
                      undone.
                    </p>
                    <Button
                      text="Delete"
                      type="primary"
                      onClick={deleteProject}
                    />
                  </div>
                }
                showModal={showModal}
                setShowModal={setShowModal}
                name={"delete"}
              />
            </div>
          </div>
          <div className="relative w-full h-2/3 flex flex-col gap-1 items-start justify-start rounded-xl p-8 ring-1 ring-slate-600 bg-blue-950/30 ">
            <h2 className="text-white w-full font-black text-lg sm:text-xl xl:text-2xl flex justify-between flex-row items-center">
              Contributors
              <Modal
                preview={
                  <FaUserPlus className="text-white/50 hover:text-white duration-300 ease-in-out text-lg md:text-xl lg:text-2xl" />
                }
                content={
                  <div className="z-50 px-10 py-8 flex flex-col items-center justify-center gap-5 ring-1 ring-slate-600 bg-blue-950/30 rounded-lg">
                    <h1 className="text-2xl font-black text-white text-center">
                      Add collaborators
                    </h1>
                    <input
                      type="text"
                      placeholder="Username"
                      className="w-full h-10 px-3 rounded-lg bg-slate-900/60 text-white/70 font-normal text-lg focus:outline-none focus:ring-1 focus:ring-slate-600"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <Button text="Add" type="primary" onClick={addUser} />
                  </div>
                }
                showModal={showModal}
                setShowModal={setShowModal}
                name={"addUser"}
              />
            </h2>
            <p className="text-white/50 font-regular text-xs sm:text-sm lg:text-base xl:text-lg">
              Total: {project.users && project.users.length}
            </p>
            <div className="w-full flex items-center overflow-y-hidden justify-center bg-slate-500/60 rounded-xl px-4 py-3">
              <ul className="relative flex w-full h-full overflow-y-scroll space-y-2 flex-col lg:px-3 lg:py-2">
                {project.users &&
                  project.users.map((user, index) => (
                    <li
                      key={index}
                      className="text-white w-full flex flex-row justify-between text-sm sm:text-lg xl:text-xl"
                    >
                      <p className="text-white text-sm sm:text-lg xl:text-xl">
                        {user.username}
                      </p>
                      {user.username !== localStorage.getItem("username") && (
                        <Modal
                          preview={
                            <FaUserMinus className="text-white/50 hover:text-white duration-300 ease-in-out text-lg md:text-xl lg:text-2xl" />
                          }
                          content={
                            <div className="z-50 px-10 py-8 flex flex-col items-center justify-center gap-5 ring-1 ring-slate-600 bg-blue-950/30 rounded-lg">
                              <h1 className="text-xl font-normal text-white text-center">
                                Are you sure you want to remove user{" "}
                                <b className="text-teal-500 font-black">
                                  {user.username}
                                </b>{" "}
                                from the project?
                              </h1>
                              <Button
                                text="Confirm"
                                type="primary"
                                onClick={() => removeUser(user.username)}
                              />
                            </div>
                          }
                          showModal={showModal}
                          setShowModal={setShowModal}
                          name={"removeUser"}
                        />
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="relative w-full lg:w-1/2 h-full flex flex-col gap-1 items-start justify-start rounded-xl py-10 px-8 ring-1 ring-slate-600 bg-blue-950/30 ">
          <h2 className="text-white font-black text-lg sm:text-xl xl:text-2xl w-full flex justify-between items-center">
            Files
            <Modal
              preview={
                loading ? (
                  <PulseLoader
                    color={"#F4F7FFE1"}
                    loading={true}
                    size={8}
                    margin={2}
                    speedMultiplier={0.5}
                  />
                ) : (
                  <FaFileUpload className="text-white/50 hover:text-white duration-300 ease-in-out text-lg md:text-xl lg:text-2xl" />
                )
              }
              content={
                <div className="z-50 px-10 py-8 flex flex-col items-center justify-center gap-5 ring-1 ring-slate-600 bg-blue-950/30 rounded-lg">
                  <h1 className="text-xl lg:text-2xl font-black text-white text-center">
                    Upload a file
                  </h1>
                  <input
                    type="text"
                    placeholder="Version title"
                    className="w-11/12 h-10 px-3 rounded-lg bg-slate-900/60 text-white/70 font-normal text-sm md:text-base lg:text-lg focus:outline-none focus:ring-1 focus:ring-slate-600"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <input
                    type="file"
                    className="w-11/12 px-6 py-2 rounded-lg flex items-center justify-center whitespace-nowrap text-sm md:text-base lg:text-lg font-black duration-300 ease-in-out bg-teal-500 ring-2 ring-teal-500/90 text-white hover:bg-teal-700/90 hover:text-white"
                    onChange={(event) => setFile(event.target.files[0])}
                  />
                  <Button text="Upload" type="primary" onClick={unzipFile} />
                </div>
              }
              showModal={showModal}
              setShowModal={setShowModal}
              name={"addFile"}
            />
          </h2>
          <div className="w-full flex justify-between items-center mb-3">
            <p className="text-white/50 font-regular text-xs sm:text-sm lg:text-base xl:text-lg">
              Sort by:
              <select
                className="bg-transparent text-white/50 focus:outline-none "
                onChange={(e) => setSortMethod(e.target.value)}
              >
                <option value="newest" className="text-xs lg:text-sm">
                  Newest
                </option>
                <option value="oldest" className="text-xs lg:text-sm">
                  Oldest
                </option>
                <option value="title" className="text-xs lg:text-sm">
                  Title
                </option>
                <option value="user" className="text-xs lg:text-sm">
                  User
                </option>
                <option value="filename" className="text-xs lg:text-sm">
                  File name
                </option>
                <option value="version" className="text-xs lg:text-sm">
                  Version
                </option>
              </select>
            </p>
            <p className="text-white/50 font-regular text-right text-xs sm:text-sm lg:text-base xl:text-lg">
              Total: {project.files && project.files.length}
            </p>
          </div>
          <div className="w-full h-full flex items-center overflow-y-hidden justify-center bg-slate-500/60 rounded-xl p-3">
            <ul className="relative w-full h-full overflow-y-scroll space-y-2 px-3 py-2">
              {project.files && project.files.length > 0 ? (
                project.files.map((file, index) => (
                  <React.Fragment key={index}>
                    <li
                      className="py-4 min-h-[50px] px-2 w-full flex flex-col items-start justify-start"
                    >
                      <div className="w-full flex flex-row items-center justify-between">
                        <h3 className="text-white font-black text-sm sm:text-lg xl:text-xl">
                          {file.title}
                        </h3>
                        <div className="flex flex-row space-x-5">
                          <Modal
                            preview={
                              <FaTrash className="text-white/50 hover:text-white duration-300 ease-in-out text-lg md:text-xl lg:text-2xl" />
                            }
                            content={
                              <div className="z-50 px-10 py-8 flex flex-col items-center justify-center gap-1 ring-1 ring-slate-600 bg-blue-950/30 rounded-lg">
                                <h1 className="text-xl font-normal text-white text-center">
                                  Are you sure you want to{" "}
                                  <b className="font-bold text-indigo-400">
                                    delete
                                  </b>{" "}
                                  this file?
                                </h1>
                                <p className="text-white/50 font-normal text-lg mb-3">
                                  This action{" "}
                                  <b className="text-rose-400">cannot</b> be
                                  undone.
                                </p>
                                <Button
                                  text="Delete"
                                  type="primary"
                                  onClick={() => deleteFile(file, file.id)}
                                />
                              </div>
                            }
                            showModal={showModal}
                            setShowModal={setShowModal}
                            name={"deleteFile" + index}
                          />
                          <button
                            className="text-white/50 ml-5 font-regular text-xs sm:text-base lg:text-lg xl:text-xl"
                            onClick={() => downloadFile(file.id, file.fileName)}
                          >
                            <FaDownload className="text-white/50 hover:text-white duration-300 ease-in-out" />
                          </button>
                        </div>
                      </div>
                      <p className="text-white/50 ml-5 font-regular text-xs sm:text-sm lg:text-base">
                        File name: {file.fileName || "Unknown"}
                      </p>
                      <p className="text-white/50 ml-5 font-regular text-xs sm:text-sm lg:text-base">
                        Date uploaded:{" "}
                        {new Date(file.date).toLocaleString() || "Unknown"}
                      </p>
                      <p className="text-white/50 ml-5 font-regular text-xs sm:text-sm lg:text-base">
                        Uploaded by: {file.user.username || "Unknown"}
                      </p>
                    </li>
                    {index < project.files.length - 1 && (
                      <div className="w-full h-0.5 bg-white/20 my-1" />
                    )}
                  </React.Fragment>
                ))
              ) : (
                <p className="text-white/50 font-regular text-xs sm:text-sm lg:text-base xl:text-lg">
                  No files found.
                </p>
              )}
            </ul>
          </div>
        </div>
        <footer className="w-screen absolute bottom-0 h-20 flex flex-row justify-center items-center bg-transparent">
          <p className="text-white/20 font-medium text-sm">
            Not affiliated with MuseScore.
          </p>
        </footer>
      </main>
    </div>
  );
}
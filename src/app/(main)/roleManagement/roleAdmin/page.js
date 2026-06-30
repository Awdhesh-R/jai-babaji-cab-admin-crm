
"use client";
import { apiClient } from "@/app/lib/apiClient";
import CustomLoader from "@/components/common/CustomLoader";
import { Switch } from "@mui/material";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

const countryCodes = [
  { code: "+91", label: "India", flag: "🇮🇳", digits: 10 },
  // { code: "+1", label: "USA", flag: "🇺🇸", digits: 10 },
  // { code: "+44", label: "UK", flag: "🇬🇧", digits: 10 }
];


// const modules = [
//   { module: "Booking", submodule: "All Ride" },
//   { module: "Booking", submodule: "Complete" },
//   { module: "RB Fleet", submodule: "" },
//   { module: "Operator Fleet", submodule: "" },
//   { module: "User Management", submodule: "Profiles" },
//   { module: "User Management", submodule: "Roles" },
//   { module: "Reports", submodule: "Analytics" },
//   { module: "Reports", submodule: "Export" }
// ];

const permissionTypes = ["Create", "View", "Update", "Delete"];

function UpdatedRole() {
  const [userList, setUserList] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [addUserModal, setAddUserModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);
  const [allModules, setAllModules] = useState([]);
  const [modules, setModules] = useState([]);
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "",
  });
  const [permModalOpen, setPermModalOpen] = useState(false);
  const [permEditUser, setPermEditUser] = useState(null);
  const [permState, setPermState] = useState({});
  const [editRole, setEditRole] = useState("");
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient("GET", "/rbac");
      setLoading(false);
      if(response.status || response.success) {
        setUserList(response.data);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await apiClient("GET", "/roles");
      if(response.status || response.success) {
        setRoleOptions(response.data);
      } else {
        setRoleOptions([]);
      }
    } catch (e) {
      console.log(e);
    }
  }
  const fetchModules = async () => {
    try {
      const response = await apiClient("GET", `/modules`);
      if(response.status) {
        setAllModules(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  }
  const formatModules = () => {
    let tempArr = [...allModules];
    let parentModules = tempArr.filter(mod=> mod.parent_id === null);
    let submodule = tempArr.filter(mod=> mod.parent_id);
    submodule.forEach((mod)=> {
      let index = parentModules.findIndex((pmod)=>pmod.id === mod.parent_id);
      if(parentModules[index].submodule && parentModules[index].submodule.length > 0) {
        parentModules[index].submodule.push(mod);
      } else {
        parentModules[index] = {
          ...parentModules[index],
          submodule: [mod]
        }
      }
    })
    setModules(parentModules);
    console.log(parentModules)
  }
  useEffect(()=>{
    if(allModules.length > 0) {
      formatModules();
    }
  }, [allModules]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    if(userList.length === 0) fetchAdminUsers();
    if(roleOptions.length === 0) fetchRoles();
    if(modules.length === 0) fetchModules();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAddUser = () => {
    if (
      !addForm.name.trim() ||
      !addForm.email.trim() ||
      !addForm.mobile.trim() ||
      !addForm.role.trim()
    ) {
      toast.error("All fields required.");
      return;
    }
    const regDigits = new RegExp(`^\\d{${10}}$`);
    if (!regDigits.test(addForm.mobile)) {
      toast.error(`Mobile number must be ${10} digits.`);
      return;
    }
    addUser();
  };
  const addUser = async () => {
    try {
      const response  = await apiClient("POST", "/rbac", {
        name: addForm.name,
        mobile_no: addForm?.mobile,
        email: addForm?.email,
        role_id: Number(addForm?.role)
      })
      setAddForm({
        name: "",
        email: "",
        mobile: "",
        role: "",
      });
      fetchAdminUsers();
      setAddUserModal(false);
    } catch (e) {
      console.log(e);
    }
  }

  const handleEditPermissions = (idx) => {
    setPermEditUser(idx);
    setPermModalOpen(true);
  };

  const handlePermissionChange = (key, perm) => {
    setPermState((prev) => {
      let list = prev[key] || [];
      if (list.includes(perm)) {
        list = list.filter((p) => p !== perm);
      } else {
        list = [...list, perm];
      }
      return { ...prev, [key]: list };
    });
  };

  const handlePermissionSave = async () => {
    try {
      const response = await apiClient("POST", "/user-role", {
        user_id: updatedUsers[permEditUser].id,
        role_id: Number(editRole)
      })
      if(response.status) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      setPermModalOpen(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = (idx) => {
    // if (window.confirm("Delete this user?")) {
    //   setUserList(userList.filter((_, i) => i !== idx));
    // }
  };
  const handleStatusChange = (e) => {
    console.log(e);
  }
  const handleModalBgClick = (e) => {
    if (e.target.id === "perm-bg") setPermModalOpen(false);
    if (e.target.id === "add-user-bg") setAddUserModal(false);
  };

  const isSmallScreen = windowWidth < 640;
  const responsiveTextSize = isSmallScreen ? "text-xs" : "text-base";
  const responsiveButtonTextSize = isSmallScreen ? "text-sm" : "text-base";

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-blue-200 via-blue-100 to-blue-50"
      style={{ fontSize: isSmallScreen ? "12px" : "16px", lineHeight: 1.2 }}>
      {/* Users Table Section */}
      {/* <div className="flex flex-col items-center w-full max-w-full sm:max-w-7xl px-2 sm:px-6 mb-6 mx-auto mt-10 lg:mt-20">  */}
      <div className="flex flex-col items-center w-full max-w-full sm:max-w-7xl lg:max-w-[120rem] px-2 sm:px-6 mb-6 mx-auto mt-10 lg:mt-8">

        <div className="w-full bg-[white] border border-white/10 rounded-2xl shadow-2xl p-0 overflow-x-auto flex flex-col items-center justify-center">



          <div className="w-full flex items-center justify-between my-3 px-4 sm:px-6 lg:px-8">
            {/* Left Buttons - Bilkul left edge se */}
            <div className="flex items-center gap-4">
              <button
                className={`bg-blue-600 hover:bg-blue-700 text-white 
    px-3 py-1 text-[10px] sm:px-5 sm:py-2 sm:text-sm 
    rounded-xl font-semibold transition 
    ${activeTab === "users" ? "ring-2 ring-blue-900" : ""}`}
                onClick={() => setActiveTab("users")}
              >
                Users
              </button>

              <button
                className={`bg-blue-600 hover:bg-blue-700 text-white 
    px-3 py-1 text-[10px] sm:px-5 sm:py-2 sm:text-sm 
    rounded-xl font-semibold transition 
    ${activeTab === "roles" ? "ring-2 ring-blue-900" : ""}`}
                onClick={() => setActiveTab("roles")}
              >
                Role Management
              </button>
            </div>

            {/* Right Button - Bilkul right edge pe */}
            <div>
              <button
                onClick={() => setAddUserModal(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white 
    px-3 py-1 text-[10px] sm:px-5 sm:py-2 sm:text-sm 
    rounded-xl font-semibold transition whitespace-nowrap"
              >
                + Add User
              </button>
            </div>
          </div>



          {isSmallScreen ? (
            <div className="w-full max-w-full sm:max-w-7xl space-y-4 px-2">
              {userList.length === 0 && (
                <div className="text-center text-black py-6 text-xs">No users.</div>
              )}
              {loading && (
                <CustomLoader/>
              )}
              {!loading && userList.map((user, idx) => (
                <div
                  key={idx}
                  className="border border-white/20 rounded-lg bg-[white] p-4 shadow-lg"
                >
                  {/* Line 1: Name & Email side by side */}
                  <div className="flex justify-between items-center mb-2 text-[9px] font-semibold">
                    <div className="truncate max-w-[48%]">{user.name}</div>
                    <div className="truncate max-w-[48%]">{user.email}</div>
                  </div>
                  {/* Line 2: Mobile & Role side by side */}
                  <div className="flex justify-between items-center mb-2 text-[9px]">
                    <div>{user.mobile_no}</div>
                    <div className="bg-[oklch(88.5%_0.233_277.117)] rounded px-2 py-1 text-[10px] truncate max-w-[50%]">
                      {user.role?.name}
                    </div>
                  </div>
                  {/* Line 3: Created */}
                  <div className="italic text-[9px]">
                      {moment(user.createdAt).format("DD-MM-YYYY hh:mm A")}
                  </div>
                  {/* Actions */}
                  {activeTab === "roles" && (
                    <div className="flex gap-4 mt-3">
                      <button
                        onClick={() => {
                          const role_id = roleOptions?.find(role=> role.id === user?.role?.id)?.id;
                          console.log(role_id)
                          setEditRole(prev => role_id);
                          handleEditPermissions(idx)
                        }}
                        title="Edit Permissions"
                        className="bg-white border border-gray-300 hover:bg-[oklch(54.6%_0.245_262.881)] px-3 py-1 rounded-lg text-black text-xs flex-1 flex justify-center items-center transition-colors duration-300"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(idx)}
                        title="Delete User"
                        className="bg-white border border-gray-300 hover:bg-[oklch(29%_0.25_27)] px-3 py-1 rounded-lg text-red-500 text-xs flex-1 flex justify-center items-center transition-colors duration-300"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full px-4 pb-10 overflow-x-auto">
              {/* Users table */}
              <table
                className={`min-w-[600px] w-full border-separate border-spacing-y-2 text-left ${responsiveTextSize}`}
              >
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-black break-words">Name</th>
                    <th className="py-3 px-4 text-black break-words">Email</th>
                    <th className="py-3 px-4 text-black break-words">Mobile</th>
                    <th className="py-3 px-4 text-black break-words">Role</th>
                    <th className="py-3 px-4 text-black break-words">Created</th>
                    {activeTab === "roles" && (
                      <th className="py-3 px-4 text-black">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {!loading && userList.map((user, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-blue-950/60 transition rounded-xl"
                    >
                      <td className="px-4 py-3 text-black break-words">{user.name}</td>
                      <td className="px-4 py-3 text-black break-words">{user.email}</td>
                      <td className="px-4 py-3 text-black break-words">{user.mobile_no}</td>
                      <td className="px-4 py-3 break-words">
                        <span
                          className="bg-[oklch(88.5%_0.233_277.117)] p-4 text-[oklch(48.8%_0.243_264.376)] px-3 py-1 rounded-lg text-base truncate max-w-[150px]"
                          title={user.role?.name}
                        >
                          {user.role?.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-black break-words">
                        {moment(user.createdAt).format("DD-MM-YYYY hh:mm A")}
                      </td>
                      {activeTab === "roles" && (
                        <td className="px-4 py-3 flex gap-3">
                          <button
                            onClick={() => {
                              const role_id = roleOptions?.find(role=> role.id === user?.role?.id)?.id;
                              console.log(role_id)
                              setEditRole(prev => role_id);
                              handleEditPermissions(idx)
                            }}
                            title="Edit Permissions"
                            className="bg-white/60 border border-gray-300 p-4 rounded-lg hover:bg-blue-700 px-2 py-1 text-black"
                          >
                            <FiEdit size={18} />
                          </button>
                          <Switch
                            checked={user.status === "active"}
                            onChange={handleStatusChange}
                            slotProps={{ input: { 'aria-label': 'controlled' } }}
                          />
                          <button
                            onClick={() => handleDelete(idx)}
                            title="Delete User"
                            className="bg-white/60 border border-gray-300 p-4 rounded-lg hover:bg-red-900 px-2 py-1 text-red-500"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {userList.length === 0 && (
                    <tr>
                      <td
                        colSpan={activeTab === "roles" ? 6 : 5}
                        className="text-center py-6 text-black text-xs"
                      >
                        No users.
                      </td>
                    </tr>
                  )}
                  {loading && (
                    <tr>
                      <td
                        colSpan={activeTab === "roles" ? 6 : 5}
                        className="text-center py-6 text-black text-xs"
                      >
                        <CustomLoader />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>





      {/* Add User Modal */}
      {addUserModal && (
        <div id="add-user-bg" className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-1" onClick={handleModalBgClick}>
          <div className="w-full max-w-xs sm:max-w-md bg-[white] rounded-2xl shadow-2xl p-6 relative ring-2 ring-white/20" onClick={(e) => e.stopPropagation()} style={{ overflowWrap: "break-word" }}>
            <button className="absolute top-3 right-3 text-black text-xl" onClick={() => setAddUserModal(false)} title="Close Add User">
              <FiX />
            </button>
            <h2 className="text-black text-lg font-semibold mb-4 select-text" style={{ wordBreak: "break-word" }}>+ Add New User</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Enter full name"
                className="w-full bg-white-900 text-black placeholder-black border border-blue-400 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                required
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" placeholder="Enter mobile number"
                  className="flex-1 bg-white-900 text-black placeholder-black border border-blue-400 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={addForm.mobile}
                  maxLength={10}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setAddForm({ ...addForm, mobile: val });
                  }}
                  required
                />
              </div>
              <input type="email" placeholder="Enter email address"
                className="w-full bg-white-900 text-black placeholder-black border border-blue-400 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                required
              />
              <select className="w-full bg-white-900 text-black border border-blue-400 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={addForm.role? roleOptions.find((role)=> role.id === addForm.role)?.name: addForm.role}
                onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                required
              >
                <option value="">Select a role</option>
                {roleOptions.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              <button onClick={handleAddUser} className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2 font-semibold text-base transition">
                + Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permission Matrix Modal */}
      {permModalOpen && (
        <div
          id="perm-bg"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-1"
          onClick={handleModalBgClick}
        >
          <div
            className="w-full max-w-xs sm:max-w-3xl bg-[white] rounded-2xl shadow-2xl p-6 relative ring-2 ring-white/20 overflow-x-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-black text-xl sm:text-2xl"
              onClick={() => setPermModalOpen(false)}
              title="Close Permission Modal"
            >
              <FiX />
            </button>
            <h2
              className="text-black text-lg font-semibold mb-6 select-text"
              style={{ wordBreak: "break-word" }}
            >
              Permission Matrix
            </h2>
            <label className="block text-black font-bold mb-4">
              Role
              <select
                className="block w-full mt-2 bg-blue-900 text-white border border-blue-400 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                required
              >
                <option value="">Select a role</option>
                {roleOptions.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="table-container">
              <table className="scrollable-table w-full border-separate border-spacing-y-1 text-left text-[10px] sm:text-xs h-[75vh] overflow-auto">
                <thead>
                  <tr>
                    <th className="px-2 py-1 text-black break-words">Module</th>
                    <th className="px-2 py-1 text-black break-words">Submodule</th>
                    {permissionTypes.map((type) => (
                      <th key={type} className="px-2 py-1 text-black text-center break-words">
                        {type}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {modules.map((mod) => {
                    const key = `${mod.id}`;
                    return (
                      <React.Fragment key={key}>
                        {mod.submodule?.length > 0 ? (
                          mod.submodule.map((submod, index) => (
                            <tr key={`${mod.id}-${submod.id}`} className={index === mod.submodule?.length -1 ?"border-b border-black": ""}>
                              {index === 0 && ( // Display module details only for the first submodule of a module
                                <>
                                  <td rowSpan={mod.submodule?.length}>{mod.name}</td>
                                </>
                              )}
                              <td>{submod.name}</td>
                              {permissionTypes.map((type) => (
                                <td key={type} className="px-2 py-1 text-center">
                                  <input
                                    type="checkbox"
                                    className="accent-blue-500 w-3 h-3 sm:w-5 sm:h-5"
                                    checked={permState[key]?.includes(type) || false}
                                    onChange={() => handlePermissionChange(key, type)}
                                  />
                                </td>
                              ))}
                              {/* <td>{submod.status}</td> */}
                            </tr>
                          ))
                        ) : (
                          // Handle modules with no submodules
                          <tr key={mod.id} className="border-b">
                            <td>{mod.name}</td>
                            <td>{"-"}</td>
                              {permissionTypes.map((type) => (
                                <td key={type} className="px-2 py-1 text-center">
                                  <input
                                    type="checkbox"
                                    className="accent-blue-500 w-3 h-3 sm:w-5 sm:h-5"
                                    checked={permState[key]?.includes(type) || false}
                                    onChange={() => handlePermissionChange(key, type)}
                                  />
                                </td>
                              ))}
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-4 mt-6 flex-wrap">
              <button
                className="px-6 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white border border-blue-400 text-xs sm:text-base"
                onClick={() => setPermModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow text-xs sm:text-base"
                onClick={handlePermissionSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdatedRole;

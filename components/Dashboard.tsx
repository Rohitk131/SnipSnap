import React, { useState } from "react";

export default function Dashboard({
  user,
  onLogout,
  links,
  setLinks,
  newLink,
  setNewLink,
  linkTitle,
  setLinkTitle,
  handleSaveLink,
}) {
  const [editingLinkId, setEditingLinkId] = useState(null); // Track which link is being edited
  const [editedTitle, setEditedTitle] = useState(""); // Edited title
  const [editedUrl, setEditedUrl] = useState(""); // Edited URL

  // Function to handle editing a link
  const handleEditLink = (link) => {
    setEditingLinkId(link.id);
    setEditedTitle(link.title);
    setEditedUrl(link.url);
  };

  // Function to save the edited link
  const handleSaveEditedLink = async (linkId) => {
    try {
      const updatedLinks = links.map((link) =>
        link.id === linkId
          ? { ...link, title: editedTitle, url: editedUrl }
          : link
      );
      setLinks(updatedLinks);
      setEditingLinkId(null); // Exit edit mode
    } catch (error) {
      console.error("Error updating link:", error);
      alert(`Failed to update the link. Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-[400px] w-[320px] bg-gray-900 text-gray-100 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBvcGFjaXR5PSIwLjEiPgo8ZmlsdGVyIGlkPSJub2lzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+CiAgPGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNiIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPgo8L2ZpbHRlcj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIvPgo8L3N2Zz4=')]">
      <div className="flex flex-col min-h-[400px] p-4">
        {/* Header */}
        <div className="relative mb-6">
          <div className="absolute -top-3 -left-2 w-12 h-12 bg-blue-500/10 rounded-full blur-xl" />
          <div className="absolute -top-3 left-8 w-12 h-12 bg-purple-500/10 rounded-full blur-xl" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
            Welcome back
          </h2>
          <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={onLogout}
          className="px-4 py-2 text-sm font-medium text-gray-100 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50 shadow-sm"
        >
          Sign Out
        </button>

        {/* Add New Link Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-100">Add New Link</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              placeholder="Enter title"
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:border-blue-500/50 focus:bg-gray-800 transition-all duration-300 placeholder:text-gray-500 text-gray-100 shadow-sm"
            />
            <input
              type="url"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              placeholder="Enter URL"
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:border-blue-500/50 focus:bg-gray-800 transition-all duration-300 placeholder:text-gray-500 text-gray-100 shadow-sm"
            />
            <button
              onClick={handleSaveLink}
              className="w-full py-2 text-white font-medium bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Save Link
            </button>
          </div>
        </div>

        {/* Saved Links Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-100">Saved Links</h3>
          <div className="space-y-3">
            {links.length > 0 ? (
              links.map((link) => (
                <div
                  key={link.id}
                  className="group p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-800 transition-all duration-300 shadow-sm"
                >
                  {editingLinkId === link.id ? (
                    // Edit Mode
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="w-full px-2 py-1 bg-gray-700/50 border border-gray-600/50 rounded-md focus:outline-none focus:border-blue-500/50 text-gray-100"
                      />
                      <input
                        type="url"
                        value={editedUrl}
                        onChange={(e) => setEditedUrl(e.target.value)}
                        className="w-full px-2 py-1 bg-gray-700/50 border border-gray-600/50 rounded-md focus:outline-none focus:border-blue-500/50 text-gray-100"
                      />
                      <button
                        onClick={() => handleSaveEditedLink(link.id)}
                        className="w-full py-1 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-all duration-300"
                      >
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    // View Mode
                    <div>
                      <h4 className="text-md font-medium text-gray-100 mb-1">
                        {link.title}
                      </h4>
                      <p className="text-sm text-gray-400 break-all">{link.url}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(link.timestamp).toLocaleString()}
                      </p>
                      <button
                        onClick={() => handleEditLink(link)}
                        className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors duration-300"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-4 px-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <p className="text-gray-400">No links saved yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
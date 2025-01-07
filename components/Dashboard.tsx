import React, { useState } from "react";
import { IconLogout, IconEdit, IconCopy, IconTrash, IconCheck, IconX } from '@tabler/icons-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Toast } from "./ui/use-toast";

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
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedUrl, setEditedUrl] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleEditLink = (link) => {
    setEditingLinkId(link.id);
    setEditedTitle(link.title);
    setEditedUrl(link.url);
  };

  const handleSaveEditedLink = async (linkId) => {
    try {
      if (!editedTitle.trim() || !editedUrl.trim()) {
        Toast({ title: "Error", description: "Title and URL are required", variant: "destructive" });
        return;
      }
      const updatedLinks = links.map((link) =>
        link.id === linkId ? { ...link, title: editedTitle, url: editedUrl } : link
      );
      setLinks(updatedLinks);
      setEditingLinkId(null);
      Toast({ title: "Success", description: "Link updated successfully" });
    } catch (error) {
      Toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteLink = (linkId) => {
    const updatedLinks = links.filter((link) => link.id !== linkId);
    setLinks(updatedLinks);
    Toast({ title: "Success", description: "Link deleted successfully" });
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    Toast({ title: "Success", description: "Link copied to clipboard" });
  };

  const handleAddNewLink = () => {
    if (!linkTitle.trim() || !newLink.trim()) {
      Toast({ title: "Error", description: "Title and URL are required", variant: "destructive" });
      return;
    }
    handleSaveLink();
    setShowAddDialog(false);
    setLinkTitle("");
    setNewLink("");
  };

  return (
    <div className="min-h-screen w-full max-w-4xl mx-auto bg-gray-900 text-gray-100 p-6">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
          <div className="flex flex-col items-start justify-center">
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-12 h-12 bg-blue-500/10 rounded-full blur-xl" />
              <div className="absolute -top-2 left-6 w-12 h-12 bg-purple-500/10 rounded-full blur-xl" />
              <h1 className="text-2xl font-bold">
                SNIP<span className="text-emerald-400">SNAP</span>
              </h1>
            </div>
            <span className="text-sm text-gray-400">{user?.email}</span>
          </div>
          <Button
       
            size="icon"
            onClick={onLogout}
            className="hover:bg-red-600/30"
          >
            <IconLogout className="h-5 w-5" color="red" />
          </Button>
        </div>

        {/* Quick Add Button */}
        <Button
          onClick={() => setShowAddDialog(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
        >
          Add New Link
        </Button>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {links.map((link) => (
            <div
              key={link.id}
              className="group px-2  bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300"
            >
              {editingLinkId === link.id ? (
                <div className="">
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    placeholder="Enter title"
                    className="bg-gray-700/50"
                  />
                  <Input
                    value={editedUrl}
                    onChange={(e) => setEditedUrl(e.target.value)}
                    placeholder="Enter URL"
                    className="bg-gray-700/50"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleSaveEditedLink(link.id)}
                    >
                      <IconCheck className="h-4 w-4 text-green-400" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingLinkId(null)}
                    >
                      <IconX className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-0">
                    <h3 className="font-medium text-lg text-gray-100">
                      {link.title}
                    </h3>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEditLink(link)}
                      >
                        <IconEdit className="h-4 w-4 text-blue-400" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleCopyLink(link.url)}
                      >
                        <IconCopy className="h-4 w-4 text-green-400" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteLink(link.id)}
                      >
                        <IconTrash className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-blue-400 break-all "
                  >
                    {link.url}
                  </a>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(link.timestamp).toLocaleString()}
                  </p>
                </>
              )}
            </div>
          ))}
          {links.length === 0 && (
            <div className="col-span-full text-center p-8 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <p className="text-gray-400">No links saved yet. Add your first link!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Link Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-slate-800 backdrop-blur-xl py-2 rounded-xl border-gray-700">
          <DialogHeader>
            <DialogTitle>Add New Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              placeholder="Enter title"
              className="bg-gray-700/30"
            />
            <Input
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              placeholder="Enter URL"
              className="bg-gray-700/30"
            />
            <div className="flex justify-end space-x-2">
              <Button className="color-white" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNewLink}>Save Link</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
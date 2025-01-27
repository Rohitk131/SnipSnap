import React, { useState } from "react";
import { IconLogout, IconEdit, IconCopy, IconTrash } from '@tabler/icons-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Toast } from "./ui/use-toast";
import { updateLinkInFirebase, deleteLinkFromFirebase } from "../firebase/linkService";

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
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedUrl, setEditedUrl] = useState("");

  const handleEditLink = (link) => {
    setEditingLink(link);
    setEditedTitle(link.title || "");
    setEditedUrl(link.url || "");
    setShowEditDialog(true);
  };

  const handleSaveEditedLink = async () => {
    try {
      if (!editedTitle.trim() || !editedUrl.trim()) {
        Toast({ title: "Error", description: "Title and URL are required", variant: "destructive" });
        return;
      }

      // Create updated link object
      const updatedLink = {
        ...editingLink,
        title: editedTitle.trim(),
        url: editedUrl.trim(),
        timestamp: Date.now()
      };

      // Update in Firebase first
      await updateLinkInFirebase(user.uid, editingLink.id, updatedLink);

      // Update local state
      const updatedLinks = links.map(link =>
        link.id === editingLink.id ? updatedLink : link
      );

      setLinks(updatedLinks);
      setShowEditDialog(false);
      setEditingLink(null);
      setEditedTitle("");
      setEditedUrl("");

      Toast({ title: "Success", description: "Link updated successfully" });
    } catch (error) {
      console.error("Error updating link:", error);
      Toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteLink = async (linkId) => {
    try {
      await deleteLinkFromFirebase(user.uid, linkId);
      const updatedLinks = links.filter((link) => link.id !== linkId);
      setLinks(updatedLinks);
      Toast({ title: "Success", description: "Link deleted successfully" });
    } catch (error) {
      console.error("Error deleting link:", error);
      Toast({ title: "Error", description: error.message, variant: "destructive" });
    }
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
          <Button size="icon" onClick={onLogout} className="hover:bg-red-600/30">
            <IconLogout className="h-5 w-5" color="red" />
          </Button>
        </div>

        <Button
          onClick={() => setShowAddDialog(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
        >
          Add New Link
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {links.map((link) => (
            <div
              key={link.id}
              className="group bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-row justify-between">
                    <h3 className="font-medium text-sm text-gray-100 truncate">
                      {link.title}
                    </h3>
                    <div className="flex flex-row items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => handleEditLink(link)}
                      >
                        <IconEdit className="h-3 w-3 text-blue-400" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => handleCopyLink(link.url)}
                      >
                        <IconCopy className="h-3 w-3 text-green-400" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => handleDeleteLink(link.id)}
                      >
                        <IconTrash className="h-3 w-3 text-red-400" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-400 hover:text-blue-400 truncate flex-1"
                    >
                      {link.url}
                    </a>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(link.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {links.length === 0 && (
            <div className="col-span-full text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <p className="text-gray-400 text-sm">No links saved yet. Add your first link!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Link Dialog */}
      {/* Add Link Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md bg-slate-900/95 backdrop-blur-xl rounded-xl border border-slate-800 p-6 shadow-2xl">
          <DialogHeader className="space-y-3 mb-6">
            <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Add New Link
            </DialogTitle>
            <p className="text-slate-400 text-sm font-normal">
              Add a new link to your collection with a title and URL
            </p>
          </DialogHeader>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Title</label>
              <Input
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                placeholder="Enter a memorable title"
                className="bg-slate-800/50 border-slate-700 h-10 rounded-lg placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">URL</label>
              <Input
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="https://example.com"
                className="bg-slate-800/50 border-slate-700 h-10 rounded-lg placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                onClick={() => setShowAddDialog(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddNewLink}
                className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white shadow-lg shadow-blue-500/20"
              >
                Save Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Link Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md bg-slate-900/95 backdrop-blur-xl rounded-xl border border-slate-800 p-6 shadow-2xl">
          <DialogHeader className="space-y-3 mb-6">
            <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Edit Link
            </DialogTitle>
            <p className="text-slate-400 text-sm font-normal">
              Update the details of your saved link
            </p>
          </DialogHeader>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Title</label>
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Enter a memorable title"
                className="bg-slate-800/50 border-slate-700 h-10 rounded-lg placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">URL</label>
              <Input
                value={editedUrl}
                onChange={(e) => setEditedUrl(e.target.value)}
                placeholder="https://example.com"
                className="bg-slate-800/50 border-slate-700 h-10 rounded-lg placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                onClick={() => {
                  setShowEditDialog(false);
                  setEditingLink(null);
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEditedLink}
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-lg shadow-purple-500/20"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
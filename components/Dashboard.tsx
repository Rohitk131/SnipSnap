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

  const getAIBadge = (url: string) => {
    if (url.includes("chatgpt.com")) {
      return (
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-500/20 text-green-500">
          ChatGPT
        </span>
      );
    } else if (url.includes("claude.ai")) {
      return (
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-500/20 text-purple-500">
          Claude
        </span>
      );
    } else if (url.includes("chat.deepseek.com")) {
      return (
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500/20 text-blue-500">
          DeepSeek
        </span>
      );
    } else if (url.includes("perplexity.ai")) {
      return (
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-500/20 text-orange-500">
          Perplexity
        </span>
      );
    }
    return null;
  };
  
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
          className="w-full bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-700 hover:to-green-600"
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
                    {getAIBadge(link.url)}
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
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md bg-black/20 backdrop-blur-sm rounded-lg border border-gray-800 p-6 shadow-xl w-80">
          <DialogHeader className="mb-3">
            <DialogTitle className="text-xl font-medium text-gray-200">
              Add New Link
            </DialogTitle>
            
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Title</label>
              <Input
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                placeholder="Enter a memorable title"
                className="w-full h-10 bg-gray-800/50 border border-gray-700 rounded-lg px-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">URL</label>
              <Input
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="https://example.com"
                className="w-full h-10 bg-gray-800/50 border border-gray-700 rounded-lg px-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-gray-600"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={() => setShowAddDialog(false)}
                className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddNewLink}
                className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg shadow"
              >
                Save Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Link Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md bg-black/20 backdrop-blur-sm rounded-lg border border-gray-800 p-6 shadow-xl w-80">
          <DialogHeader className="mb-3">
            <DialogTitle className="text-xl font-medium text-gray-200">
              Edit Link
            </DialogTitle>
           
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Title</label>
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Enter a memorable title"
                className="w-full h-10 bg-gray-800/50 border border-gray-700 rounded-lg px-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">URL</label>
              <Input
                value={editedUrl}
                onChange={(e) => setEditedUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full h-10 bg-gray-800/50 border border-gray-700 rounded-lg px-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-gray-600"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={() => {
                  setShowEditDialog(false);
                  setEditingLink(null);
                }}
                className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEditedLink}
                className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg shadow"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <footer className="fixed bottom-0 w-full bg-gray-900 text-white text-center py-0 shadow-md">
    Made by <a href="https://rohitk.me/" target="_blank" className="text-blue-400 hover:underline">Rohit Kumar</a>
</footer>
    </div>
  );
}
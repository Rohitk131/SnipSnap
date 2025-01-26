// content.ts
import cssText from "data-text:~style.css";
import type { PlasmoCSConfig } from "plasmo";
import { useEffect, type FC, useState } from "react";
import useFirebaseUser from "../firebase/useFirebaseUser";

export const config: PlasmoCSConfig = {
  matches: ["https://chatgpt.com/*", "https://claude.ai/*"],
};

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};
const AIAssistantButton: FC = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial auth state
    chrome.storage.local.get(['authUser'], (result) => {
      console.log("Content: Auth state from storage", result.authUser);
      setUser(result.authUser || null);
      setIsLoading(false);
    });

    // Listen for auth state changes
    const handleAuthChange = (changes, namespace) => {
      if (namespace === 'local' && changes.authUser) {
        console.log("Content: Auth state changed", changes.authUser.newValue);
        setUser(changes.authUser.newValue);
      }
    };
    chrome.storage.onChanged.addListener(handleAuthChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleAuthChange);
    };
  }, []);

  const handleClick = async () => {
    if (!user) {
      alert("Please log in first");
      return;
    }

    try {
      console.log("Content: Sending save link request");
      chrome.runtime.sendMessage({
        type: 'SAVE_LINK',
        payload: {
          title: document.title,
          url: window.location.href,
          timestamp: Date.now()
        }
      }, (response) => {
        console.log("Content: Received response", response);
        if (response?.success) {
          alert("Link saved successfully!");
        } else {
          alert("Failed to save link: " + (response?.error || "Unknown error"));
        }
      });
    } catch (error) {
      console.error("Content: Error saving link", error);
      alert("Failed to save link");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <button 
      className="ai-assistant-button" 
      onClick={handleClick}
     
    >
      Save this Chat
    </button>
  );
};

const ContentScript = () => {
  useEffect(() => {
    const injectButton = () => {
      const currentURL = window.location.href;

      if (currentURL.includes("chat.openai.com")) {
        // ChatGPT injection
        const savePdfContainer = document.querySelector(".chatGptToPdf-btn-group");
        if (savePdfContainer && !savePdfContainer.querySelector(".ai-assistant-button")) {
          const container = document.createElement("div");
          container.className = "plasmo-csui-container";
          savePdfContainer.insertBefore(container, savePdfContainer.querySelector("#chatGptToPdf-dropdown-toggle"));
        }
      } else if (currentURL.includes("claude.ai")) {
        // Claude AI injection
        const claudeTarget = document.querySelector("header");
        if (claudeTarget && !document.querySelector(".plasmo-csui-container")) {
          const container = document.createElement("div");
          container.className = "plasmo-csui-container";
          claudeTarget.appendChild(container);
        }
      }
    };

    // Initial injection
    injectButton();

    // Watch for dynamic content changes
    const observer = new MutationObserver(() => {
      injectButton();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return <AIAssistantButton />;
};

export default ContentScript;
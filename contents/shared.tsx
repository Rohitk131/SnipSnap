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
  const [buttonState, setButtonState] = useState('idle'); // 'idle' | 'saving' | 'saved'

  useEffect(() => {
    chrome.storage.local.get(['authUser'], (result) => {
      setUser(result.authUser || null);
    });

    const handleAuthChange = (changes, namespace) => {
      if (namespace === 'local' && changes.authUser) {
        setUser(changes.authUser.newValue);
      }
    };
    chrome.storage.onChanged.addListener(handleAuthChange);

    return () => chrome.storage.onChanged.removeListener(handleAuthChange);
  }, []);

  const handleClick = async () => {
    if (!user) {
      alert("Please login first!");
      return;
    }

    try {
      setButtonState('saving');
      chrome.runtime.sendMessage({
        type: 'SAVE_LINK',
        payload: {
          title: document.title,
          url: window.location.href
        }
      }, (response) => {
        if (response?.success) {
          setButtonState('saved');
          setTimeout(() => setButtonState('idle'), 2000); // Reset after 2 seconds
        } else {
          setButtonState('idle');
          alert("Failed to save link: " + (response?.error || "Unknown error"));
        }
      });
    } catch (error) {
      console.error("Error:", error);
      setButtonState('idle');
      alert("Failed to save link");
    }
  };

  const getButtonText = () => {
    switch (buttonState) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved!';
      default:
        return 'Save Chat';
    }
  };

  const getSaveIcon = () => {
    if (buttonState === 'saved') {
      return (
        <svg 
          style={{
            width: '20px',
            height: '20px'
          }}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 13l4 4L19 7"
          />
        </svg>
      );
    }

    return (
      <svg 
        style={{
          width: '20px',
          height: '20px',
          animation: buttonState === 'saving' ? 'spin 1s linear infinite' : 'none'
        }}
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" 
        />
      </svg>
    );
  };

  return (
    <button 
      onClick={handleClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        background: buttonState === 'saved' 
          ? 'linear-gradient(to right, #059669, #10b981)'
          : 'linear-gradient(to right, #10b981, #34d399)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: buttonState === 'saving' ? 'wait' : 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
        margin: '8px',
        opacity: buttonState === 'saving' ? '0.8' : '1',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        if (buttonState !== 'saving') {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.25)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.15)';
      }}
      disabled={buttonState === 'saving'}
    >
      {getSaveIcon()}
      {getButtonText()}
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
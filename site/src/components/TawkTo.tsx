import { useEffect } from "react";

// Tawk.to Configuration (updated credentials)
const TAWK_TO_PROPERTY_ID = "692d420fb93a681983f687eb";
const TAWK_TO_WIDGET_ID = "1jbcck3fl";

export const TawkTo: React.FC = () => {
  useEffect(() => {
    // Check if Tawk.to script is already loaded
    if (window.Tawk_API) {
      return;
    }

    // Create and inject Tawk.to script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://embed.tawk.to/${TAWK_TO_PROPERTY_ID}/${TAWK_TO_WIDGET_ID}`;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    // Add script to document
    const firstScript = document.getElementsByTagName("script")[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.body.appendChild(script);
    }

    // Optional: Customize Tawk.to behavior
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Customize widget appearance with yellow brand color
    window.Tawk_API.onLoad = function () {
      // Set widget color to yellow (#facc15)
      if (window.Tawk_API && window.Tawk_API.setAttributes) {
        window.Tawk_API.setAttributes(
          {
            color: {
              widget: "#facc15", // Yellow brand color
              chat: "#facc15", // Yellow for chat elements
            },
          },
          function (error: any) {
            if (error) {
              console.log("Tawk.to customization error:", error);
            }
          }
        );
      }

      // Note: Widget icon/avatar must be changed in Tawk.to Dashboard
      // Go to: Administration → Channels → Chat Widget → Widget Icon
      // Select "Default Chat Icon" instead of "User Avatar"
    };

    // Cleanup function
    return () => {
      // Note: Tawk.to script doesn't need to be removed on cleanup
      // as it's a persistent chat widget
    };
  }, []);

  return null;
};

// Extend Window interface to include Tawk.to types
declare global {
  interface Window {
    Tawk_API?: {
      hideWidget?: () => void;
      showWidget?: () => void;
      toggle?: () => void;
      maximize?: () => void;
      minimize?: () => void;
      onLoad?: () => void;
      [key: string]: any;
    };
    Tawk_LoadStart?: Date;
  }
}

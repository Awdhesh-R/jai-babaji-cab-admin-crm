"use client";

import { useEffect } from "react";

export default function DevToolsProtection({ enabled = true }) {
  useEffect(() => {
    // If protection is disabled (development mode), don't apply any protections
    if (!enabled) {
      return;
    }
    // Disable right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts for DevTools
    const handleKeyDown = (e) => {
      // F12 - Open DevTools
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I - Open DevTools
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+J - Open Console
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+C - Open DevTools (Element Inspector)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
      }
      // Ctrl+U - View Source
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }
      // Ctrl+S - Save Page
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        return false;
      }
      // Ctrl+P - Print (can reveal source)
      if (e.ctrlKey && e.keyCode === 80) {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+K - Firefox Console
      if (e.ctrlKey && e.shiftKey && e.keyCode === 75) {
        e.preventDefault();
        return false;
      }
    };

    // Disable drag
    const handleDragStart = (e) => {
      e.preventDefault();
      return false;
    };

    // DevTools detection using multiple methods
    let devToolsOpen = false;
    let devToolsOpenCount = 0;
    let falsePositiveCount = 0;
    let detectionInterval = null;
    const threshold = 160; // Threshold for detecting DevTools
    const requiredConsecutiveDetections = 3; // Require multiple detections to avoid false positives

    const detectDevTools = () => {
      // Only detect if page is visible and focused (avoid false positives during navigation)
      if (document.hidden || !document.hasFocus()) {
        // Reset counters when page is not visible to avoid false positives
        falsePositiveCount = 0;
        return;
      }

      // Method 1: Check window dimensions (more accurate check)
      // Only check if window is actually resized, not just different
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      const widthThreshold =
        widthDiff > threshold && widthDiff < window.outerWidth * 0.8; // Reasonable bounds
      const heightThreshold =
        heightDiff > threshold && heightDiff < window.outerHeight * 0.8;

      // Method 2: Check console (using getter property)
      let devtools = { open: false };
      try {
        const element = new Image();
        Object.defineProperty(element, "id", {
          get: function () {
            devtools.open = true;
            return "";
          },
        });
        // Trigger the getter
        const _ = element.id;
      } catch (e) {
        // Ignore errors
      }

      // Method 3: Function toString detection
      let devToolsDetected = false;
      try {
        const funcToString = Function.prototype.toString;
        devToolsDetected =
          funcToString.toString().length !==
          funcToString.call(funcToString).length;
      } catch (e) {
        // Ignore errors
      }

      // Require at least 2 methods to be positive OR console method (most reliable)
      const detectionMethods = [
        widthThreshold,
        heightThreshold,
        devtools.open,
        devToolsDetected,
      ];
      const positiveDetections = detectionMethods.filter(Boolean).length;
      const isDetected = devtools.open || positiveDetections >= 2;

      if (isDetected) {
        devToolsOpenCount++;
        falsePositiveCount = 0; // Reset false positive counter

        // Only trigger after multiple consecutive detections to avoid false positives
        if (
          devToolsOpenCount >= requiredConsecutiveDetections &&
          !devToolsOpen
        ) {
          devToolsOpen = true;
          // Clear console
          console.clear();

          // Show warning in console
          console.log(
            "%c WARNING !",
            "color: red; font-size: 50px; font-weight: bold;"
          );
          console.log(
            "%cDeveloper tools are not allowed on this application.",
            "color: red; font-size: 20px;"
          );
          console.log(
            "%cPlease close the developer tools to continue.",
            "color: red; font-size: 16px;"
          );
        }
      } else {
        // If not detected, increment false positive counter
        falsePositiveCount++;

        // If we have multiple non-detections, reset the detection counter
        if (falsePositiveCount >= 2 && devToolsOpenCount > 0) {
          devToolsOpenCount = Math.max(0, devToolsOpenCount - 1);
        }

        // If consistently not detected, reset state
        if (falsePositiveCount >= requiredConsecutiveDetections) {
          if (devToolsOpen) {
            devToolsOpen = false;
            devToolsOpenCount = 0;
            falsePositiveCount = 0;
          }
        }
      }
    };

    // Wait a bit after page load before starting detection (avoid false positives during initialization)
    const startDetection = () => {
      // Initial check after a short delay
      setTimeout(() => {
        detectDevTools();
        // Then start continuous detection
        detectionInterval = setInterval(detectDevTools, 500);
      }, 1000); // 1 second delay to avoid false positives during page load
    };

    startDetection();

    // Override console methods to prevent logging
    const noop = () => {};
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;
    const originalDebug = console.debug;

    // Optionally disable console (can be too aggressive)
    // console.log = noop;
    // console.error = noop;
    // console.warn = noop;
    // console.info = noop;
    // console.debug = noop;

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);

    // Pause detection when page is hidden (avoid false positives during tab switches)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, pause detection
        if (detectionInterval) {
          clearInterval(detectionInterval);
          detectionInterval = null;
        }
        // Reset counters to avoid false positives when coming back
        falsePositiveCount = 0;
        if (devToolsOpenCount > 0 && !devToolsOpen) {
          devToolsOpenCount = Math.max(0, devToolsOpenCount - 1);
        }
      } else {
        // Page is visible again, resume detection after a short delay
        if (!detectionInterval) {
          setTimeout(() => {
            if (!detectionInterval) {
              detectionInterval = setInterval(detectDevTools, 500);
            }
          }, 500);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function
    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      // Restore console methods
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
      console.debug = originalDebug;
    };
  }, [enabled]);

  return null;
}

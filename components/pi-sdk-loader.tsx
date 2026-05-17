"use client";

import Script from "next/script";

export function PiSdkLoader() {
  return (
    <Script
      src="https://sdk.minepi.com/pi-sdk.js"
      strategy="afterInteractive"
      onLoad={() => {
        if ((window as any).Pi) {
          (window as any).Pi.init({
            version: "2.0",
            sandbox: true,
          });

          console.log("Pi SDK initialized");
        } else {
          console.log("Pi SDK not detected");
        }
      }}
    />
  );
}
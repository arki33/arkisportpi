"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { PI_NETWORK_CONFIG } from "@/lib/system-config";
import type {
  Product,
  SDKLiteInstance,
  UserPurchaseBalance,
} from "@/lib/sdklite-types";

const COMMUNICATION_REQUEST_TYPE =
  "@pi:app:sdk:communication_information_request";

/* ---------------- SAFE HELPERS ---------------- */

function isBrowser() {
  return typeof window !== "undefined";
}

function isInIframe(): boolean {
  if (!isBrowser()) return false;

  try {
    return window.self !== window.top;
  } catch (error) {
    return false;
  }
}

/* ---------------- MESSAGE PARSER ---------------- */

function parseJsonSafely(value: any): any {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return typeof value === "object" && value !== null ? value : null;
}

/* ---------------- PARENT CREDENTIALS ---------------- */

function requestParentCredentials(): Promise<{
  accessToken: string;
  appId: string | null;
} | null> {
  if (!isBrowser() || !isInIframe()) {
    return Promise.resolve(null);
  }

  const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const timeoutMs = 1500;

  return new Promise((resolve) => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const cleanup = (listener: (event: MessageEvent) => void) => {
      window.removeEventListener("message", listener);
      clearTimeout(timeoutId);
    };

    const messageListener = (event: MessageEvent) => {
      if (event.source !== window.parent) return;

      const data = parseJsonSafely(event.data);
      if (
        !data ||
        data.type !== COMMUNICATION_REQUEST_TYPE ||
        data.id !== requestId
      ) {
        return;
      }

      cleanup(messageListener);

      const payload =
        typeof data.payload === "object" && data.payload !== null
          ? data.payload
          : {};

      const accessToken =
        typeof payload.accessToken === "string"
          ? payload.accessToken
          : null;

      const appId =
        typeof payload.appId === "string" ? payload.appId : null;

      resolve(accessToken ? { accessToken, appId } : null);
    };

    timeoutId = setTimeout(() => {
      cleanup(messageListener);
      resolve(null);
    }, timeoutMs);

    window.addEventListener("message", messageListener);

    window.parent.postMessage(
      JSON.stringify({
        type: COMMUNICATION_REQUEST_TYPE,
        id: requestId,
      }),
      "*"
    );
  });
}

/* ---------------- CONTEXT TYPES ---------------- */

interface PiAuthContextType {
  isAuthenticated: boolean;
  authMessage: string;
  hasError: boolean;
  sdk: SDKLiteInstance | null;
  products: Product[] | null;
  restoredPurchases: UserPurchaseBalance[] | null;
  reinitialize: () => Promise<void>;
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

/* ---------------- LOADERS ---------------- */

const loadPiSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!isBrowser()) return reject(new Error("No browser"));

    if (typeof window.Pi !== "undefined") return resolve();

    const script = document.createElement("script");
    script.src = PI_NETWORK_CONFIG.SDK_URL;
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Pi SDK script"));

    document.head.appendChild(script);
  });
};

const loadSDKLite = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!isBrowser()) return reject(new Error("No browser"));

    if (typeof window.SDKLite !== "undefined") return resolve();

    const script = document.createElement("script");
    script.src = PI_NETWORK_CONFIG.SDK_LITE_URL;
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load SDKLite script"));

    document.head.appendChild(script);
  });
};

/* ---------------- PROVIDER ---------------- */

export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMessage, setAuthMessage] = useState(
    "Initializing Pi Network..."
  );
  const [hasError, setHasError] = useState(false);
  const [sdk, setSdk] = useState<SDKLiteInstance | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [restoredPurchases, setRestoredPurchases] = useState<
    UserPurchaseBalance[] | null
  >(null);

  const fetchProducts = async (sdkInstance: SDKLiteInstance) => {
    try {
      const { products } = await sdkInstance.state.products();
      setProducts(products);
    } catch {
      setProducts([]);
    }
  };

  const initialize = async () => {
    if (!isBrowser()) return;

    setHasError(false);
    setRestoredPurchases(null);

    try {
      const parentCredentials = await requestParentCredentials();

      if (parentCredentials) {
        setIsAuthenticated(true);
        return;
      }

      setAuthMessage("Loading Pi SDK...");
      await loadPiSDK();

      setAuthMessage("Initializing Pi...");
      await window.Pi?.init({
        version: "2.0",
        sandbox: PI_NETWORK_CONFIG.SANDBOX,
      });

      setAuthMessage("Loading SDKLite...");
      await loadSDKLite();

      setAuthMessage("Initializing SDKLite...");
      const sdkInstance = await window.SDKLite.init();

      setAuthMessage("Logging in...");
      const success = await sdkInstance.login();

      if (!success) throw new Error("Login failed");

      setSdk(sdkInstance);
      setIsAuthenticated(true);

      await fetchProducts(sdkInstance);

      try {
        const { purchases } = await sdkInstance.state.restore();
        setRestoredPurchases(purchases);
      } catch {
        setRestoredPurchases([]);
      }
    } catch (err) {
      setHasError(true);
      setAuthMessage(
        err instanceof Error
          ? err.message
          : "Authentication failed"
      );
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <PiAuthContext.Provider
      value={{
        isAuthenticated,
        authMessage,
        hasError,
        sdk,
        products,
        restoredPurchases,
        reinitialize: initialize,
      }}
    >
      {children}
    </PiAuthContext.Provider>
  );
}

/* ---------------- HOOK ---------------- */

export function usePiAuth() {
  const context = useContext(PiAuthContext);
  if (!context) {
    throw new Error("usePiAuth must be used within PiAuthProvider");
  }
  return context;
}
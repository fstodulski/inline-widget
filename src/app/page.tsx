"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

declare global {
  interface IframeStyles {
    backgroundColor: string;
    width: string;
    height: string;
    border: string;
    display: string;
    zIndex: number;
  }

  interface MamoPayOptions {
    rootId: string;
    paymentLinkUrl: string;
    iframeId?: string;
  }

  interface IncomingEvent {
    type: "data";
    data: {
      prefilledCustomer?: {
        first_name?: string;
        last_name?: string;
        email?: string;
      };
      amount?: number;
      currency?: string;
      external_id?: string;
    };
  }

  class MamoPay {
    constructor(options: MamoPayOptions);
    addIframeToWebsite(): void;
    sendDataToIframe(data: IncomingEvent): void;
  }

  interface Window {
    MamoPay: typeof MamoPay;
  }
}

export default function Home() {
  const mamoRef = useRef<MamoPay>();
  const [isReady, setIsReady] = useState(false);

  const queryParams = useSearchParams();

  useEffect(() => {
    const paymentLinkUrl = queryParams.get("paymentLinkUrl");

    if (!paymentLinkUrl) return;

    const initializeMamo = () => {
      if (window.MamoPay) {
        mamoRef.current = new window.MamoPay({
          rootId: "mamo-checkout",
          paymentLinkUrl,
        });
        console.log("mamoRef.current", mamoRef.current);

        mamoRef.current.addIframeToWebsite();

        mamoRef.current.sendDataToIframe({
          type: "data",
          data: {
            amount: 50,
            currency: "USD",
            prefilledCustomer: {
              first_name: "John",
              last_name: "Doe",
              email: "john.doe@example.com",
            },
          },
        });

        setIsReady(true);
      }
    };

    // Check if the script is already loaded
    if (window.MamoPay) {
      initializeMamo();
    } else {
      // Poll for the script to be loaded
      const interval = setInterval(() => {
        if (window.MamoPay) {
          clearInterval(interval);
          initializeMamo();
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, []);

  const sendData = () => {
    if (!mamoRef.current || !isReady) return;

    mamoRef.current.sendDataToIframe({
      type: "data",
      data: {
        amount: 50,
        currency: "USD",
        prefilledCustomer: {
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
        },
      },
    });
  };

  return (
    <main className="h-screen w-full bg-white px-20 pt-40">
      <button
        className="rounded-md bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
        type="button"
        onClick={sendData}
        disabled={!isReady}
      >
        Send Data
      </button>

      <div id="mamo-checkout" className="h-full w-full" />
    </main>
  );
}

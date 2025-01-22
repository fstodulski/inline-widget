"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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

    // Payment events
    onPaymentFailed?: () => void;
    onPaymentComplete?: () => void;
    onPaymentAborted?: () => void;
    onPaymentTriggered?: () => void;

    // Form events
    onFormValid?: () => void;
    onFormInvalid?: () => void;
    onFormLoaded?: () => void;
    onFormSubmitted?: () => void;

    // Iframe events
    onIframeLoaded?: (data: Record<string, unknown>) => void;
  }

  class MamoPay {
    constructor(options: MamoPayOptions);
    addIframeToWebsite(): void;
    sendDataToIframe(data: unknown): void;
    triggerPayment(): void;
  }

  interface Window {
    MamoPay: typeof MamoPay;
  }
}

export default function Home() {
  const mamoRef = useRef<MamoPay>(null);
  const [isReady, setIsReady] = useState(false);

  const queryParams = useSearchParams();

  useEffect(() => {
    const paymentLinkUrl = queryParams.get("paymentLinkUrl");
    const amount = queryParams.get("amount");
    const currency = queryParams.get("currency");
    const first_name = queryParams.get("first_name");
    const last_name = queryParams.get("last_name");
    const email = queryParams.get("email");

    if (!paymentLinkUrl) return;

    const initializeMamo = () => {
      if (window.MamoPay) {
        mamoRef.current = new window.MamoPay({
          rootId: "mamo-checkout",
          paymentLinkUrl,
          onFormValid: () => {
            console.log("onFormValid");

            toast.success("Form is valid");
          },
          onFormInvalid: () => {
            console.log("onFormInvalid");
            toast.error("Form is invalid");
          },
          onFormLoaded: () => {
            console.log("onFormLoaded");
          },
          onFormSubmitted: () => {
            console.log("onFormSubmitted");
          },
          onPaymentFailed: () => {
            console.log("onPaymentFailed");
            toast.error("Payment failed");
          },
          onPaymentComplete: () => {
            console.log("onPaymentComplete");
            toast.success("Payment complete");
          },
          onPaymentTriggered: () => {
            console.log("onPaymentTriggered");
          },
          onPaymentAborted: () => {
            console.log("onPaymentAborted");
            toast.error("Payment aborted");
          },
          onIframeLoaded: (data) => {
            console.log("onIframeLoaded", data);
          },
        });
        console.log("mamoRef.current", mamoRef.current);

        mamoRef.current.addIframeToWebsite();

        mamoRef.current.sendDataToIframe({
          type: "data",
          data: {
            amount: Number(amount),
            currency: currency || undefined,
            prefilledCustomer: {
              email: email || undefined,
              first_name: first_name || undefined,
              last_name: last_name || undefined,
            },
            external_id: "123",
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
  }, [queryParams]);

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
        external_id: "123",
      },
    });
  };

  const triggerPayment = () => {
    if (!mamoRef.current || !isReady) return;

    mamoRef.current.triggerPayment();
  };

  return (
    <main className="h-screen w-full space-y-4 bg-white px-20 pt-40">
      <div className="flex gap-4">
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
          type="button"
          onClick={sendData}
          disabled={!isReady}
        >
          Send Data
        </button>

        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
          type="button"
          onClick={triggerPayment}
          disabled={!isReady}
        >
          Trigger payment
        </button>
      </div>

      <div id="mamo-checkout" className="h-full w-full" />
    </main>
  );
}

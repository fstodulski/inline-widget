"use client";

export default function IframePage() {
  return (
    <div className="h-full w-full">
      <iframe
        crossOrigin="same-origin"
        className="h-full min-h-screen w-full"
        allowtransparency="true"
        allow="payment; geolocation; microphone; camera; fullscreen; clipboard-read; clipboard-write"
        sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-top-navigation allow-popups-to-escape-sandbox allow-storage-access-by-user-activation allow-downloads"
        src="http://localhost:3000/inline-widget/pay/boxpay-018281"
        title="MamoPay Checkout"
      />
    </div>
  );
}

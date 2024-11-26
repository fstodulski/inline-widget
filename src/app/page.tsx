"use client";

export default function Home() {
  return (
    <main className="h-screen w-full bg-white p-20">
      <button
        type="button"
        className="rounded-md bg-blue-500 p-2 text-white"
        onClick={() => {
          const iframe = document.querySelector<HTMLIFrameElement>(
            "#iframe-mamo-checkout",
          );
          iframe?.contentWindow?.postMessage(
            {
              type: "init",
              origin: window.location.origin,
            },
            "https://f4.dev.business.mamopay.com",
          );
        }}
      >
        Emit event
      </button>
      <iframe
        className="h-full w-full"
        src="https://f4.dev.business.mamopay.com/permanent-widget/pay/boxpay-6aa67f"
        sandbox="allow-scripts allow-forms allow-popups allow-same-origin allow-top-navigation allow-top-navigation-by-user-activation"
        title="Boxpay"
        id="iframe-mamo-checkout"
        allow="payment"
        onLoad={() => {
          const iframe = document.querySelector<HTMLIFrameElement>(
            "#iframe-mamo-checkout",
          );

          iframe?.contentWindow?.postMessage(
            {
              type: "handshake",
              origin: window.location.origin,
            },
            "https://f4.dev.business.mamopay.com",
          );

          iframe?.contentWindow?.postMessage(
            {
              type: "initial-data",
              data: {
                amount: 50,
                currency: "USD",
                prefilledCustomer: {
                  firstName: "John",
                  lastName: "Doe",
                  email: "john.doe@example.com",
                },
              },
            },
            "https://f4.dev.business.mamopay.com",
          );
        }}
        allowTransparency={true}
      />
    </main>
  );
}

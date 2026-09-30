import Script from "next/script";

/**
 * Marks <html> as JS-enabled before hydration so [data-reveal] content can start hidden.
 * Injected by Next outside the React tree, so it doesn't disturb hydration ids.
 */
export function JsFlag() {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document -- App Router root layout is the supported place for this
    <Script id="js-flag" strategy="beforeInteractive">
      {"document.documentElement.classList.add('js')"}
    </Script>
  );
}

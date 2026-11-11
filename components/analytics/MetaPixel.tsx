"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackPageView } from "@/lib/meta-pixel";

// Digits only — the value is interpolated into an inline script.
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.replace(/\D/g, "") || null;

export function MetaPixel() {
  const pathname = usePathname();

  // Client-side navigations. On the very first render this may run before the
  // init script defines fbq (no-op) — the script then sends the initial
  // PageView itself. Both share the same last-path guard, so each route is
  // counted once regardless of ordering, rerenders or Strict Mode.
  useEffect(() => {
    if (!PIXEL_ID || !pathname) return;
    trackPageView(pathname);
  }, [pathname]);

  if (!PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');

          if(!window.__orbitPixelInit){
            window.__orbitPixelInit=true;
            fbq('init', '${PIXEL_ID}');
          }
          if(window.__orbitLastPageView!==location.pathname){
            window.__orbitLastPageView=location.pathname;
            fbq('track', 'PageView');
          }
        `}
      </Script>

      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

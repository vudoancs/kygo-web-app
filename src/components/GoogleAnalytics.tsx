'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

const publicPage = /^\/(?:$|(?:about|cart|checkout|contact|faq|showroom|terms)\/?$|(?:category|events|guide|policy|post|product|products|style-tips)(?:\/|$))/;

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
};

export default function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const tracked = Boolean(pathname && publicPage.test(pathname));
  const initialized = useRef(false);
  const previousLocation = useRef<string | null>(null);

  useEffect(() => {
    const browser = window as AnalyticsWindow;
    Reflect.set(browser, `ga-disable-${measurementId}`, !tracked);

    if (!tracked) {
      previousLocation.current = null;
      return;
    }

    const pageLocation = window.location.origin + pathname;
    if (pageLocation === previousLocation.current) return;

    let pageReferrer = previousLocation.current ?? '';
    if (!initialized.current && document.referrer) {
      const referrer = new URL(document.referrer);
      if (referrer.origin !== window.location.origin) {
        pageReferrer = referrer.origin;
      } else if (publicPage.test(referrer.pathname)) {
        pageReferrer = referrer.origin + referrer.pathname;
      }
    }

    const dataLayer = (browser.dataLayer ??= []);
    // The Google tag snippet queues Arguments objects for gtag commands.
    const gtag: (...command: unknown[]) => void = function () {
      // eslint-disable-next-line prefer-rest-params
      dataLayer.push(arguments);
    };

    const page = { page_location: pageLocation, page_referrer: pageReferrer };
    gtag('set', page);
    if (!initialized.current) {
      gtag('js', new Date());
      gtag('config', measurementId, {
        ...page,
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });
      initialized.current = true;
    }

    gtag('event', 'page_view', { ...page, send_to: measurementId });
    previousLocation.current = pageLocation;
  }, [measurementId, pathname, tracked]);

  useEffect(() => {
    return () => {
      Reflect.set(window, `ga-disable-${measurementId}`, true);
    };
  }, [measurementId]);

  return tracked ? (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      strategy="afterInteractive"
    />
  ) : null;
}

// Run with: npm test  (node:test + --experimental-strip-types, no extra deps)
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  trackPageView,
  trackLead,
  trackAuditStarted,
  metaLeadEventId,
  LEAD_EVENT_PARAMS,
} from "../lib/meta-pixel.ts";

function createStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
  };
}

let calls;

function installWindow({ fbq = true, storage = createStorage() } = {}) {
  calls = [];
  globalThis.window = {
    sessionStorage: storage,
    ...(fbq && { fbq: (...args) => calls.push(args) }),
  };
}

const events = (name) => calls.filter((c) => c[1] === name);

beforeEach(() => installWindow());

test("homepage load sends exactly one PageView, even if called repeatedly (rerender / Strict Mode)", () => {
  trackPageView("/");
  trackPageView("/");
  trackPageView("/");
  assert.equal(events("PageView").length, 1);
});

test("navigating to /contact sends one PageView; back to / sends another", () => {
  trackPageView("/");
  trackPageView("/contact");
  trackPageView("/contact");
  trackPageView("/");
  assert.equal(events("PageView").length, 3);
});

test("initial PageView already sent by the init script is not duplicated by the route effect", () => {
  // The inline script records the path it tracked on window.__orbitLastPageView.
  window.__orbitLastPageView = "/contact";
  trackPageView("/contact");
  assert.equal(events("PageView").length, 0);
});

test("no Lead is sent without a backend-confirmed lead id (failed / invalid submission)", () => {
  assert.equal(trackLead(undefined), false);
  assert.equal(trackLead(null), false);
  assert.equal(trackLead(""), false);
  assert.equal(events("Lead").length, 0);
});

test("successful audit request sends exactly one Lead with params and eventID", () => {
  assert.equal(trackLead("lead-success-1"), true);
  const leads = events("Lead");
  assert.equal(leads.length, 1);
  assert.deepEqual(leads[0], [
    "track",
    "Lead",
    { ...LEAD_EVENT_PARAMS },
    { eventID: metaLeadEventId("lead-success-1") },
  ]);
});

test("the same audit session is never counted twice (rerenders / repeat handling)", () => {
  trackLead("lead-dup-1");
  trackLead("lead-dup-1");
  trackLead("lead-dup-1");
  assert.equal(events("Lead").length, 1);
});

test("Lead already recorded in sessionStorage (same browser session) is not resent", () => {
  const storage = createStorage();
  storage.setItem("orbit_meta_lead_lead-stored-1", "1");
  installWindow({ storage });
  assert.equal(trackLead("lead-stored-1"), false);
  assert.equal(events("Lead").length, 0);
});

test("a different audit request in the same session is a new Lead", () => {
  trackLead("lead-a");
  trackLead("lead-b");
  assert.equal(events("Lead").length, 2);
});

test("Lead params contain no personal information", () => {
  trackLead("lead-pii-check");
  const [, , params] = events("Lead")[0];
  assert.deepEqual(Object.keys(params).sort(), ["content_category", "content_name"]);
});

test("AuditStarted fires once per session no matter how many interactions", () => {
  trackAuditStarted();
  trackAuditStarted();
  trackAuditStarted();
  const started = calls.filter((c) => c[0] === "trackCustom" && c[1] === "AuditStarted");
  assert.equal(started.length, 1);
});

test("Pixel unavailable (blocked / not configured): every call is a safe no-op", () => {
  installWindow({ fbq: false });
  assert.doesNotThrow(() => {
    assert.equal(trackPageView("/x"), false);
    assert.equal(trackLead("lead-no-pixel"), false);
    assert.equal(trackAuditStarted(), false);
  });
});

test("Lead is not consumed while the Pixel is unavailable", () => {
  installWindow({ fbq: false });
  trackLead("lead-late-pixel");
  installWindow();
  assert.equal(trackLead("lead-late-pixel"), true);
});

test("a throwing fbq or storage never breaks the caller (workflow continues)", () => {
  globalThis.window = {
    fbq: () => {
      throw new Error("fbq exploded");
    },
    sessionStorage: {
      getItem: () => {
        throw new Error("storage blocked");
      },
      setItem: () => {
        throw new Error("storage blocked");
      },
    },
  };
  assert.doesNotThrow(() => trackLead("lead-throwing"));
  assert.doesNotThrow(() => trackPageView("/throwing"));
  assert.doesNotThrow(() => trackAuditStarted());
});

test("server environment (no window) is a no-op", () => {
  delete globalThis.window;
  assert.equal(trackLead("lead-ssr"), false);
});

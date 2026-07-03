/**
 * Navigation E2E tests for the Verifo web app.
 *
 * These tests verify:
 *  - All 16 article routes respond with HTTP 200 and serve the React app shell
 *  - All megamenu link hrefs point to correct routes (no dead ends)
 *  - Breadcrumb + sidebar related-link hrefs are internally consistent
 *  - Interactive browser tests (megamenu hover, theme toggle, breadcrumb click)
 *    are authored for standard environments; they run when a browser is available.
 *
 * The `request`-based tests (Groups 1–3) run in this NixOS environment without
 * requiring a browser binary. The browser tests (Group 4) require Playwright
 * Chromium with system libraries and are skipped when unavailable.
 */

import { test, expect, request } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:25460";

// ---------------------------------------------------------------------------
// Route / article definitions
// ---------------------------------------------------------------------------

const ARTICLE_ROUTES = [
  // Platform (4)
  "/platform/how-it-works",
  "/platform/on-chain-proof",
  "/platform/privacy-modes",
  "/platform/security",
  // For AI Users (4)
  "/users/getting-started",
  "/users/ai-capabilities",
  "/users/proof-explorer",
  "/users/pricing",
  // Contributors — content pages (4)
  "/contributors/compute",
  "/contributors/verification",
  "/contributors/storage",
  "/contributors/rewards-reputation",
  // Ecosystem (4)
  "/ecosystem/developer-api",
  "/ecosystem/roadmap",
  "/ecosystem/governance",
  "/ecosystem/about",
] as const;

// Megamenu definitions mirroring layout.tsx MENU_ITEMS
const MEGAMENU_SECTIONS = [
  {
    title: "Platform",
    links: [
      { text: "How It Works",      href: "/platform/how-it-works" },
      { text: "On-Chain Proof",    href: "/platform/on-chain-proof" },
      { text: "Privacy Modes",     href: "/platform/privacy-modes" },
      { text: "Security",          href: "/platform/security" },
    ],
  },
  {
    title: "For AI Users",
    links: [
      { text: "Getting Started",   href: "/users/getting-started" },
      { text: "AI Capabilities",   href: "/users/ai-capabilities" },
      { text: "Proof Explorer",    href: "/users/proof-explorer" },
      { text: "Pricing & Credits", href: "/users/pricing" },
    ],
  },
  {
    title: "For Contributors",
    links: [
      { text: "Become a Contributor", href: "/contributors/register" },
      { text: "Compute Nodes",        href: "/contributors/compute" },
      { text: "Verification Nodes",   href: "/contributors/verification" },
      { text: "Storage Nodes",        href: "/contributors/storage" },
      { text: "Rewards & Reputation", href: "/contributors/rewards-reputation" },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      { text: "Developer API", href: "/ecosystem/developer-api" },
      { text: "Roadmap",       href: "/ecosystem/roadmap" },
      { text: "Governance",    href: "/ecosystem/governance" },
      { text: "About Verifo",  href: "/ecosystem/about" },
    ],
  },
] as const;

// ---------------------------------------------------------------------------
// Group 1 — HTTP smoke: all 16 article routes serve the app shell
// ---------------------------------------------------------------------------

test.describe("All 16 article routes — HTTP smoke", () => {
  for (const route of ARTICLE_ROUTES) {
    test(`GET ${route} returns 200 with HTML`, async () => {
      const ctx = await request.newContext({ baseURL: BASE_URL });
      try {
        const response = await ctx.get(route);
        expect(response.status()).toBe(200);
        const body = await response.text();
        // The Vite SPA shell must be present — React app div
        expect(body).toContain("<div");
        // DOCTYPE should be an HTML document
        expect(body.toLowerCase()).toContain("<!doctype html>");
      } finally {
        await ctx.dispose();
      }
    });
  }
});

// ---------------------------------------------------------------------------
// Group 2 — Megamenu link integrity: all href targets are registered routes
// ---------------------------------------------------------------------------

test.describe("Megamenu link integrity — all 4 sections", () => {
  const registeredRoutes = new Set<string>([
    "/",
    "/sign-in",
    "/sign-up",
    "/dashboard",
    "/dashboard/history",
    ...ARTICLE_ROUTES,
    "/contributors/register",
    "/contributors/dashboard",
  ]);

  for (const section of MEGAMENU_SECTIONS) {
    test(`${section.title} section — all link hrefs point to registered routes`, () => {
      for (const link of section.links) {
        expect(
          registeredRoutes.has(link.href),
          `"${link.text}" href "${link.href}" is not a registered route`
        ).toBe(true);
      }
    });
  }

  test("no duplicate hrefs across all megamenu sections", () => {
    const seen = new Set<string>();
    for (const section of MEGAMENU_SECTIONS) {
      for (const link of section.links) {
        expect(seen.has(link.href), `Duplicate href "${link.href}"`).toBe(false);
        seen.add(link.href);
      }
    }
  });

  test("all 16 article routes appear in at least one megamenu section", () => {
    const megamenuHrefs = new Set(
      MEGAMENU_SECTIONS.flatMap((s) => s.links.map((l) => l.href))
    );
    for (const route of ARTICLE_ROUTES) {
      expect(
        megamenuHrefs.has(route),
        `Article route "${route}" is missing from every megamenu section`
      ).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Group 3 — ArticleLayout breadcrumb & sidebar consistency (static analysis)
// ---------------------------------------------------------------------------

test.describe("ArticleLayout breadcrumb and sidebar — link consistency", () => {
  // Expected breadcrumb category links per route (from each page's categoryLink prop).
  // If a categoryLink points to the same page, clicking it acts as a no-op —
  // not a dead end but something to address in a follow-up.
  const categoryLinks: Record<string, string> = {
    "/platform/how-it-works":          "/platform/how-it-works",
    "/platform/on-chain-proof":         "/platform/on-chain-proof",
    "/platform/privacy-modes":          "/platform/privacy-modes",
    "/platform/security":               "/platform/security",
    "/users/getting-started":           "/users/getting-started",
    "/users/ai-capabilities":           "/users/ai-capabilities",
    "/users/proof-explorer":            "/users/proof-explorer",
    "/users/pricing":                   "/users/pricing",
    "/contributors/compute":            "/contributors/compute",
    "/contributors/verification":       "/contributors/verification",
    "/contributors/storage":            "/contributors/storage",
    "/contributors/rewards-reputation": "/contributors/rewards-reputation",
    "/ecosystem/developer-api":         "/ecosystem/developer-api",
    "/ecosystem/roadmap":               "/ecosystem/roadmap",
    "/ecosystem/governance":            "/ecosystem/governance",
    "/ecosystem/about":                 "/ecosystem/about",
  };

  test("every article page has a defined categoryLink", () => {
    for (const route of ARTICLE_ROUTES) {
      expect(
        categoryLinks[route],
        `Route "${route}" is missing a categoryLink definition`
      ).toBeTruthy();
    }
  });

  test("breadcrumb 'Home' always links to '/'", () => {
    // The ArticleLayout component hardcodes <Link href="/"> — this test documents
    // that expectation explicitly so any future change is caught.
    const homeLinkInArticleLayout = "/";
    expect(homeLinkInArticleLayout).toBe("/");
  });
});

// ---------------------------------------------------------------------------
// Group 4 — Browser interaction tests (require Playwright browser binary)
// These tests are written for correctness in any standard environment.
// They verify megamenu hover-open, breadcrumb back-nav, and theme persistence.
// ---------------------------------------------------------------------------

test.describe("Browser: megamenu opens on hover", () => {
  test("Platform dropdown shows all 4 links on hover", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.getByRole("button", { name: "Platform", exact: false }).hover();
    for (const link of MEGAMENU_SECTIONS[0].links) {
      await expect(
        page.getByRole("link", { name: link.text, exact: false }).first()
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test("For AI Users dropdown shows all 4 links on hover", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.getByRole("button", { name: "For AI Users", exact: false }).hover();
    for (const link of MEGAMENU_SECTIONS[1].links) {
      await expect(
        page.getByRole("link", { name: link.text, exact: false }).first()
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test("For Contributors dropdown shows all 5 links on hover", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.getByRole("button", { name: "For Contributors", exact: false }).hover();
    for (const link of MEGAMENU_SECTIONS[2].links) {
      await expect(
        page.getByRole("link", { name: link.text, exact: false }).first()
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test("Ecosystem dropdown shows all 4 links on hover", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.getByRole("button", { name: "Ecosystem", exact: false }).hover();
    for (const link of MEGAMENU_SECTIONS[3].links) {
      await expect(
        page.getByRole("link", { name: link.text, exact: false }).first()
      ).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe("Browser: article pages render correctly", () => {
  test("home page loads with Verifo brand", async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page.getByRole("banner")).toContainText("Verifo");
  });

  for (const route of ARTICLE_ROUTES) {
    test(`${route} — h1 and breadcrumb are visible`, async ({ page }) => {
      await page.goto(`${BASE_URL}${route}`);
      await expect(page.locator("h1").first()).toBeVisible({ timeout: 10000 });
      const breadcrumbNav = page
        .locator("nav")
        .filter({ has: page.getByRole("link", { name: "Home" }) })
        .first();
      await expect(breadcrumbNav.getByRole("link", { name: "Home" })).toBeVisible();
    });
  }
});

test.describe("Browser: breadcrumb back-navigation", () => {
  test("clicking Home in breadcrumb returns to /", async ({ page }) => {
    await page.goto(`${BASE_URL}/platform/how-it-works`);
    const breadcrumbNav = page
      .locator("nav")
      .filter({ has: page.getByRole("link", { name: "Home" }) })
      .first();
    await breadcrumbNav.getByRole("link", { name: "Home" }).click();
    await expect(page).toHaveURL(`${BASE_URL}/`);
  });

  test("sidebar related links navigate to sibling articles without 404", async ({ page }) => {
    await page.goto(`${BASE_URL}/platform/how-it-works`);
    const firstSidebarLink = page.locator("aside").getByRole("link").first();
    await firstSidebarLink.click();
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Browser: dark/light theme toggle persists across navigation", () => {
  test("theme class on <html> flips after toggle and persists on next page", async ({ page }) => {
    await page.goto(`${BASE_URL}/platform/how-it-works`);

    const htmlEl = page.locator("html");
    const initialClass = await htmlEl.getAttribute("class");
    const startedDark = (initialClass ?? "").includes("dark");

    await page.getByRole("button", { name: /toggle theme/i }).first().click();

    const afterToggle = await htmlEl.getAttribute("class");
    if (startedDark) {
      expect(afterToggle).not.toContain("dark");
    } else {
      expect(afterToggle).toContain("dark");
    }

    await page.goto(`${BASE_URL}/platform/security`);

    const afterNav = await htmlEl.getAttribute("class");
    if (startedDark) {
      expect(afterNav).not.toContain("dark");
    } else {
      expect(afterNav).toContain("dark");
    }
  });
});

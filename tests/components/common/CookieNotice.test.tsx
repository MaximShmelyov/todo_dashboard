/* @vitest-environment jsdom */
import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import CookieNotice from "@/src/components/common/CookieNotice";

describe("CookieNotice", () => {
  it("OK closes the notice", async () => {
    render(<CookieNotice />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const okButton = screen.getByRole("button", { name: /ok/i });
    await userEvent.click(okButton);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Sets cookie on OK", async () => {
    document.cookie = "cookie_notice_dismissed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    render(<CookieNotice />);

    const okButton = screen.getByRole("button", { name: /ok/i });
    await userEvent.click(okButton);

    expect(document.cookie).toMatch(/cookie_notice_dismissed=1/);
  });
});

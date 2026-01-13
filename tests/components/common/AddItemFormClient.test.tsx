/* @vitest-environment jsdom */
import "@testing-library/jest-dom";

import React from "react";
import {describe, it, expect, vi, beforeEach} from "vitest";
import {getByTestId, render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AddItemFormClient from "@/src/components/common/AddItemFormClient";
import {CollectionType} from "@prisma/client";
import {ButtonVariant} from "@/src/components/ui/Button";
import {createItem} from "@/src/db/actions/item";

/* ------------------ mocks ------------------ */

const backMock = vi.fn();
const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({back: backMock, push: pushMock}),
}));

vi.mock("next/form", () => ({
  default: ({action, children, ...props}: React.ComponentProps<"form"> & {
    action: (formData: FormData) => Promise<unknown>;
  }) => (
    <form
      {...props}
      onSubmit={async (e) => {
        e.preventDefault();
        await action(new FormData(e.currentTarget));
      }}
    >
      {children}
    </form>
  ),
}));

vi.mock("@/src/components/ui/Input", () => ({
  default: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}));

vi.mock("@/src/components/ui/Button", () => ({
  default: ({children, ...props}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant,
  }) => (
    <button {...props}>{children}</button>
  ),
}));

type CreateItemInputParams = Parameters<typeof createItem>;
const createItemMock = vi.fn();
vi.mock("@/src/db/actions/item", () => ({
  createItem: (...args: CreateItemInputParams) => createItemMock(...args),
}));

const getCollectionRouteMock = vi.fn();
const getLabelOfCollectionTypeMock = vi.fn();
vi.mock("@/src/lib/utils", () => ({
  getCollectionRoute: (collectionType: CollectionType): string => getCollectionRouteMock(collectionType),
  getLabelOfCollectionType: (collectionType: CollectionType): string =>
    getLabelOfCollectionTypeMock(collectionType),
}));

/* ------------------ tests ------------------ */

describe("AddItemFormClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCollectionRouteMock.mockReturnValue("/collections");
    getLabelOfCollectionTypeMock.mockReturnValue("Shopping List");
    createItemMock.mockResolvedValue(undefined);
  });

  const renderCmp = () =>
    render(
      <AddItemFormClient
        collectionType="SHOPPING"
        collectionId="col-123"
        ownerId="user-1"
      />
    );

  it("closes on overlay click", async () => {
    const user = userEvent.setup();
    const {container} = renderCmp();

    const overlay = getByTestId(container, 'overlay');
    await user.click(overlay);

    expect(backMock).toHaveBeenCalledOnce();
  });

  it("does NOT close when clicking inside modal", async () => {
    const user = userEvent.setup();
    renderCmp();

    await user.click(screen.getByRole("button", {name: /submit/i}));
    expect(backMock).not.toHaveBeenCalled();
  });

  it("submits form and navigates", async () => {
    const user = userEvent.setup();
    renderCmp();

    await user.type(screen.getByPlaceholderText("Title"), "Milk");
    await user.type(screen.getByPlaceholderText("Body"), "2L");

    await user.click(screen.getByRole("button", {name: /submit/i}));

    expect(createItemMock).toHaveBeenCalledWith({
      title: "Milk",
      body: "2L",
      collectionId: "col-123",
      createdById: "user-1",
    });

    expect(pushMock).toHaveBeenCalledWith("/collections/col-123");
  });

  it("renders collection label in title", () => {
    renderCmp();
    expect(
      screen.getByText("Add item to Shopping List")
    ).toBeInTheDocument();
  });
});

/* @vitest-environment jsdom */
import "@testing-library/jest-dom";

import { CollectionType } from "@prisma/client";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import AddItemFormClient from "@/src/components/common/AddItemFormClient";
import ModalDialog from "@/src/components/common/ModalDialog";
import { ButtonVariant } from "@/src/components/ui/Button";
import { createItem } from "@/src/db/actions/item";

/* ------------------ mocks ------------------ */

const backMock = vi.fn();
const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ back: backMock, push: pushMock }),
  useSearchParams: () => ({
    toString: () => "",
  }),
}));

vi.mock("next/form", () => ({
  default: ({
    action,
    children,
    ...props
  }: React.ComponentProps<"form"> & {
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
  default: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
  }) => <button {...props}>{children}</button>,
}));

type CreateItemInputParams = Parameters<typeof createItem>;
const createItemMock = vi.fn();
vi.mock("@/src/db/actions/item", () => ({
  createItem: (...args: CreateItemInputParams) => createItemMock(...args),
}));

const getCollectionRouteMock = vi.fn();
const getLabelOfCollectionTypeMock = vi.fn();
vi.mock("@/src/lib/utils", () => ({
  getCollectionRoute: (collectionType: CollectionType): string =>
    getCollectionRouteMock(collectionType),
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
    render(<AddItemFormClient collectionType="SHOPPING" collectionId="col-123" ownerId="user-1" />);

  it("closes on overlay click", async () => {
    function Wrapper({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
      const [open, setOpen] = React.useState(true);
      return (
        <ModalDialog
          open={open}
          onCloseAction={() => {
            setOpen(false);
            onClose();
          }}
        >
          {children}
        </ModalDialog>
      );
    }

    render(
      <Wrapper onClose={backMock}>
        <div>Modal content</div>
      </Wrapper>,
    );

    const overlay = screen.getByTestId("overlay");
    await userEvent.click(overlay);

    await waitFor(() => {
      expect(backMock).toHaveBeenCalledTimes(1);
    });
  });

  it("does NOT close when clicking inside modal", () => {
    renderCmp();

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(backMock).not.toHaveBeenCalled();
  });

  it("submits form and navigates", async () => {
    renderCmp();

    fireEvent.change(screen.getByPlaceholderText("Enter a title"), { target: { value: "Milk" } });
    fireEvent.change(screen.getByPlaceholderText("You can add details (optional)"), {
      target: { value: "2L" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalled();
      const calledWith = pushMock.mock.calls[0][0];
      expect(calledWith).toMatch(/^\/collections\/col-123(\?.*)?$/);
    });

    expect(createItemMock).toHaveBeenCalledWith({
      title: "Milk",
      body: "2L",
      collectionId: "col-123",
      createdById: "user-1",
    });
  });

  it("renders collection label in title", () => {
    renderCmp();
    expect(screen.getByText("Add item to Shopping List")).toBeInTheDocument();
  });
});

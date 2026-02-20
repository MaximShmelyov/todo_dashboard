/* @vitest-environment jsdom */
import "@testing-library/jest-dom";

// import { CollectionType, Family } from "@prisma/client";
import { render, screen } from "@testing-library/react";
import React, { ComponentProps } from "react";
import { describe, it, vi, expect } from "vitest";

import CreateCollectionFormClient from "@/src/components/common/CreateCollectionFormClient";
import ModalDialog from "@/src/components/common/ModalDialog";
import Input from "@/src/components/ui/Input";

type ModalDialogProps = ComponentProps<typeof ModalDialog>;
type InputProps = ComponentProps<typeof Input>;

const backMock = vi.fn();
const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ back: backMock, push: pushMock }),
}));

let modalDialogProps: ModalDialogProps | null = null;
vi.mock("@/src/components/common/ModalDialog", () => ({
  default: (props: ModalDialogProps) => {
    modalDialogProps = props;
    return <div data-testid="modal" {...props} />;
  },
}));

vi.mock("@/src/components/ui/Input", () => ({
  default: (props: InputProps) => <input {...props} />,
}));

vi.mock("@/src/components/common/ModalDialogTitle", () => ({
  default: (props: React.PropsWithChildren) => <h1 {...props} />,
}));

describe("CreateCollectionFormClient", () => {
  it("initial focus set to title input", async () => {
    render(<CreateCollectionFormClient collectionType={"TODO"} families={[]} />);

    // const modalDialog = screen.getByTestId("modal");
    const titleInput = screen.getByTestId("title-input");
    expect(modalDialogProps?.initialFocus?.current).equals(titleInput);
  });

  it("form onCloseAction should call router.back", async () => {
    render(<CreateCollectionFormClient collectionType={"TODO"} families={[]} />);

    expect(backMock).toHaveBeenCalledTimes(0);
    expect(modalDialogProps?.onCloseAction).toBeDefined();
    modalDialogProps!.onCloseAction();
    expect(backMock).toHaveBeenCalledTimes(1);
  });
});

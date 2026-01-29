"use client";

import { DialogTitle } from "@headlessui/react";
import { ComponentProps } from "react";

type ModelDialogTitleProp = ComponentProps<typeof DialogTitle>;

export default function ModalDialogTitle(props: ModelDialogTitleProp) {
  return <DialogTitle as="h3" className="text-lg mb-4 text-center" {...props} />;
}

/* @vitest-environment jsdom */
import "@testing-library/jest-dom";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import CollectionsClient from "@/src/app/CollectionsClient";
import { CollectionType } from "@prisma/client";
import { CollectionsExtended } from "@/src/db/actions/collections";

// Mock getCollectionRoute
vi.mock("@/src/lib/utils", () => ({
  getCollectionRoute: (type: CollectionType) => `/collections/${type.toLowerCase()}`,
}));

// Mock AddButton, VerticalList, VerticalListItem, BackNavigation
vi.mock("@/src/components/ui/buttons/AddButton", () => ({
  default: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));
vi.mock("@/src/components/ui/list/VerticalList", () => ({
  default: ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>,
}));
vi.mock("@/src/components/ui/list/VerticalListItem", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <li data-href={href}>{children}</li>
  ),
}));
vi.mock("@/src/components/ui/buttons/BackNavigation", () => ({
  default: ({ href }: { href: string }) => <a href={href}>Back</a>,
}));

const date = new Date("2023-01-01T10:00:00Z");

const mockItems: CollectionsExtended = [
  {
    id: "1",
    title: "Groceries",
    type: "SHOPPING" as CollectionType,
    createdAt: date,
    updatedAt: date,
    familyId: "f1",
    description: "desc",
    isPublic: false,
    ownerId: "owner1",
    family: { id: "f1", name: "Family1", createdAt: date },
  },
  {
    id: "2",
    title: "Work",
    type: "SHOPPING" as CollectionType,
    createdAt: date,
    updatedAt: date,
    familyId: null,
    description: null,
    isPublic: false,
    ownerId: "owner2",
    family: null,
  },
];

describe("CollectionsClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders label, add button, and list of items", () => {
    render(
      <CollectionsClient label="My Collections" collectionType="SHOPPING" items={mockItems} />,
    );

    expect(screen.getByText("My Collections")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();
    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("Family1")).toBeInTheDocument();
    expect(screen.getByText("(private)")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("renders empty state when no items", () => {
    render(<CollectionsClient label="Empty" collectionType="SHOPPING" items={[]} />);
    expect(screen.getByText("This list is empty. Add your first item!")).toBeInTheDocument();
  });

  it("links items to correct routes", () => {
    render(<CollectionsClient label="Test" collectionType="SHOPPING" items={mockItems} />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems[0]).toHaveAttribute("data-href", "/collections/shopping/1");
    expect(listItems[1]).toHaveAttribute("data-href", "/collections/shopping/2");
  });
});

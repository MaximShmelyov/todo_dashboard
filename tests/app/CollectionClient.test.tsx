/* @vitest-environment jsdom */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import CollectionClient from "@/src/app/CollectionClient";
import { CollectionExtended } from "@/src/db/actions/collections";

const getMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    toString: vi.fn(),
    get: getMock,
  }),
}));

vi.mock("@/src/db/actions/item", () => ({
  updateItem: vi.fn(),
  deleteItem: vi.fn(),
  deleteItems: vi.fn(),
}));

vi.mock("@/src/db/actions/collections", () => ({
  deleteCollection: vi.fn(),
}));

// --- Test data ---
const mockCollection: CollectionExtended = {
  id: "col1",
  title: "Test Collection",
  type: "TODO",
  description: "desc",
  isPublic: false,
  ownerId: "mockOwnerId",
  familyId: "mockFamilyId",
  createdAt: new Date("2024-01-01"),
  updatedAt: null,
  items: [
    {
      id: "1",
      title: "B item",
      body: "",
      done: false,
      createdAt: new Date("2024-01-01"),
      createdBy: {
        name: "user1",
        id: "",
        email: "mockemail@email",
        image: null,
      },
      updatedAt: null,
      position: null,
      dueDate: null,
    },
    {
      id: "2",
      title: "A item",
      body: "",
      done: true,
      createdAt: new Date("2024-01-02"),
      createdBy: {
        name: "user2",
        id: "",
        email: null,
        image: null,
      },
      updatedAt: null,
      position: null,
      dueDate: null,
    },
  ],
  family: {
    id: "mockFamilyId",
    name: "mock family title",
  },
  owner: {
    id: "mockOwnerId",
    name: "mock owner",
    email: "mockEmail@email",
    image: null,
  },
};

let sortValue: string | null = null;

beforeEach(() => {
  sortValue = null;
  getMock.mockReset();
  getMock.mockImplementation((key: string) => (key === "sort" ? sortValue : null));
});

describe("CollectionClient sorting", () => {
  it("sorts by title asc", () => {
    sortValue = "title_asc";
    render(<CollectionClient collection={mockCollection} />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent(/A item/);
    expect(items[1]).toHaveTextContent(/B item/);
  });

  it("sorts by title desc", () => {
    sortValue = "title_desc";
    render(<CollectionClient collection={mockCollection} />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent(/B item/);
    expect(items[1]).toHaveTextContent(/A item/);
  });

  it("sorts by done desc", () => {
    sortValue = "done_desc";
    render(<CollectionClient collection={mockCollection} />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent(/A item/); // done: true
    expect(items[1]).toHaveTextContent(/B item/); // done: false
  });

  it("sorts by done asc", () => {
    sortValue = "done_asc";
    render(<CollectionClient collection={mockCollection} />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent(/B item/); // done: false
    expect(items[1]).toHaveTextContent(/A item/); // done: true
  });
});

/* @vitest-environment jsdom */
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import CollectionClient from "@/src/app/CollectionClient";
import { CollectionExtended } from "@/src/db/actions/collections";

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

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
    refresh: vi.fn(),
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

describe("CollectionClient sorting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sorts by title asc", () => {
    render(<CollectionClient collection={mockCollection} />);
    fireEvent.change(screen.getByLabelText(/Sort by/i), { target: { value: "title_asc" } });
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("A item");
    expect(items[1]).toHaveTextContent("B item");
  });

  it("sorts by title desc", () => {
    render(<CollectionClient collection={mockCollection} />);
    fireEvent.change(screen.getByLabelText(/Sort by/i), { target: { value: "title_desc" } });
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("B item");
    expect(items[1]).toHaveTextContent("A item");
  });

  it("sorts by done desc", () => {
    render(<CollectionClient collection={mockCollection} />);
    fireEvent.change(screen.getByLabelText(/Sort by/i), { target: { value: "done_desc" } });
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("A item"); // done: true
    expect(items[1]).toHaveTextContent("B item"); // done: false
  });

  it("sorts by done asc", () => {
    render(<CollectionClient collection={mockCollection} />);
    fireEvent.change(screen.getByLabelText(/Sort by/i), { target: { value: "done_asc" } });
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("B item"); // done: false
    expect(items[1]).toHaveTextContent("A item"); // done: true
  });
});

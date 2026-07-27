import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import Contact from "@/pages/Contact";

describe("Contact form", () => {
  it("shows validation errors for invalid input", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Contact />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      screen.getByText(/name must be at least 2 characters/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/enter a valid email address/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/subject must be at least 3 characters/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/message must be at least 10 characters/i),
    ).toBeInTheDocument();
  });
});
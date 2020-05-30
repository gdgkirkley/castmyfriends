import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import AddShow from "../../components/AddShow";
import { theme } from "../../App";

beforeEach(() => {
  render(
    <ThemeProvider theme={theme}>
      <AddShow />
    </ThemeProvider>
  );
});

test("<AddShow /> renders without issues", () => {
  screen.getByRole("form");

  const titles = screen.getAllByRole("heading");
  expect(titles).toHaveLength(3);
  expect(titles[0].textContent).toBe("Add a New Show");
  expect(titles[1].textContent).toBe("Credits");
  expect(titles[2].textContent).toBe("Add Characters");

  // Implicit tests - if it can't find it, the test breaks!
  screen.getByLabelText(/title/i);
  screen.getByLabelText(/show description/i);
  screen.getByLabelText(/playwright/i);
  screen.getByLabelText(/book/i);
  screen.getByLabelText(/music/i);
  screen.getByLabelText(/lyrics/i);
  screen.getByLabelText(/author/i);
  screen.getByLabelText(/translator/i);
  screen.getByLabelText(/name/i);
  screen.getByLabelText(/character description/i);
  screen.getByLabelText(/tags/i);

  screen.getByText(/add show/i);
});

test("<AddShow /> inputs accept values", () => {
  const titleInput = screen.getByLabelText(/title/i);
  fireEvent.change(titleInput, { target: { value: "Midsummer" } });
  expect(titleInput.value).toBe("Midsummer");

  const showDescriptionInput = screen.getByLabelText(/show description/i);
  fireEvent.change(showDescriptionInput, { target: { value: "A great show" } });
  expect(showDescriptionInput.value).toBe("A great show");
});

test("<AddShow /> add character adds to display", () => {
  const nameInput = screen.getByLabelText(/name/i);
  fireEvent.change(nameInput, { target: { value: "Nick Bottom" } });
  expect(nameInput.value).toBe("Nick Bottom");
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { mockFirebase } from "firestore-jest-mock";
const {
  mockCollection,
  mockAdd,
} = require("firestore-jest-mock/mocks/firestore");
import { ThemeProvider } from "styled-components";
import AddShow from "../../components/AddShow";
import { firestore } from "../../firebase/firebase.utils";
import { theme } from "../../App";

mockFirebase({
  database: {
    users: [{ id: "abc123", name: "Test" }],
    shows: [{ id: "123abc", title: "Midsummer" }],
  },
});

beforeEach(() => {
  render(
    <ThemeProvider theme={theme}>
      <AddShow />
    </ThemeProvider>
  );
});

afterEach(() => {
  jest.clearAllMocks();
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

  screen.getByTestId("addCharacter");
  screen.getByTestId("characterList");
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
  const characterList = screen.getByTestId("characterList");
  expect(characterList.childElementCount).toBe(1);
  expect(characterList.textContent).toBe(
    "Nothing to display! Add a character above."
  );

  const nameInput = screen.getByLabelText(/name/i);
  fireEvent.change(nameInput, { target: { value: "Nick Bottom" } });
  expect(nameInput.value).toBe("Nick Bottom");

  const descriptionInput = screen.getByLabelText(/character description/i);
  fireEvent.change(descriptionInput, { target: { value: "A weaver" } });
  expect(descriptionInput.value).toBe("A weaver");

  const button = screen.getByTestId("addCharacter");
  fireEvent.click(button);

  expect(characterList.childElementCount).toBe(1);
  expect(characterList.textContent).toContain("Nick Bottom");
  expect(characterList.textContent).toContain("A weaver");

  const removeButton = screen.getByText("X");
  fireEvent.click(removeButton);
  expect(characterList.childElementCount).toBe(1);
  expect(characterList.textContent).toBe(
    "Nothing to display! Add a character above."
  );
});

test("<AddShow /> submits", () => {
  const form = screen.getByRole("form");
  const submit = screen.getByText(/add show/i);

  fireEvent.click(submit);

  expect(submit).toBeDisabled();
  expect(submit.textContent).toBe("Adding Show");

  expect(mockCollection).toHaveBeenCalled();
  expect(mockCollection).toHaveBeenCalledTimes(1);
  expect(mockAdd).toHaveBeenCalled();
  expect(mockAdd).toHaveBeenCalledTimes(1);
});

import { test, expect } from "@playwright/test";
import path from "path";

const UI_URL = "http://localhost:5173/";

// b4 each test since we need to be logged in
test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  //get heading
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  //get email
  await page.locator("[name=email]").fill("1@1.com");

  // get password
  await page.locator("[name=password]").fill("123456");

  // click Login
  await page.getByRole("button", { name: "Login" }).click();

  //toast
  await expect(page.getByText("Sign in Successful!")).toBeVisible();
});

test("should allow the user to create a new hotel", async ({ page }) => {
  await page.goto(`${UI_URL}add-hotel`);

  //   fill the form fetails
  await page.locator('[name="name"]').fill("Test Hotel");
  await page.locator('[name="city"]').fill("Test City");
  await page.locator("[name='country']").fill("Test Country");
  await page.locator("[name='description']").fill("Test Description");
  await page.locator("[name='pricePerNight']").fill("100");
  await page.selectOption('select[name="starRating"]', "3");

  //   the type
  await page.getByText("Budget").click();

  //   the facilities
  await page.getByLabel("Free Wifi").check();
  await page.getByLabel("Free Parking").check();

  //   guests
  await page.locator('[name="adultCount"]').fill("2");
  await page.locator('[name="childCount"]').fill("2");

  //   add image files
  await page.setInputFiles('[name="imageFiles"]', [
    path.join(__dirname, "files", "1.png"),
    path.join(__dirname, "files", "2.png"),
  ]);

  // save the hotel
  await page.getByRole("button", { name: "Save" }).click();

  //  expect
  await expect(page.getByText("Hotel Saved!")).toBeVisible();
});

"use client";

import * as React from "react";
import {
  Button,
  Field,
  Input,
  makeStyles,
  tokens,
  useId,
} from "@fluentui/react-components";
import { useThemeSwitcher } from "@/app/providers"; // Import useThemeSwitcher

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: tokens.spacingHorizontalXL, // Use Fluent UI token for padding
    backgroundSize: "cover", // Ensure background image covers the container
    backgroundPosition: "center", // Center the background image
    backgroundRepeat: "no-repeat", // Prevent background image from repeating
    // backgroundColor will be set dynamically or removed if image covers fully
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalL, // Use Fluent UI token for gap
    width: "90%", // Use a percentage for width
    maxWidth: "400px",
    minWidth: "280px", // Ensure a minimum width for very small screens
    padding: tokens.spacingHorizontalXL, // Replaced shorthands.padding
    borderRadius: tokens.borderRadiusMedium, // Replaced shorthands.borderRadius
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4, // Use Fluent UI token for box shadow
    "@media (max-width: 480px)": { // Media query for small screens
      gap: tokens.spacingVerticalM, // Reduce gap on small screens
      padding: tokens.spacingHorizontalM, // Reduce padding on small screens
    },
  },
  title: {
    fontSize: tokens.fontSizeBase500, // Use Fluent UI token for font size
    fontWeight: tokens.fontWeightSemibold, // Use Fluent UI token for font weight
    marginBottom: tokens.spacingVerticalL, // Use Fluent UI token for margin bottom
    textAlign: "center",
  },
});

export default function LoginPage() {
  const styles = useStyles();
  const usernameId = useId("username-input");
  const passwordId = useId("password-input");
  const { isDarkTheme } = useThemeSwitcher(); // Use the hook to get theme status

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle login logic here
    console.log("Login form submitted!");
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${isDarkTheme ? '/fluent_web_dark.svg' : '/fluent_web_light.svg'})`,
      }}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Login</h2>
        <Field label="Username" required>
          <Input id={usernameId} placeholder="Enter your username" />
        </Field>
        <Field label="Password" required>
          <Input id={passwordId} type="password" placeholder="Enter your password" />
        </Field>
        <Button type="submit" appearance="primary">
          Log In
        </Button>
      </form>
    </div>
  );
}
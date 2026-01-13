import { themes } from "@/lib/themes";

describe("App Themes Configuration", () => {
  it("contains all required cycle phases", () => {
    expect(themes).toHaveProperty("ovulation");
    expect(themes).toHaveProperty("menstrual");
    expect(themes).toHaveProperty("luteal");
    expect(themes).toHaveProperty("follicular");
    expect(themes).toHaveProperty("neutral");
  });

  it("defines correct brand colors for ovulation phase", () => {
    const theme = themes.ovulation;
    expect(theme.gradientStart).toBe("#dcedff");
    expect(theme.button).toBe("#0052CC");
    expect(theme.highlightTextColor).toBeDefined();
  });

  it("defines correct brand colors for menstrual phase", () => {
    const theme = themes.menstrual;
    // check red is the correct shade
    expect(theme.button).toBe("#D90000"); 
    expect(theme.gradientStart).toBeDefined();
  });

  it("defines neutral theme for fallback states", () => {
    const theme = themes.neutral;
    expect(theme.cardColor).toBeDefined();
    // check text contrast is correct for neutral
    expect(theme.highlightTextColor).toBe("#1E293B");
  });
});
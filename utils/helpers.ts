export const cn = (...xs: Array<string | false | undefined | null>) =>
  xs.filter(Boolean).join(" ");
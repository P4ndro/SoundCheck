import { dark } from "@clerk/themes";
import type { Appearance } from "@clerk/types";

const soundcheckVariables = {
  colorPrimary: "#a38cf0",
  colorDanger: "#e85d5d",
  colorSuccess: "#3dba6a",
  colorWarning: "#e09a2c",
  colorBackground: "transparent",
  colorInputBackground: "#1a1823",
  colorInputText: "#f8f6fc",
  colorText: "#f8f6fc",
  colorTextSecondary: "#c9c4d8",
  colorTextOnPrimaryBackground: "#f8f6fc",
  colorNeutral: "#6f6983",
  borderRadius: "0.375rem",
  fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
  fontFamilyButtons: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
} as const;

const authElements = {
  rootBox: "clerk-auth-root w-full",
  cardBox: "clerk-auth-card-box w-full shadow-none",
  card: "clerk-auth-card w-full shadow-none border-0 bg-transparent p-0 gap-4",
  main: "clerk-auth-main w-full",
  scrollBox: "clerk-auth-scroll w-full overflow-visible",
  logoBox: "hidden",
  header: "hidden",
  headerTitle: "hidden",
  headerSubtitle: "hidden",
  footer: "hidden",
  footerAction: "hidden",
  footerActionLink: "hidden",
  footerPages: "hidden",
  footerPagesLink: "hidden",
  socialButtonsRoot: "clerk-social-root w-full overflow-visible",
  socialButtons: "clerk-auth-socials w-full flex flex-col gap-2.5 overflow-visible",
  socialButtonsBlockButton:
    "clerk-social-btn relative min-h-11 w-full overflow-visible rounded-md border border-border bg-surface-2 px-3 py-2.5 text-sm font-medium text-foreground shadow-none hover:border-accent/40 hover:bg-surface-1",
  socialButtonsBlockButtonText: "text-sm font-medium text-foreground",
  socialButtonsProviderIcon: "h-5 w-5 shrink-0 opacity-100",
  lastAuthenticationStrategyBadge:
    "clerk-last-used-badge z-10 rounded-md border border-border bg-surface-1 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted",
  dividerLine: "bg-border flex-1",
  dividerRow: "w-full gap-3",
  dividerText: "text-xs text-subtle uppercase tracking-wide",
  form: "w-full flex flex-col gap-4",
  formFieldRow: "w-full",
  formFieldLabel: "text-xs font-medium text-muted",
  formFieldInput:
    "h-9 w-full rounded-md border border-border bg-surface-1 px-3 text-sm text-foreground shadow-none placeholder:text-subtle hover:border-accent/35 focus:border-accent focus:ring-2 focus:ring-accent-subtle",
  formButtonPrimary:
    "h-10 w-full rounded-md bg-accent text-base font-medium text-foreground shadow-none hover:bg-accent-hover",
  formButtonReset:
    "text-sm font-medium text-accent-muted hover:text-accent-hover",
  identityPreview: "w-full rounded-md border border-border bg-surface-1 px-3 py-2",
  identityPreviewText: "text-sm text-foreground",
  identityPreviewEditButton:
    "text-sm font-medium text-accent-muted hover:text-accent-hover",
  alternativeMethodsBlockButton:
    "h-9 w-full rounded-md border border-border bg-surface-2 text-sm text-foreground hover:bg-surface-1",
  otpCodeFieldInputs: "w-full justify-between gap-2",
  otpCodeFieldInput:
    "h-10 rounded-md border border-border bg-surface-1 text-foreground",
  formResendCodeLink:
    "text-sm font-medium text-accent-muted hover:text-accent-hover",
  alert: "rounded-md border border-border bg-surface-1 px-3 py-2",
  alertText: "text-sm text-muted",
  backRow: "w-full",
  backLink: "text-sm font-medium text-accent-muted hover:text-accent-hover",
} as const;

export const clerkAuthAppearance: Appearance = {
  baseTheme: dark,
  variables: soundcheckVariables,
  layout: {
    logoPlacement: "none",
    socialButtonsPlacement: "top",
    socialButtonsVariant: "blockButton",
    showOptionalFields: true,
  },
  elements: authElements,
};

export const clerkProviderAppearance: Appearance = {
  baseTheme: dark,
  variables: {
    ...soundcheckVariables,
    colorBackground: "#262433",
  },
};

import {
  MarketingFooter,
  MarketingHeader,
} from "@/features/marketing/components/marketing-shell";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <MarketingHeader />
      {children}
      <MarketingFooter />
    </div>
  );
}

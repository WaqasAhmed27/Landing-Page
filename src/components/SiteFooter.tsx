import React from "react";

const exploreLinks = [
  { label: "Waitlist", href: "#hero-waitlist" },
  { label: "Platform", href: "#platform" },
  { label: "Integration", href: "#integration" },
  { label: "Security", href: "#security" },
  { label: "Pricing", href: "#pricing" },
];

const resourceLinks = [
  { label: "Digital receipts", href: "/digital-receipts" },
  { label: "FBR fiscalization", href: "/fbr-fiscalization" },
  { label: "Paperless ROI", href: "/paperless-checkout" },
  { label: "NFC architecture", href: "/nfc-pos-intercept" },
  { label: "Blog", href: "/blog" },
];

function FooterLinkGroup({ title, links }: { title: string; links: typeof exploreLinks }) {
  return (
    <div className="site-footer__group">
      <h2>{title}</h2>
      <ul>
        {links.map(({ label, href }) => (
          <li key={href}><a href={href}>{label}</a></li>
        ))}
      </ul>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="site-footer__inner">
        <div className="site-footer__main">
          <div className="site-footer__brand">
            <a className="site-footer__brand-lockup" href="/" aria-label="TapTile home">
              <span className="site-footer__brand-mark">
                <img src="/assets/taptile-icon.png" alt="" width="46" height="46" />
              </span>
              <img className="site-footer__wordmark" src="/assets/taptile-text.png" alt="TapTile" width="148" height="43" />
            </a>
            <p className="site-footer__tagline">Pakistan’s digital receipt network for modern retail.</p>
            <a className="site-footer__contact" href="mailto:hello@taptile.pk">hello@taptile.pk</a>
          </div>

          <nav className="site-footer__nav" aria-label="Footer navigation">
            <FooterLinkGroup title="Explore" links={exploreLinks} />
            <FooterLinkGroup title="Resources" links={resourceLinks} />
          </nav>
        </div>

        <div className="site-footer__bottom">
          <span>© 2026 TapTile Technologies</span>
          <span aria-label="Made with love in Pakistan">Made with ♥ in Pakistan</span>
        </div>
      </div>
    </footer>
  );
}

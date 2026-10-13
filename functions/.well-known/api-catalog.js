/**
 * /.well-known/api-catalog — RFC 9727 API Catalog
 *
 * Serves a machine-readable catalog of all APIs hosted on this origin,
 * formatted as application/linkset+json per RFC 9264.
 *
 * @see https://www.rfc-editor.org/rfc/rfc9727
 * @see https://www.rfc-editor.org/rfc/rfc9264
 */
export function onRequestGet() {
  const catalog = {
    linkset: [
      {
        anchor: "https://taptile.pk/api/waitlist",
        "service-desc": [
          {
            href: "https://taptile.pk/openapi.json",
            type: "application/json",
          },
        ],
        "service-doc": [
          {
            href: "https://taptile.pk/",
            type: "text/html",
          },
        ],
      },
    ],
  };

  return new Response(JSON.stringify(catalog, null, 2), {
    status: 200,
    headers: {
      "Content-Type":
        'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

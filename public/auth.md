# TapTile auth.md

TapTile supports agent access requests through a waitlist. This document
describes the safe, unauthenticated enrollment flow for agents that want to
request access to TapTile services.

## Agent audience

This flow is intended for software agents acting on behalf of merchants,
integrators, and service operators who want to use TapTile's digital receipt
and merchant onboarding APIs.

## Agent access request

```yaml
agent_auth:
  skill: waiting-list-enrollment
  register_uri: https://taptile.pk/api/waitlist
  enrollment:
    method: POST
    content_type: application/json
    fields:
      email:
        type: string
        format: email
        required: true
        description: Contact email for the agent operator or responsible team.
      businessName:
        type: string
        required: false
        description: Business or organization requesting access.
      city:
        type: string
        required: false
        description: Primary operating city.
      posSoftware:
        type: string
        required: false
        description: POS software used by the business.
      source:
        type: string
        required: false
        default: agent_auth
        description: Enrollment source identifier.
    example_request:
      email: operator@example.com
      businessName: Example Retail
      city: Lahore
      posSoftware: Example POS
      source: agent_auth
    expected_response:
      accepted_status: 200
      body:
        success: true
        message: Successfully added to waitlist.
        email: operator@example.com
```

Send the enrollment request as JSON:

```http
POST https://taptile.pk/api/waitlist
Content-Type: application/json

{
  "email": "operator@example.com",
  "businessName": "Example Retail",
  "city": "Lahore",
  "posSoftware": "Example POS",
  "source": "agent_auth"
}
```

The `email` field is required. An invalid or missing email returns `400`.
Unexpected processing failures return `500`.

## Approval and credentials

Submitting a waitlist request only records a request for review. It does not
authenticate the agent, grant API access, issue a token, or create credentials.
TapTile reviews requests and contacts the responsible operator through the
submitted email address. Access is granted only after approval.

If approved, TapTile will provide the agent's access instructions and any
required credentials through that approval process. Agents must then use those
credentials exactly as instructed and must not send unauthenticated requests
to protected services.

TapTile does not currently publish OAuth Protected Resource Metadata or OAuth
Authorization Server Metadata for this waitlist-only landing-page service.

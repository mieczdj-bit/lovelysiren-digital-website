# Executive dashboard data interface — proposal v0.1

**Status:** design proposal only. No live endpoints, credentials, permissions, or financial/customer records exist in this prototype.

## Security boundary

- The browser receives only aggregated, authorized dashboard views. It must not query production databases or payment providers directly.
- A future backend must authenticate the person using the existing LovelySiren identity system, then enforce an explicit Executive Producer role on every request. A hidden URL, unguessable route, client-side role, or browser flag is not authorization.
- Keep payment credentials, provider keys, and any service identity on a trusted server. Use least-privilege service identity and audit administrative reads/exports.
- Enforce date and product scope server-side; return only fields needed by the selected dashboard view.
- Separate confidential financial, customer analytics, and developer-submission scopes. Never send proposal content to a public endpoint or expose one developer’s data to another.
- Responses should be no-store and exclude tokens, raw payment identifiers, full customer contact data, and unnecessary personal records.

## Proposed read-only interface

`GET /internal/dashboard/v1/overview?period={periodId}`

Example response (synthetic shape only):

```json
{
  "schemaVersion": "executive-overview.v1",
  "period": { "id": "sample-period", "start": "YYYY-MM-DD", "end": "YYYY-MM-DD" },
  "totals": {
    "receiptsMinor": 0,
    "expensesMinor": 0,
    "netMinor": 0,
    "installations": 0,
    "activeUsers": 0,
    "engagementSeconds": 0
  },
  "products": [],
  "pendingActions": [],
  "generatedAt": "RFC3339 timestamp"
}
```

All amounts use integer minor units with an explicit currency per amount in an eventual implementation. `products`, `pendingActions`, and any royalty obligations require separately approved field definitions and access controls before implementation.

## Future separation

- Product financial reports: authorized company aggregates and reconciliation status.
- Usage analytics: coarse aggregates with documented event definitions and retention.
- Developer royalty views: only the relevant developer's own product and statement records; the executive view receives separately permissioned aggregates.
- Submissions and notices: private proposal access is restricted to assigned human reviewers; never use automated evaluation or selection based on this prototype.

This contract does not define a production API, database, entitlement, payment, or identity change. It requires security review, privacy review, approved role ownership, exact response schemas, and staging tests before any live connection.

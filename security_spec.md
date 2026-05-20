# security_spec.md

## 1. Data Invariants
- **Products Collection**: Publicly readable. Client-side SDK writes (create, update, delete) are strictly forbidden (writable only by admin/service account).
- **Testimonials Collection**: Publicly readable. Client-side SDK writes (create, update, delete) are strictly forbidden.
- **Inquiries Collection**: Clients (anonymous or authenticated) can submit inquiries. Once created, they cannot be updated or deleted. If `userId` is specified in the payload, it must match the authenticated `request.auth.uid`.
- **Orders Collection**: Authenticated users can create orders for themselves (`userId` in order must match `request.auth.uid`). Users can only list and get their own orders. Orders are terminal upon creation; they are immutable (cannot be updated/edited) and cannot be deleted by clients.

---

## 2. The "Dirty Dozen" Malicious Payloads (Designed to Fail)

### Payload 1: Product Spoof Create (Identity / Privilege Escalation)
Attempting to insert a custom fake product at a price of $0.01 via client SDK.
- **Target Collection**: `products`
- **Payload**:
```json
{
  "id": "snk-zero",
  "name": "Malicious Fake Sneaker",
  "category": "sneakers",
  "price": 0.01,
  "description": "Hack",
  "image": "fake"
}
```
- **Expected Result**: `PERMISSION_DENIED`

### Payload 2: Product Price Tamper (State Shortcutting)
Attempting to update an existing premium sneaker's price from $320 to $10.
- **Target Collection**: `products`
- **Payload**:
```json
{
  "price": 10
}
```
- **Expected Result**: `PERMISSION_DENIED`

### Payload 3: Anonymous User Modifying a Testimonial (Privilege Escalation)
Attempting to overwrite a verified public customer testimonial.
- **Target Collection**: `testimonials`
- **Payload**:
```json
{
  "comment": "Totally hacked commentary."
}
```
- **Expected Result**: `PERMISSION_DENIED`

### Payload 4: Inquiry Spoofing Identity (Identity Theft)
Attempting to submit a contact inquiry where the `userId` in the document is set to another user's UID.
- **Target Collection**: `inquiries`
- **Payload**:
```json
{
  "id": "inq-99",
  "name": "Adversary",
  "email": "hacker@hacker.com",
  "interest": "Bespoke Perfumes",
  "message": "Hijacking",
  "userId": "other-user-uid-who-is-not-me",
  "createdAt": "request.time"
}
```
- **Expected Result**: `PERMISSION_DENIED`

### Payload 5: Inquiry Injection Attack (Denial of Wallet / Value Poisoning)
Attempting to inject a massive 5MB text string into the `message` field of an inquiry.
- **Target Collection**: `inquiries`
- **Payload**:
```json
{
  "id": "inq-100",
  "name": "Attacker",
  "email": "attacker@spam.org",
  "interest": "Sneakers Curation",
  "message": "[5MB of repeating characters...]",
  "createdAt": "request.time"
}
```
- **Expected Result**: `PERMISSION_DENIED`

### Payload 6: Anonymous Order Creation (Identity Violation)
Attempting to write an order without a valid user ID.
- **Target Collection**: `orders`
- **Payload**:
```json
{
  "id": "order-001",
  "userId": null,
  "customerEmail": "anonymous@web.com",
  "customerName": "Stranger",
  "items": [],
  "total": 100
}
```
- **Expected Result**: `PERMISSION_DENIED` (Requires active authenticated session).

### Payload 7: Order Theft (Security / Access Control Breach)
User `alice` attempting to read user `bob`'s order document.
- **Target Collection**: `orders/bob-order-123`
- **Expected Result**: `PERMISSION_DENIED`

### Payload 8: Order Update (Immutability / Update-Gap Attack)
Attempting to change an order status from "Pending Curator Approval" to "Shipped" or edit the quantity/price after placement.
- **Target Collection**: `orders`
- **Payload**:
```json
{
  "total": 0,
  "status": "Shipped"
}
```
- **Expected Result**: `PERMISSION_DENIED`

### Payload 9: Order Deletion (Malicious Action Attack)
Attempting to delete a placed order.
- **Target Collection**: `orders/order-123`
- **Expected Result**: `PERMISSION_DENIED`

### Payload 10: Inquiry ID Poisoning Guard (Resource Poisoning)
Attempting to create an inquiry with an extremely long invalid ID containing malicious path escape characters.
- **Target Document ID**: `inquiries/MALICIOUS_PATH%2F..%2F..%2FX`
- **Expected Result**: `PERMISSION_DENIED`

### Payload 11: Missing Required Fields in Order (Schema Integrity)
Attempting to create an order document that lacks the required `items` and `total` fields.
- **Target Collection**: `orders`
- **Payload**:
```json
{
  "id": "order-deficient",
  "userId": "my-uid",
  "customerEmail": "me@domain.com",
  "customerName": "My Name",
  "createdAt": "request.time",
  "status": "Pending"
}
```
- **Expected Result**: `PERMISSION_DENIED`

### Payload 12: Forge Temporal Timestamp (Temporal Integrity)
Attempting to write an inquiry with a client-set hardcoded back-dated or future `createdAt` value instead of the server's synchronous `request.time`.
- **Target Collection**: `inquiries`
- **Payload**:
```json
{
  "id": "inq-time-forge",
  "name": "Time Traveler",
  "email": "me@time.net",
  "interest": "Sneakers Curation",
  "message": "Forging time",
  "createdAt": "2020-01-01T00:00:00Z"
}
```
- **Expected Result**: `PERMISSION_DENIED`

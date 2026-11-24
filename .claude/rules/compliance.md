---
paths:
  - "src/services/**"
  - "src/stores/**"
  - "src/app/**"
  - "app.json"
---
# Vietnam Legal & Regulatory Compliance

App business logic and data handling must strictly adhere to Vietnamese regulations:

1. **PDPD (Personal Data Protection Decree 13/2023/ND-CP)**
   - Minimal data collection: Only request essential personal information.
   - Right to erasure: Users must have the option to delete their account and associated data.
   - No data commercialization: User personal information is never sold or shared with unauthorized third parties.

2. **Decree 52/2024/ND-CP (Non-Cash Payments)**
   - 9Paws is an expense recording and bill-splitting calculation tool.
   - It is **not** an intermediary payment service provider and does not hold user funds or escrow money.
   - All actual money transfers are executed directly by users via their own banking apps.

3. **Law on Protection of Consumers' Rights (19/2023/QH15)**
   - Clear and transparent service disclosures.
   - Official customer support channel: `support@9paws.com`.

4. **Law on Cybersecurity 2018**
   - Mandatory encryption: HTTPS / TLS 1.3 for all network transmissions.
   - On-device biometric data: Face ID / Touch ID data remains exclusively inside hardware secure enclaves (iOS Keychain / Android Keystore) and is never transmitted to backend servers.
# Portal Requirements Specification

## Home Page
**Purpose:** Act as a launchpad for all portal sections. Set client expectations and give clear instructions.

**Layout:**
- Welcome Message
- Navigation Buttons:
  - Approvals
  - Deliverables
  - Reports
  - Submit Target Pages
  - Support/Help Videos

**General Information Section:**
- How to use the portal (short text + Loom video)
- Reporting expectations ("Reports are shared at the end of each month. Weekly progress can be checked live in the dashboard.")

**Links to Loom Videos:**
- How to approve websites
- How to navigate the dashboard
- How to use ClearScope (optional)

**Support Contact Link/Form:**
- "Need help? Submit a support request here."

---

## Reporting Page
**Purpose:** Provide clients with downloadable monthly reports. Allow historical access without asking manually.

**Layout:**
- Month-by-Month Report Cards (Grid layout, one card per month)
  - Each Card Contains:
    - Report Month
    - PDF/Link to Download the Monthly Report
    - Overview Data:
      - Links built
      - Budget spent
      - Key target pages used
      - Separate cost breakdown by location (if relevant)
- Pricing Table Link (Lightly hidden but accessible)
  - So clients can understand link pricing tiers based on DR/DA if needed.

---

## Approvals Page
**Purpose:** Let clients approve or reject link targets and website opportunities. Reduce confusion about costs and process.

**Layout:**
- Table View: Website Opportunities & Link Targets
  - Columns:
    - Domain
    - DR/DA
    - Estimated Traffic
    - Price (cost associated with that opportunity)
    - Client Notes (optional input)
    - Approval Status (Approve / Reject button)
    - Notes from Client (optional text field)
- Special Field:
  - Instruction Note: "If you reject a website, please leave a reason (e.g., not a good fit, poor design, etc.). This helps us improve future opportunities."
  
**Logic:**
- If a website is rejected → Reason field becomes mandatory.
- Approved websites automatically move into the deliverables queue for next month's builds.
- Clarification Note: "Websites not used this month may be used in the following month if still relevant."

---

## Deliverables Page
**Purpose:** Show clients the links built month-to-month. Help them track real work and results without manual emailing.

**Layout:**
- Filters:
  - Month selection (dropdown)
  - Service type (link building, PPC, other)
- Table View: Deliverables
  - Columns:
    - Link URL
    - Anchor Text
    - Target Page
    - Date Delivered
    - Service Type
    - Link Cost (optional)
- Budget Summary Box (Top of page for selected month):
  - Budget Allocated
  - Budget Used
  - # of Links Delivered
  - Cost Breakdown by Service (Link Building, PPC, Development, Other)
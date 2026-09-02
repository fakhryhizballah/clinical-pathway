# Clinical Pathway App

Starter full-stack app for the Clinical Pathway single-page execution flow.

## Stack
- Frontend: Next.js App Router + React
- Backend: Node.js + Express
- Database: MongoDB + Mongoose

## URL
`/clinical-pathway/:no_reg/:no_rm/:kode_template_cp`

Demo:
`http://localhost:3000/clinical-pathway/REG-DEMO/RM-DEMO/CP-SEPSIS-MATERNAL`

## Behavior
When the requested CP record does not exist, the backend automatically loads the active template and creates `cp_records` with generated daily checklist rows. Subsequent visits reuse the existing record.

## Run
1. Start MongoDB.
2. Copy `backend/.env.example` to `backend/.env` if custom values are needed.
3. From this root folder run `npm install`.
4. Run `npm run dev`.
5. Open the demo URL above.

The backend seeds a demo template `CP-SEPSIS-MATERNAL` on first startup.

## Imported CP Template
The provided source document `CP PERSALINAN MACET (DISTOSIA) fix.docx` has been mapped into the MongoDB `cp_templates` seed as:

`CP-PERSALINAN-MACET-DISTOSIA`

Demo URL:
`http://localhost:3000/clinical-pathway/REG-DEMO/RM-DEMO/CP-PERSALINAN-MACET-DISTOSIA`

### Actor NIP in URL

The Clinical Pathway page now accepts the medical staff NIP as the final route parameter:

`/clinical-pathway/:no_reg/:no_rm/:kode_template_cp/:nip`

Example:

`http://localhost:3000/clinical-pathway/REG-DEMO/RM-DEMO/CP-PERSALINAN-MACET-DISTOSIA/D100`

The NIP is displayed on the page and is sent as `actor` when checklist changes are saved, so `checked_by` records the NIP.

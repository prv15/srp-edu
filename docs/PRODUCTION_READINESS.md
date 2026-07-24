# TPS Education Cloud - Production Readiness

## Source baseline

The initial archive contained the React/Vite frontend only. A later server
archive supplied the PHP/PDO API source and vendor directory, but no database
schema export or automated tests.

The live API base currently used by the frontend is:

`https://thetechservices.in/srp-edu/api/v1`

## P0 blockers

1. **Production deployment has not yet applied the security migration and
   hardened PHP source.** The public server remains unsafe until this code is
   deployed and the exposed database credential is rotated.
2. **The database schema export remains unavailable.** Existing student,
   academic, fee and operational relationships cannot yet be verified fully.
3. **Most modules have no supplied backend implementation or confirmed API
   contract.** Attendance, fees, faculty, academics, examinations, library,
   transport, reports, settings, communications, inventory, and hostel cannot
   be made operational safely by inventing endpoints.

## Implemented backend security baseline

The authenticated bootstrap response now returns:

- user identity and active session;
- allowed institutes (`id`, `code`, display name, branding);
- roles and fine-grained permissions;
- available academic years and admission sessions per institute;
- CSRF token.

Every endpoint must derive and validate the institute against the authenticated
user. A client-provided `institute_id` is a filter, not authorization.

## Institution-specific rules captured from supplied documents

- Degree College supports January and July admission sessions.
- BA/BSc/BCom follow an eight-semester workflow with admission/readmission,
  registration, CIA, assignments, university examination, and practical
  examinations where applicable.
- Degree programmes include MJC, MIC, MDC, AEC, SEC, VAC, internship, and
  research-project subject categories.
- Degree College attendance declaration requires at least 75%.
- School admission declaration requires at least 80%.
- Degree College fee exemptions apply to female and SC/ST students under the
  supplied institutional rule, while practical, registration, examination,
  field-visit, and other applicable charges remain separately controlled.
- Training College supports B.Ed. and D.El.Ed. with course-specific application,
  counselling, registration/board identifiers, document, and academic-history
  requirements.

## Implemented frontend baseline

- Central API envelope/error handling and institute-scoped requests.
- Cancellation of stale student requests during tenant switching.
- Client-side rejection when a student detail response belongs to another
  institute.
- Live, institute-specific student dashboard metrics and recent admissions.
- Real student directory filters for identifiers, names, contact details,
  course, department, academic year, and status.
- Client pagination for the current unpaginated API response.
- Degree College January/July admission-session presentation.
- Responsive navigation, dashboard, filters, and data-table containment.
- Production TypeScript build and ESLint pass.

## Next implementation gate

Do not release this system or enter additional production data until the PHP
source/database schema are supplied and the P0 authentication and tenant
isolation issues are fixed server-side.

Product Requirements Document (PRD)
SmileSure – Dental Clinic Management System (Revised)
1. Product Overview

Product Name: SmileSure
Product Type: Web-based Dental Clinic Management System

Technology Stack (Finalized)

Frontend: Next.js (App Router)

Backend: Next.js API Routes (no separate Node server)

Database: MongoDB (MONGODB_URL property is already setup in the .env file just use the same)

ORM: Mongoose

Authentication: JWT-based auth

Password Security: bcrypt

UI Framework: shadcn/ui + Tailwind CSS, The UI should be styled like what is it of the landing pages, use the same color scheme, all the webapp related ui pages code should be under (webapp) folder for seperation from landing pages

Notifications: Twilio (WhatsApp)

Analytics: Server-side aggregation (MongoDB pipelines)

2. User Roles & Access Control
Roles

Admin

Front Desk

User (Patient)

Role-based access must be enforced strictly at API level, not just UI.

3. Authentication & Account Management
Common to All Roles

Login

Logout

Forgot Password

Reset Password via secure token

JWT-based session handling

Role-based route protection (Next.js middleware)

Password Rules

bcrypt hashing

Minimum length enforced

Forced password reset for seeded admin

Password reset token expiry

4. First-Time Seed Logic
Seed Trigger

Runs on app startup

Checks if users collection is empty

Seeded Data

Default Admin

Email: nakul.paradox+smilesureadmin@gmail.com

Temporary password - Abcd1234

Default Frontdesk

Email: nakul.paradox+smilesurefrontdesk@gmail.com

Temporary password - Abcd1234

Default User

Email: nakul.paradox+smilesureuser@gmail.com

Temporary password - Abcd1234

Forced reset on first login

Default Appointment Statuses

Scheduled

Confirmed

Checked-In

In Treatment

Completed

Cancelled

No-Show

Seed logic must be idempotent (safe to run multiple times).

5. Database Models (Mongoose)
5.1 User Model
- _id
- name
- email
- phone
- role (ADMIN | FRONT_DESK | USER)
- passwordHash
- isActive
- createdAt
- updatedAt
- createdBy
- lastModifiedBy

5.2 Appointment Model
- _id
- patientId (ref User)
- createdBy (Admin | FrontDesk)
- lastModifiedBy (Admin | FrontDesk)
- appointmentDateTime
- status
- treatmentType
- feeAmount
- notes
- reminderSent (boolean)
- createdAt
- updatedAt

5.3 Invitation Model
- _id
- email
- role
- inviteToken
- expiresAt
- accepted
- createdBy
- lastModifiedBy

5.4 Payment / Revenue Record (Required for Analytics)
- _id
- appointmentId
- patientId
- amount
- paymentMode (CASH | ONLINE)
- paymentDate
- createdBy
- lastModifiedBy
- createdAt
- updatedAt

6. Appointment Management
Visibility Matrix
Role	View	Create	Update Status	Cancel
Admin	All	Yes	Yes	Yes
Front Desk	All	Yes	Yes	Yes
User	Own	Request	No	Request
Appointment Filters (Mandatory)

Date range

Status

Patient name

Created by

Upcoming / Past

Reminder sent / pending

Filters must be:

Server-side

Indexed

Paginated


8. Admin Panel
Sidebar Navigation (Admin)

Dashboard

Appointments

Users (Patients)

Front Desk Users

Analytics

Invitations

Settings

Logout

Admin Analytics Dashboard (Critical Addition)
8.1 Revenue Analytics

Total revenue (daily / weekly / monthly)

Revenue per treatment type

Revenue per patient

Average revenue per appointment

8.2 Patient Analytics

Total registered patients

Active vs inactive patients

Repeat visit frequency

Per-patient visit history

Per-patient revenue contribution

8.3 Retention Metrics

First-time vs returning patients

Time gap between visits

Drop-off patients (no visit in X months)

All analytics powered by MongoDB aggregation pipelines.

9. Front Desk Panel (Simplified by Design)
Design Principle

Must be operable by staff with low technical or educational background.

UI Rules

Large buttons

Minimal text

Clear icons

No nested menus

One action per screen where possible

Sidebar Navigation (Front Desk)

Appointments

Create Appointment

Invite Patient

Profile

Logout

Front Desk Capabilities

Create appointments quickly

Change appointment status via dropdown

Invite patients via email / WhatsApp

View daily schedule (default view)

No access to analytics

No system configuration

10. User (Patient) Panel
Sidebar Navigation (User)

My Appointments

Book Appointment

My Profile

Logout

User Capabilities

Sign up via invite or direct registration

Login / logout

View own appointments

Request appointments

View and edit own profile

Name

Phone

Email (optional verification)

Receive WhatsApp reminders

Users cannot:

See other users

See revenue

Change appointment status

11. UI / UX Standards
UI Framework

shadcn/ui

Tailwind CSS

Consistent spacing

Accessible components

Global UI Requirements

Role-based sidebar

Profile card with role badge

Logout always visible

Toast notifications

Loading states everywhere

12. API Architecture (Next.js API Routes)
Authentication

POST /api/auth/login

POST /api/auth/logout

POST /api/auth/forgot-password

POST /api/auth/reset-password

Users

GET /api/users

POST /api/users/invite

PATCH /api/users/:id

Appointments

GET /api/appointments

POST /api/appointments

PATCH /api/appointments/:id

Analytics (Admin Only)

GET /api/analytics/revenue

GET /api/analytics/patients

GET /api/analytics/retention

13. Non-Functional Requirements

Server-side authorization mandatory

MongoDB indexes on:

appointmentDateTime

status

patientId

Secure secrets management

Error logging

Scalable cron strategy



15. Success Metrics

Front desk handles operations independently

Admin gets clear revenue and patient insights

Patients get reminders reliably

Minimal training required for staff

Clean first-time setup via seed


You are building clinic software, not a SaaS toy. The simplification of the Front Desk panel is non-negotiable — complexity kills adoption in healthcare environments. Analytics belongs only to Admin. Patients need dignity and clarity, nothing more.


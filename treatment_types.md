# Product Requirement Document: Dynamic Treatment Types Logic

## 1. Overview
The goal is to transition from static, hardcoded treatment types to a dynamic, database-driven system. This will allow the Admin to manage treatment types (create, edit, delete, list) and set associated fees. Appointment booking processes for all users (Admin, Front Desk, Patient) will fetch these dynamic types, and the fee amount will be automatically populated (with override capability for staff).

## 2. Requirements

### 2.1. Admin Management
- **Dashboard**: A new section in the Admin Dashboard to manage Treatment Types.
- **Functionality**:
    - **List**: View all existing treatment types with their price and status.
    - **Create**: Add a new treatment type (Name, Price, Description, Active Status).
    - **Edit**: Modify existing treatment types.
    - **Delete/Deactivate**: Soft delete or deactivate types so they don't appear in new bookings but preserve history.

### 2.2. Appointment Booking
- **Users (Patients)**:
    - When booking, fetch *active* treatment types from the API.
    - Display the estimated price (if we want to show it to users, though the prompt mainly focused on Admin/Front Desk seeing the price reflected). *Assumption: Users see the type, price is handled on backend/confirmed by staff, or displayed as 'Estimated'.*
- **Staff (Admin/Front Desk)**:
    - When creating/editing an appointment, select from *active* treatment types.
    - Selecting a type automatically populates the `Fee Amount` field with the configured price.
    - Staff can manually override the fee amount if needed.

### 2.3. Data Structure
- **TreatmentType Model**:
    - `name` (String, required, unique)
    - `price` (Number, required, default 0)
    - `description` (String, optional)
    - `isActive` (Boolean, default true)
    - `timestamps`

## 3. Implementation Details

### 3.1. Database (Mongoose)
- Create `TreatmentType` model.
- Update `seed.ts` to populate the initial list of static treatment types into the database.

### 3.2. API Routes
- `GET /api/treatment-types`: Fetch all types (support filtering by `isActive`).
- `POST /api/treatment-types`: Create a new type (Admin only).
- `PUT /api/treatment-types/:id`: Update a type (Admin only).
- `DELETE /api/treatment-types/:id`: Delete/Deactivate a type (Admin only).

### 3.3. Frontend
- **Admin**: New page `/admin/treatment-types`.
- **Navigation**: Add "Treatment Types" to Admin Sidebar.
- **Booking Forms**: Refactor `create-appointment`, `book-appointment`, and `new` appointment pages to replace hardcoded arrays with API calls.

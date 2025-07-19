# Music Tracks Manager

A single-page React application for managing music tracks: create, edit, delete, search, filter, paginate, and upload audio files.

---

## Features

1. **Create Track (metadata only)**
   - Modal form (Formik + Zod) with client-side validation
   - Fields: title, artist, album, genres (multi-select tags), cover image URL (with URL format validation & default placeholder)

2. **Edit Track**
   - Same modal form, pre-filled with existing data
   - Optimistic UI updates via React-Query

3. **Delete Track**
   - Per-item delete with confirmation dialog
   - Bulk delete via “select mode”

4. **List View**
   - Server-side pagination, sorting, and filtering
   - Filter by artist and genre
   - Debounced search (title, artist, album)
   - Loading indicators

5. **Upload Audio**
   - Separate “Upload Audio” modal
   - File type (MP3, WAV) & size validation
   - Replace or remove existing audio
   - Inline HTML5 `<audio>` player + waveform visualization (WaveSurfer.js)

6. **Extras**
   - Redux slice to persist table state (page, filters, search)
   - Toast notifications (Radix UI + custom variants)
   - “Select Mode” toggle for bulk operations

---

## Tech Stack

- **Framework**: React (Vite)
- **State & Data**: TanStack Query, Redux Toolkit
- **Form Validation**: Formik + Zod
- **UI Components**: shadcn/ui, Radix UI primitives
- **Audio**: HTML5 `<audio>`, WaveSurfer.js
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Tooling**: TypeScript, ESLint, Prettier

---

## Extra Tasks

1. **Bulk Delete Functionality**
   - “Select Mode” toggle allows entering selection mode (data-testid="select-mode-toggle")
   - Checkbox per track (`data-testid="track-checkbox-{id}"`) and “Select All” (`data-testid="select-all"`)
   - “Delete Selected” button (`data-testid="bulk-delete-button"`) to remove multiple tracks in one action

2. **Optimistic UI Updates**
   - All create, edit, delete and bulk-delete mutations update the list immediately
   - On‐error rollback restores previous state
   - Toast notifications confirm success or report errors without waiting for round-trip latency

3. **Audio Waveform Visualization**
   - WaveSurfer.js integration renders a live waveform for any uploaded audio
   - Inline “Play / Pause” control under each waveform (`data-testid="play-button-{id}"` / `data-testid="pause-button-{id}"`)
   - Smooth user feedback while the track is playing, with progress visuals

## Setup Instructions

To run the Music Tracks Manager locally, follow these steps to set up the frontend, backend, and access the Storybook.

### Frontend Setup

1. **Clone the Frontend Repository**  
   Clone the main repository containing the full React application for the Music Tracks Manager:

   ```bash
   git clone https://github.com/GenesisEducationKyiv/front-end-school-3-0-OlhaRyzha.git
   ```

2. **Set Up Environment Variables**  
   Create a `.env` file in the `front-end-school-3-0-OlhaRyzha` root directory with the following configuration:
   ```plaintext
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_APP_BASE_PATH=/tracker/
   VITE_WS_URL=ws://localhost:8000/ws
   DEV_URL=http://localhost:3000
   PROD_URL=http://localhost:8080
   ```

### Backend Setup

1. **Clone the Backend Repository**  
   Clone the backend repository to run the API server:
   ```bash
   git clone https://github.com/OlhaRyzha/tracker-backend.git
   ```

### Storybook for UI Components

1. **Access the Component Library**  
   The component library is available at:  
   [https://github.com/OlhaRyzha/tracks-manager-ui](https://github.com/OlhaRyzha/tracks-manager-ui)  
   All components are documented in Storybook — see the demo:  
   [https://687124c8879dc2a99152c612-axgxmggbyp.chromatic.com/?path=/story](https://687124c8879dc2a99152c612-axgxmggbyp.chromatic.com/?path=/story)

2. **Install the Package**
   ```bash
   npm install tracks-manager-ui
   ```

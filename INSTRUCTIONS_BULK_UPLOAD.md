
# Menu Images Bulk Upload Guide (Manifest Version)

**Note:** This version **DOES NOT** require any database schema changes. It uses a file in storage to track gallery images.

## Prerequisites

1.  **Environment Variables**:
    Ensure your `.env.local` file has the `SUPABASE_MANAGER_KEY` or `SUPABASE_SERVICE_ROLE_KEY`.
    
    *   **Crucial:** Check that your key is correct and not truncated. The script creates a storage bucket, so it needs admin privileges.

## Running the Upload Script

1.  **Place Images**:
    Ensure all images are in `public/menu-images`.

2.  **Run Script**:
    ```bash
    npx tsx scripts/upload-menu-images-cloud.ts
    ```

    This script will:
    *   Create a `menu-images` bucket in Supabase Storage if it doesn't exist.
    *   Iterate through all *existing* menu items in your database.
    *   Find matching images in `public/menu-images`.
    *   Upload images to Supabase Storage.
    *   **Upload `gallery-manifest.json`**: This file maps items to their multiple images, enabling the slider on the frontend.
    *   Update the `image_url` (main image) in the database.

## Verification

1.  **Check Console Output**:
    The script should say "Gallery Manifest uploaded successfully!"
    
2.  **Check Website**:
    Go to `http://localhost:3000/menu`.
    The page will fetch the manifest and automatically show sliders for items with multiple images.

## Troubleshooting

-   **"Error: __isStorageError"**:
    This usually means your `SUPABASE_SERVICE_ROLE_KEY` is invalid, expired, or truncated. Please verify it in `.env.local`.
-   **Images not showing**:
    Ensure the `gallery-manifest.json` file exists in your Supabase Storage bucket `menu-images`.

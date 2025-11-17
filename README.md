 **Lynq**: Clean Your Data in Seconds

 **Project Overview**

Lynq is a fast, minimal-click web utility designed to solve the perennial problem of messy CSV data uploads. It provides a simple yet powerful interface for validating, cleaning, and standardizing customer data (such as phone numbers, airtime allocations, and personal details) before it ever hits your backend systems.

Stop dealing with upload errors and manual spreadsheet correction. Lynq streamlines the entire data preparation workflow.

 **Key Features**

Lynq focuses on high-impact data transformation with minimal user effort:

CSV Upload & Parsing: Simple drag-and-drop interface for rapid file ingestion.

Error Detection: Instantly flags inconsistent formats, missing values, and potential duplicates upon upload.

Data Validation: Specialized validation for common data types, including:

Phone numbers (e.g., standardizing Kenyan formats like +254...).

Email addresses.

Date formats.

Numeric fields.

Data Cleaning & Normalization:

Trim leading/trailing whitespace.

Normalize capitalization (e.g., proper case for names).

Fix common date format inconsistencies.

Replace or map custom values (Find & Replace).

Deduplication: Automatically detect and remove duplicate rows based on user-defined key columns (e.g., unique phone number).

Configuration Presets: Save complex cleaning rule sets to apply them to future files with a single click.

Export Clean CSV: Download the validated and standardized data ready for safe backend consumption.



 **System Flow**

The application guides the user through a logical sequence to ensure data quality and user confidence.

1. Dashboard (The Starting Point)

The primary hub for users. Features a large, clear upload box ("Drag & drop your CSV or click to upload") and optional quick access to recent files or saved actions.

2. Data Preview Page

Upon successful upload, the raw data is displayed. This page is focused on diagnosis:

Table View: Interactive view of the first few hundred rows.

Validation Sidebar: Immediate report of issues found (e.g., "12 invalid phone numbers," "5 duplicate rows").

Suggested Fixes: Prompts to apply bulk fixes (e.g., "Auto-Standardize Phone Formats").

3. Cleaning Rules Page

The user-controlled configuration area, allowing for precise data transformation:

Toggle ON/OFF default rules (Trim, Normalize Case, Remove Empty Rows).

Define custom validation and find & replace operations.

Optionally save the current setup as a reusable Preset.

4. Results Page

The final destination provides transparency and closure:

Summary: Detailed report of transformations performed .

Export: A large, clear button to download the Clean CSV.

 Getting Started


# Clone the repository
git clone 
cd lynq

# Install dependencies
npm install

# Start the development server
npm run dev



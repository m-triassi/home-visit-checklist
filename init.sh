#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
# Add or remove placeholders from this list.
# The script will ask for a replacement for each one.
readonly PLACEHOLDERS=(
  ":application_title"
  ":author_name"
)
# --- End Configuration ---

# ANSI Color Codes
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# --- Helper Functions ---

# A safe sed-replacer for file content
# $1: placeholder
# $2: replacement
# Returns a sed expression string
get_sed_expr() {
  local placeholder="$1"
  local replacement="$2"

  # Escape special characters for sed: \, &, /
  local escaped_placeholder
  escaped_placeholder=$(printf '%s\n' "$placeholder" | sed -e 's/[\/&]/\\&/g')

  local escaped_replacement
  escaped_replacement=$(printf '%s\n' "$replacement" | sed -e 's/[\/&]/\\&/g')

  echo "s/$escaped_placeholder/$escaped_replacement/g"
}

# A safe sed-replacer for filenames
# $1: string to search in
# $2: placeholder
# $3: replacement
# Returns the modified string
replace_in_string() {
    local str="$1"
    local placeholder="$2"
    local replacement="$3"

    # Use a delimiter that is unlikely to be in the paths.
    local delim='|'

    local escaped_placeholder
    escaped_placeholder=$(printf '%s\n' "$placeholder" | sed -e 's/[&|]/\\&/g')

    local escaped_replacement
    escaped_replacement=$(printf '%s\n' "$replacement" | sed -e 's/[&|]/\\&/g')

    echo "$str" | sed "s$delim$escaped_placeholder$delim$escaped_replacement$delim""g"
}


# --- Main Script ---

echo -e "${CYAN}--- React Project Initializer ---${NC}"
echo "This script will configure your new project."
echo "Press [Enter] to accept a default value (if shown) or type your own."
echo

# Associative array to store the replacements
declare -A REPLACEMENTS

# 1. Get replacement values from user
for placeholder in "${PLACEHOLDERS[@]}"; do
  # Simple default suggestion (e.g., ":application_title" -> "Application Title")
  default_suggestion=$(echo "$placeholder" | sed 's/^://' | sed 's/_/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)} 1')

  # Use echo -e -n for a prompt with colors, then read.
  # This is more portable than 'read -p' for ANSI codes.
  echo -e -n "Enter value for ${YELLOW}${placeholder}${NC} [${default_suggestion}]: "
  read user_value

  if [ -z "$user_value" ]; then
    REPLACEMENTS[$placeholder]=$default_suggestion
  else
    REPLACEMENTS[$placeholder]=$user_value
  fi
done

echo
echo -e "${CYAN}--- Starting Initialization ---${NC}"

# 2. Find and replace in all file *contents*
echo "1. Replacing placeholder text in file contents..."
sed_expressions=()
for placeholder in "${PLACEHOLDERS[@]}"; do
  replacement="${REPLACEMENTS[$placeholder]}"
  sed_expressions+=(-e "$(get_sed_expr "$placeholder" "$replacement")")
done

# Find all files, excluding .git, this script, and common binary/media formats
# This logic is updated to correctly prune directories AND only select files.
find . \
  \( \
    -path '*/.git' \
    -o -path "./$(basename "$0")" \
  \) -prune \
  -o \
  \( \
    -type f \
    -not \( \
      -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" \
      -o -name "*.svg" -o -name "*.ico" -o -name "*.woff" -o -name "*.woff2" \
      -o -name "*.eot" -o -name "*.ttf" -o -name "*.otf" -o -name "*.DS_Store" \
    \) \
    -print0 \
  \) | xargs -0 sed -i "${sed_expressions[@]}"

echo "File content replacement complete."

# 3. Find and replace in all *filenames and directory names*
echo "2. Renaming files and directories..."
# We must loop for each placeholder to handle sequential renames
# (e.g., file :app_:author becomes My-App_:author, then My-App_John-Doe)
for placeholder in "${PLACEHOLDERS[@]}"; do
  replacement="${REPLACEMENTS[$placeholder]}"

  if [ -n "$replacement" ]; then
    # Use -depth to process deepest items first (contents before containers)
    # This prevents 'mv' from failing if a parent dir was renamed first.
    find . -depth \
      -path '*/.git' -prune -o \
      -path "./$(basename "$0")" -prune -o \
      -name "*$placeholder*" -print0 | while IFS= read -r -d '' old_path; do

        # Check if file still exists (it might have been moved by a parent rename)
        if [ ! -e "$old_path" ]; then
          continue
        fi

        new_path=$(replace_in_string "$old_path" "$placeholder" "$replacement")

        if [ "$old_path" != "$new_path" ]; then
          echo "   RENAMING: $old_path -> $new_path"
          mv -n -- "$old_path" "$new_path"
        fi
    done
  fi
done
echo "File and directory renaming complete."


# 4. Remove "Using this Template" section from README.md
echo "3. Updating README.md..."
README_FILE="README.md"
if [ -f "$README_FILE" ]; then
  # Use awk to find the '---' separator line.
  # It will skip printing all lines until it finds that line,
  # then print all lines *after* it.
  awk '
    /^---$/ {found=1; next}
    found
  ' "$README_FILE" > "${README_FILE}.tmp" && mv -- "${README_FILE}.tmp" "$README_FILE"
  echo "README.md section removed."
else
  echo -e "${YELLOW}WARN: ${README_FILE} not found. Skipping section removal.${NC}"
fi


# 5. Attempt to create Cloudflare Pages project
echo "4. Checking for Cloudflare Wrangler CLI..."
if command -v wrangler >/dev/null 2>&1; then
  echo -e "   ${GREEN}Wrangler CLI found.${NC} Attempting to create Pages project..."
  echo -e "   (You may be prompted to log in if you haven't already.)"

  if wrangler pages project create "${REPLACEMENTS[":application_title"]}"; then
    echo -e "   ${GREEN}Successfully created Cloudflare Pages project: ${REPLACEMENTS[":application_title"]}${NC}"
  else
    echo -e "   ${YELLOW}Wrangler command failed.${NC} Project creation may have been unsuccessful."
    echo -e "   ${YELLOW}This is okay! You can create it manually in the Cloudflare dashboard.${NC}"
  fi

else
  echo -e "   ${YELLOW}Wrangler CLI not found.${NC} Skipping automatic project creation."
  echo "   You can create the project manually in the Cloudflare dashboard."
fi


# 6. Remind user about secrets (was step 5)
echo
echo -e "${GREEN}--- Initialization Complete! ---${NC}"
echo
echo -e "${YELLOW}!!! ACTION REQUIRED !!!${NC}"
echo "--------------------------------------------------------------------------"
echo "To enable deployments, you must configure your GitHub repository:"
echo
echo "1. ${CYAN}Create Cloudflare Pages Project:${NC}"
echo "   - Go to your Cloudflare dashboard and create a new Pages project."
echo "   - Choose the option to upload files directly."
echo "   - Once created you may exit the page, as the GitHub action will upload the files for you."
echo
echo "2. ${CYAN}Set GitHub Repository Secrets:${NC}"
echo "   - In this repo, go to: ${GREEN}Settings > Secrets and variables > Actions${NC}"
echo "   - Click ${GREEN}New repository secret${NC} and add the following:"
echo
echo -e "   - ${GREEN}CLOUDFLARE_API_TOKEN${NC}"
echo "     (Create a token in Cloudflare with 'Edit Cloudflare Pages' permissions)"
echo
echo -e "   - ${GREEN}CLOUDFLARE_ACCOUNT_ID${NC}"
echo "     (Find this on your main Cloudflare dashboard page)"
echo "--------------------------------------------------------------------------"
echo

# 7. Delete this script (was step 6)
echo "Deleting this initialization script."
rm -- "$0"

echo "All done. Happy coding!"

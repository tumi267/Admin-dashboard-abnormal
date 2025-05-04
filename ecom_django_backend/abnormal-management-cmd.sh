#!/bin/bash

# ===============================================================
# abnormal-management-cmd.sh
# A script to automate API testing with curl
# ===============================================================

# Set basic configuration
BASE_URL="http://localhost:8000"
TOKENS_DIR="tokens"
CURRENT_USER=""

# ANSI color codes for better output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create tokens directory if it doesn't exist
mkdir -p "$TOKENS_DIR"

# Function to print colored output
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to handle user token retrieval
get_user_token() {
    local username=$1
    local token_file="${TOKENS_DIR}/${username}"
    
    if [ -f "$token_file" ]; then
        cat "$token_file"
    else
        echo ""
    fi
}

# Function to store user token
store_user_token() {
    local username=$1
    local token=$2
    local token_file="${TOKENS_DIR}/${username}"
    
    echo "$token" > "$token_file"
    print_message "$GREEN" "Token stored successfully for user: $username"
}

# Function to display JSON in a pretty format
pretty_print_json() {
    echo "$1" | python -m json.tool
}

# Function to handle API responses
handle_response() {
    local response=$1
    local http_code=$2
    
    print_message "$BLUE" "HTTP Status Code: $http_code"
    
    if [[ "$http_code" -ge 200 && "$http_code" -lt 300 ]]; then
        print_message "$GREEN" "Request was successful!"
        pretty_print_json "$response"
        return 0
    else
        print_message "$RED" "Request failed!"
        pretty_print_json "$response"
        return 1
    fi
}

# Function to register a new user
register_user() {
    print_message "$YELLOW" "=== User Registration ==="
    
    # Gather user input
    read -p "Enter username: " username
    [ "$username" == "cancel" ] && return
    [ "$username" == "exit" ] && exit 0
    
    read -p "Enter email: " email
    [ "$email" == "cancel" ] && return
    [ "$email" == "exit" ] && exit 0
    
    read -p "Enter first name: " first_name
    [ "$first_name" == "cancel" ] && return
    [ "$first_name" == "exit" ] && exit 0
    
    read -p "Enter last name: " last_name
    [ "$last_name" == "cancel" ] && return
    [ "$last_name" == "exit" ] && exit 0
    
    read -p "Enter department: " department
    [ "$department" == "cancel" ] && return
    [ "$department" == "exit" ] && exit 0
    
    read -s -p "Enter password: " password
    echo
    [ "$password" == "cancel" ] && return
    [ "$password" == "exit" ] && exit 0
    
    # Create JSON payload
    local data=$(cat <<EOF
{
    "username": "$username",
    "email": "$email",
    "first_name": "$first_name",
    "last_name": "$last_name", 
    "department": "$department",
    "password": "$password"
}
EOF
)
    
    print_message "$YELLOW" "Sending registration request..."
    
    # Make API call
    local response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register/" \
        -H "Content-Type: application/json" \
        -d "$data")
    
    # Extract HTTP status code and response body
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    # Handle the response
    if handle_response "$body" "$http_code"; then
        # If registration successful, store current username for future operations
        CURRENT_USER="$username"
        # If there's a token in the response, extract and store it
        if echo "$body" | grep -q "token"; then
            local token=$(echo "$body" | python -c "import sys, json; print(json.load(sys.stdin).get('token', ''))")
            if [ -n "$token" ]; then
                store_user_token "$username" "$token"
            fi
        fi
    fi
}

# Function to login a user
login_user() {
    print_message "$YELLOW" "=== User Login ==="
    
    # Gather user input
    read -p "Enter username: " username
    [ "$username" == "cancel" ] && return
    [ "$username" == "exit" ] && exit 0
    
    read -s -p "Enter password: " password
    echo
    [ "$password" == "cancel" ] && return
    [ "$password" == "exit" ] && exit 0
    
    # Create JSON payload
    local data=$(cat <<EOF
{
    "username": "$username",
    "password": "$password"
}
EOF
)
    
    print_message "$YELLOW" "Sending login request..."
    
    # Make API call
    local response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login/" \
        -H "Content-Type: application/json" \
        -d "$data")
    
    # Extract HTTP status code and response body
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    # Handle the response
    if handle_response "$body" "$http_code"; then
        # Store current username and token for future operations
        CURRENT_USER="$username"
        # Extract token from response
        local token=$(echo "$body" | python -c "import sys, json; print(json.load(sys.stdin).get('token', ''))")
        if [ -n "$token" ]; then
            store_user_token "$username" "$token"
        else
            print_message "$RED" "No token found in response!"
        fi
    fi
}

# Function to logout a user
logout_user() {
    print_message "$YELLOW" "=== User Logout ==="
    
    # Check if we need to ask for username
    if [ -z "$CURRENT_USER" ]; then
        read -p "Enter username: " username
        [ "$username" == "cancel" ] && return
        [ "$username" == "exit" ] && exit 0
    else
        username="$CURRENT_USER"
        print_message "$BLUE" "Using current user: $username"
    fi
    
    # Get token
    local token=$(get_user_token "$username")
    if [ -z "$token" ]; then
        print_message "$RED" "No token found for user $username. Please login first."
        return
    fi
    
    print_message "$YELLOW" "Sending logout request..."
    
    # Make API call
    local response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/logout/" \
        -H "Authorization: Token $token")
    
    # Extract HTTP status code and response body
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    # Handle the response
    if handle_response "$body" "$http_code"; then
        # Clear current user and remove token file
        rm -f "${TOKENS_DIR}/${username}"
        CURRENT_USER=""
        print_message "$GREEN" "Logged out successfully and token removed."
    fi
}

# Function to access a protected endpoint
access_protected_endpoint() {
    print_message "$YELLOW" "=== Access Protected Endpoint ==="
    
    # Check if we need to ask for username
    if [ -z "$CURRENT_USER" ]; then
        read -p "Enter username: " username
        [ "$username" == "cancel" ] && return
        [ "$username" == "exit" ] && exit 0
    else
        username="$CURRENT_USER"
        print_message "$BLUE" "Using current user: $username"
    fi
    
    # Get token
    local token=$(get_user_token "$username")
    if [ -z "$token" ]; then
        print_message "$RED" "No token found for user $username. Please login first."
        return
    fi
    
    print_message "$YELLOW" "Accessing protected endpoint..."
    
    # Make API call
    local response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/protected-endpoint/" \
        -H "Authorization: Token $token")
    
    # Extract HTTP status code and response body
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    # Handle the response
    handle_response "$body" "$http_code"
}

# Function to request password reset
request_password_reset() {
    print_message "$YELLOW" "=== Request Password Reset ==="
    
    # Gather user input
    read -p "Enter email: " email
    [ "$email" == "cancel" ] && return
    [ "$email" == "exit" ] && exit 0
    
    # Create JSON payload
    local data=$(cat <<EOF
{
    "email": "$email"
}
EOF
)
    
    print_message "$YELLOW" "Sending password reset request..."
    
    # Make API call
    local response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/password/reset/" \
        -H "Content-Type: application/json" \
        -d "$data")
    
    # Extract HTTP status code and response body
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    # Handle the response
    handle_response "$body" "$http_code"
}

# Function to confirm password reset
confirm_password_reset() {
    print_message "$YELLOW" "=== Confirm Password Reset ==="
    
    # Gather user input
    read -p "Enter reset token (from email): " token
    [ "$token" == "cancel" ] && return
    [ "$token" == "exit" ] && exit 0
    
    read -s -p "Enter new password: " new_password
    echo
    [ "$new_password" == "cancel" ] && return
    [ "$new_password" == "exit" ] && exit 0
    
    # Create JSON payload
    local data=$(cat <<EOF
{
    "token": "$token",
    "new_password": "$new_password"
}
EOF
)
    
    print_message "$YELLOW" "Confirming password reset..."
    
    # Make API call
    local response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/password/reset/confirm/" \
        -H "Content-Type: application/json" \
        -d "$data")
    
    # Extract HTTP status code and response body
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    # Handle the response
    handle_response "$body" "$http_code"
}

# Function to request email change
request_email_change() {
    print_message "$YELLOW" "=== Request Email Change ==="
    
    # Check if we need to ask for username
    if [ -z "$CURRENT_USER" ]; then
        read -p "Enter username: " username
        [ "$username" == "cancel" ] && return
        [ "$username" == "exit" ] && exit 0
    else
        username="$CURRENT_USER"
        print_message "$BLUE" "Using current user: $username"
    fi
    
    # Get token
    local token=$(get_user_token "$username")
    if [ -z "$token" ]; then
        print_message "$RED" "No token found for user $username. Please login first."
        return
    fi
    
    # Gather user input
    read -p "Enter new email: " new_email
    [ "$new_email" == "cancel" ] && return
    [ "$new_email" == "exit" ] && exit 0
    
    # Create JSON payload
    local data=$(cat <<EOF
{
    "new_email": "$new_email"
}
EOF
)
    
    print_message "$YELLOW" "Requesting email change..."
    
    # Make API call
    local response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/email/change/" \
        -H "Authorization: Token $token" \
        -H "Content-Type: application/json" \
        -d "$data")
    
    # Extract HTTP status code and response body
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    # Handle the response
    handle_response "$body" "$http_code"
}

# Function to confirm email change
confirm_email_change() {
    print_message "$YELLOW" "=== Confirm Email Change ==="
    
    # Check if we need to ask for username
    if [ -z "$CURRENT_USER" ]; then
        read -p "Enter username: " username
        [ "$username" == "cancel" ] && return
        [ "$username" == "exit" ] && exit 0
    else
        username="$CURRENT_USER"
        print_message "$BLUE" "Using current user: $username"
    fi
    
    # Get token
    local token=$(get_user_token "$username")
    if [ -z "$token" ]; then
        print_message "$RED" "No token found for user $username. Please login first."
        return
    fi
    
    # Gather user input
    read -p "Enter verification token (from email): " verification_token
    [ "$verification_token" == "cancel" ] && return
    [ "$verification_token" == "exit" ] && exit 0
    
    print_message "$YELLOW" "Confirming email change..."
    
    # Make API call
    local response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/email/confirm/$verification_token/" \
        -H "Authorization: Token $token")
    
    # Extract HTTP status code and response body
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    # Handle the response
    handle_response "$body" "$http_code"
}

# Function to create a product
create_product() {
    print_message "$YELLOW" "=== Create Product ==="
    
    # Check if we need to ask for username
    if [ -z "$CURRENT_USER" ]; then
        read -p "Enter username: " username
        [ "$username" == "cancel" ] && return
        [ "$username" == "exit" ] && exit 0
    else
        username="$CURRENT_USER"
        print_message "$BLUE" "Using current user: $username"
    fi
    
    # Get token
    local token=$(get_user_token "$username")
    if [ -z "$token" ]; then
        print_message "$RED" "No token found for user $username. Please login first."
        return
    fi
    
    # Gather user input
    read -p "Enter product name: " name
    [ "$name" == "cancel" ] && return
    [ "$name" == "exit" ] && exit 0
    
    read -p "Enter product description: " description
    [ "$description" == "cancel" ] && return
    [ "$description" == "exit" ] && exit 0
    
    read -p "Enter product price: " price
    [ "$price" == "cancel" ] && return
    [ "$price" == "exit" ] && exit 0
    
    read -p "Enter image path (local file): " image_path
    [ "$image_path" == "cancel" ] && return
    [ "$image_path" == "exit" ] && exit 0
    
    # Check if image file exists
    if [ ! -f "$image_path" ]; then
        print_message "$RED" "Image file not found: $image_path"
        return
    fi
    
    print_message "$YELLOW" "Creating product..."
    
    # Make API call
    local response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/products/" \
        -H "Authorization: Token $token" \
        -F "name=$name" \
        -F "description=$description" \
        -F "price=$price" \
        -F "image=@$image_path")
    
    # Extract HTTP status code and response body
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    # Handle the response
    handle_response "$body" "$http_code"
}

# Function to list products
list_products() {
    print_message "$YELLOW" "=== List Products ==="
    
    # Check if we need to ask for username
    if [ -z "$CURRENT_USER" ]; then
        read -p "Enter username: " username
        [ "$username" == "cancel" ] && return
        [ "$username" == "exit" ] && exit 0
    else
        username="$CURRENT_USER"
        print_message "$BLUE" "Using current user: $username"
    fi
    
    # Get token
    local token=$(get_user_token "$username")
    if [ -z "$token" ]; then
        print_message "$RED" "No token found for user $username. Please login first."
        return
    fi
    
    print_message "$YELLOW" "Fetching products..."
    
    # Make API call
    local response=$(curl -s -w "\n%{http_code}" "$BASE_URL/products/" \
        -H "Authorization: Token $token")
    
    # Extract HTTP status code and response body
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    # Handle the response
    handle_response "$body" "$http_code"
}

# Function to update a product
update_product() {
    print_message "$YELLOW" "=== Update Product ==="
    
    # Check if we need to ask for username
    if [ -z "$CURRENT_USER" ]; then
        read -p "Enter username: " username
        [ "$username" == "cancel" ] && return
        [ "$username" == "exit" ] && exit 0
    else
        username="$CURRENT_USER"
        print_message "$BLUE" "Using current user: $username"
    fi
    
    # Get token
    local token=$(get_user_token "$username")
    if [ -z "$token" ]; then
        print_message "$RED" "No token found for user $username. Please login first."
        return
    fi
    
    # Gather user input
    read -p "Enter product ID to update: " product_id
    [ "$product_id" == "cancel" ] && return
    [ "$product_id" == "exit" ] && exit 0
    
    print_message "$YELLOW" "Enter new values (leave blank to keep current value)"
    
    read -p "Enter new description (or leave blank): " description
    [ "$description" == "cancel" ] && return
    [ "$description" == "exit" ] && exit 0
    
    read -p "Enter new price (or leave blank): " price
    [ "$price" == "cancel" ] && return
    [ "$price" == "exit" ] && exit 0
    
    print_message "$YELLOW" "Updating product..."
    
    # Build the curl command with conditionally added fields
    local curl_cmd="curl -s -w \"\n%{http_code}\" -X PATCH \"$BASE_URL/products/$product_id/\" -H \"Authorization: Token $token\""
    
    if [ -n "$description" ]; then
        curl_cmd="$curl_cmd -F \"description=$description\""
    fi
    
    if [ -n "$price" ]; then
        curl_cmd="$curl_cmd -F \"price=$price\""
    fi
    
    # Execute the curl command
    local response=$(eval $curl_cmd)
    
    # Extract HTTP status code and response body
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    # Handle the response
    handle_response "$body" "$http_code"
}

# Function to delete a product
delete_product() {
    print_message "$YELLOW" "=== Delete Product ==="
    
    # Check if we need to ask for username
    if [ -z "$CURRENT_USER" ]; then
        read -p "Enter username: " username
        [ "$username" == "cancel" ] && return
        [ "$username" == "exit" ] && exit 0
    else
        username="$CURRENT_USER"
        print_message "$BLUE" "Using current user: $username"
    fi
    
    # Get token
    local token=$(get_user_token "$username")
    if [ -z "$token" ]; then
        print_message "$RED" "No token found for user $username. Please login first."
        return
    fi
    
    # Gather user input
    read -p "Enter product ID to delete: " product_id
    [ "$product_id" == "cancel" ] && return
    [ "$product_id" == "exit" ] && exit 0
    
    # Confirmation
    read -p "Are you sure you want to delete product $product_id? (y/n): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        print_message "$YELLOW" "Deletion cancelled."
        return
    fi
    
    print_message "$YELLOW" "Deleting product..."
    
    # Make API call
    local response=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/products/$product_id/" \
        -H "Authorization: Token $token")
    
    # Extract HTTP status code and response body
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    # Handle the response
    handle_response "$body" "$http_code"
}

# Function to display the menu
show_menu() {
    clear
    print_message "$BLUE" "================================================================="
    print_message "$GREEN" "                     API TESTING MENU                           "
    print_message "$BLUE" "================================================================="
    echo ""
    
    if [ -n "$CURRENT_USER" ]; then
        print_message "$GREEN" "Currently logged in as: $CURRENT_USER"
    else
        print_message "$YELLOW" "No user currently logged in"
    fi
    
    echo ""
    print_message "$YELLOW" "Authentication Operations:"
    echo "1. Register User"
    echo "2. Login User"
    echo "3. Logout User"
    echo "4. Access Protected Endpoint"
    echo "5. Request Password Reset"
    echo "6. Confirm Password Reset"
    echo "7. Request Email Change"
    echo "8. Confirm Email Change"
    
    echo ""
    print_message "$YELLOW" "Product Operations:"
    echo "9. Create Product"
    echo "10. List Products"
    echo "11. Update Product"
    echo "12. Delete Product"
    
    echo ""
    print_message "$RED" "0. Exit"
    echo ""
    print_message "$BLUE" "================================================================="
    echo ""
}

# Main program loop
while true; do
    show_menu
    read -p "Enter your choice (0-12): " choice
    
    case $choice in
        0)
            print_message "$GREEN" "Thank you for using the API testing script. Goodbye!"
            exit 0
            ;;
        1)
            register_user
            ;;
        2)
            login_user
            ;;
        3)
            logout_user
            ;;
        4)
            access_protected_endpoint
            ;;
        5)
            request_password_reset
            ;;
        6)
            confirm_password_reset
            ;;
        7)
            request_email_change
            ;;
        8)
            confirm_email_change
            ;;
        9)
            create_product
            ;;
        10)
            list_products
            ;;
        11)
            update_product
            ;;
        12)
            delete_product
            ;;
        "exit")
            print_message "$GREEN" "Thank you for using the API testing script. Goodbye!"
            exit 0
            ;;
        *)
            print_message "$RED" "Invalid option. Please try again."
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
done
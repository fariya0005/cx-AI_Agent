# cx-AI\_Agent

A Dialogflow CX chatbot agent integrated with external APIs for billing and license cost inquiries, built with Node.js and MySQL.

## Features

* **Save customer info:** Collects and stores customer details (company name, email, phone) into Cloud SQL.
* **Order processing:** Saves order details in the `orders` table.
* **API integration:** Fetches dynamic data (e.g., license cost) from external APIs and delivers responses.
* **Webhook endpoints:** Separate endpoints for saving customer info (`/save-info`) and fetching license costs (`/license-cost`).

## Repository Structure

```bash
├── save.js                   # Webhook for saving customer information
├── license.js                # Webhook for fetching license cost
├── index.js                  # Main server (if applicable)
├── test-db-connection.js     # Script to test database connectivity
├── package.json              # Project metadata and dependencies
├── package-lock.json         # Lockfile
└── README.md                 # Project documentation
```

## Prerequisites

* Node.js v14 or higher
* MySQL Server or Cloud SQL instance
* ngrok (for local development)

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/fariya0005/cx-AI_Agent.git
   cd cx-AI_Agent
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment variables:**
   Create a `.env` file in the root directory with the following variables:

   ```env
   DB_HOST=YOUR_DB_HOST
   DB_USER=YOUR_DB_USER
   DB_PASSWORD=YOUR_DB_PASSWORD
   DB_NAME=YOUR_DB_NAME
   DB_PORT=YOUR_DB_PORT
   ```

4. **Database setup:**

   * Ensure the `dialogflow_data` database exists.
   * Run the SQL script to create tables:

     ```sql
     CREATE TABLE orders (
       id INT AUTO_INCREMENT PRIMARY KEY,
       email VARCHAR(255) NOT NULL,
       phone VARCHAR(20) NOT NULL,
       company_name VARCHAR(255) NOT NULL,
       order_details TEXT NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );

     CREATE TABLE saveinfo (
       id INT AUTO_INCREMENT PRIMARY KEY,
       company_name VARCHAR(255) NOT NULL,
       email VARCHAR(255) NOT NULL,
       phone VARCHAR(20) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );
     ```

5. **Start the server:**

   ```bash
   node save.js      # For saving customer info
   node license.js   # For license cost API
   ```

6. **Expose with ngrok (local development):**

   ```bash
   ngrok http xxxx
   ```

   Copy the HTTPS URL and configure it as your webhook URL in Dialogflow CX.

## Dialogflow CX Configuration

1. **Create webhooks:**

   * **SaveInfoWebhook**: `https://YOUR_NGROK_URL/save-info`
   * **LicenseAPI**: `https://YOUR_NGROK_URL/license-cost`

2. **Configure intents/pages:**

   * **save\_info** tag for customer info collection.
   * **license\_cost** tag for license cost inquiries.

## Usage

* **Save customer info:** When the `save_info` intent is triggered, customer data is stored without sending a user-facing response.
* **Get license cost:** When the `license_cost` intent is triggered with a `product` parameter, the agent fetches the cost from the external API and replies with the formatted message.

## License

This project is licensed under the MIT License.

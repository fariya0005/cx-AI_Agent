require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json()); // Parse JSON bodies

// Webhook endpoint for saving info
app.post('/save-info', async (req, res) => {
  // Extract the tag from the request
  const tag = req.body.fulfillmentInfo?.tag;

  // If the tag is not 'save_info', return a successful status (200) and ignore
  if (tag !== "save_info") return res.sendStatus(200);

  // Extract parameters from the request body
  const { company_name, email, phone } = req.body.sessionInfo.parameters;

  // If any of the required parameters are missing, ignore the request
  if (!company_name || !email || !phone) return res.sendStatus(200);

  try {
    // Connect to the database
    const db = await mysql.createConnection({
      host: '34.57.175.51', // Replace with your Cloud SQL instance IP
      user: 'root', // Replace with your MySQL username
      password: 'Fariya@3281', // Replace with your MySQL password
      database: 'dialogflow_data', // Database name
      port: 3306, // MySQL port
    });

    // SQL query to insert the company info into the saveinfo table
    const infoQuery = `INSERT INTO saveinfo (company_name, email, phone) VALUES (?, ?, ?)`;
    const infoValues = [company_name, email, phone];

    // Execute the query to save the data
    await db.execute(infoQuery, infoValues);

    // Close the database connection
    await db.end();

    // Send a 200 response to Dialogflow (no message back)
    return res.sendStatus(200); 
  } catch (err) {
    console.error("Error saving info:", err);
    return res.sendStatus(200); // Still return 200 to avoid fallback
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Info server running on port ${PORT}`);
});

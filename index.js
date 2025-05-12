require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());  // Parse JSON bodies

app.post('/webhook', async (req, res) => {
  // Log the entire request body to see what is being sent from Dialogflow
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  // Log the tag received from the request
  const tag = req.body.fulfillmentInfo?.tag;
  console.log("Tag received:", tag);

  // Check if the tag is valid
  if (tag !== "save_order") {
    console.log("Invalid tag received");
    return res.json({
      fulfillment_response: {
        messages: [{ text: { text: ["Invalid request tag."] } }]
      }
    });
  }

  // Destructure the parameters from the request
  const { company_name, email, phone, service } = req.body.sessionInfo.parameters;
  console.log("Parameters received:", { company_name, email, phone, service });

  // Validate required fields
  if (!email || !service) {
    console.error("Missing email or service");
    return res.json({
      fulfillment_response: {
        messages: [
          {
            text: {
              text: ["Missing required information. Please provide a valid email and service."]
            }
          }
        ]
      }
    });
  }

  try {
    // Log that we're about to connect to the database
    console.log("Attempting to connect to the database...");
    
    const db = await mysql.createConnection({
        host: '34.57.175.51',
        user: 'root',
        password: 'Fariya@3281',
        database: 'dialogflow_data',
        port: 3306
      });
      
    // Log successful database connection
    console.log("Connected to the database successfully.");

    // Prepare the SQL query
    const query = `INSERT INTO orders (email, phone, company_name, order_details) VALUES (?, ?, ?, ?)`;
    const values = [email, phone, company_name, service];
    console.log("Executing query:", query, "with values:", values);

    // Execute the query
    const [result] = await db.execute(query, values);
    console.log("Query executed successfully, result:", result);

    // Close the database connection
    await db.end();
    console.log("Database connection closed.");

    // Return a success response
    return res.json({
      fulfillment_response: {
        messages: [
          {
            text: {
              text: [
                `Thank you! We've saved your request for "${service}" from "${company_name}". We'll reach out to you at "${email}" or "${phone}".`
              ]
            }
          }
        ]
      }
    });

  } catch (error) {
    // Log any database or other errors
    console.error('Error during database operation:', error);

    // Return an error response
    return res.json({
      fulfillment_response: {
        messages: [
          {
            text: {
              text: ["Something went wrong while saving your order. Please try again later."]
            }
          }
        ]
      }
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});


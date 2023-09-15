import weaviate
import json
import uuid

# Connect to the Weaviate server
client = weaviate.Client("http://localhost:8080")

# Delete any existing schema (optional)
client.schema.delete_all()

# Define the schema for the "Customer" class
schema = {
    "classes": [
        {
            "class": "Customer",
            "description": "A representation of a customer",
            "properties": [
                {"name": "Cust_ID", "dataType": ["int"], "description": "Unique customer ID"},
                {"name": "Name", "dataType": ["string"], "description": "Customer's name"},
                {"name": "Age", "dataType": ["int"], "description": "Customer's age"},
                {"name": "Gender", "dataType": ["string"], "description": "Customer's gender"},
                {"name": "Location", "dataType": ["string"], "description": "Customer's location"},
                {"name": "Marital_Status", "dataType": ["string"], "description": "Customer's marital status"},
                {"name": "Education", "dataType": ["string"], "description": "Customer's education level"},
                {"name": "Occupation", "dataType": ["string"], "description": "Customer's occupation"},
                {"name": "MOB", "dataType": ["string"], "description": "Customer's mobile phone number"},
                {"name": "Income", "dataType": ["int"], "description": "Customer's income"},
                {"name": "Dependents", "dataType": ["int"], "description": "Number of dependents"},
                {"name": "Digital_ind", "dataType": ["boolean"], "description": "Indicates if the customer is digital-savvy"},
                {"name": "Phone", "dataType": ["string"], "description": "Customer's phone model"},
                {"name": "Address", "dataType": ["string"], "description": "Customer's address"}
            ]
        }
    ]
}

# Create the schema in Weaviate
client.schema.create(schema)

# Load Customer data
with open('data.json', 'r') as f:
    customer_data = json.load(f)

# Create the customers in Weaviate
for customer_info in customer_data:

    client.data_object.create(customer_info, "Customer")

print("Customer Data Entered Successfully")



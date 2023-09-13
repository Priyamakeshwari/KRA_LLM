import weaviate
import json
import sys
import uuid
client = weaviate.Client("http://localhost:8080")

# Delete any existing schema (optional)
client.schema.delete_all()

# Define the schema for the class with a vectorizer
schema = {
    "classes": [
        {
            "class": "Product",
            "description": "Holds the information about same data",
            "properties": [
                {
                    "name": "title",
                    "description": "Title of the product",
                    "dataType": ["text"],
                },
                {
                    "name": "description",
                    "description": "Description of the product",
                    "dataType": ["text"],
                },
                {
                    "name": "price",
                    "description": "Price of the product",
                    "dataType": ["number"],
                }
            ],
            "vectorizer": "text2vec-huggingface",
            "moduleConfig": {
                "model": "BAAI/bge-base-en",
            }
        }
    ],

}

# Create the schema in Weaviate
client.schema.create(schema)

# Load Products data
with open('backend/data.json', 'r') as f:
    product_data = json.load(f)

vectorized_products = []

for product_info in product_data:
    title = product_info['title']
    description = product_info['description']
    price = product_info['price']

    vectorized_products.append({
        'product_id': str(uuid.uuid4()),
        "title": title,
        "description": description,
        "price": price
    })

# Create the products in Weaviate
for product in vectorized_products:
    print(product)
    client.data_object.create(product, "Product")
print()
print("Data Entered Successfully")

# for input in sys.stdin:
#     response = (
#         client.query
#         .get("Product", ["title", "description", "price"])
#         .with_near_text({
#             "concepts": [input]
#         }).with_limit(1)
#         .with_additional(["distance"])
#         .do()
#     )
    
#     print(json.dumps(response, indent=2))
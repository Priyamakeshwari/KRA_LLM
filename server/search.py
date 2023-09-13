import sys
import weaviate
import json
client = weaviate.Client("http://localhost:8080")
# for input in sys.stdin:
#     response = (
#         client.query
#         .get("Product", ["title", "description", "price"] )
#         .with_near_text({
#             "concepts": [input]
#         }).with_limit(1)
#         .with_additional(["distance"])
#         .do()
#     )
    
#     print(json.dumps(response, indent=2))


response = client.query.get(
    "Product",
    ["title", "description", "price"]
).do()
print(json.dumps(response, indent=4))
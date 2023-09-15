import sys
import weaviate
import json
client = weaviate.Client("http://localhost:8080")
for input in sys.stdin:
    response = (
        client.query
        .get(    "Customer",
    ["cust_ID","name","income"])
        .with_near_text({
            "concepts": [input]
        }).with_limit(5)
        .with_additional(["distance"])
        .do()
    )
    
    print(json.dumps(response, indent=2))


# response = client.query.get(
    # "Customer",
    # ["cust_ID","name","income"]
# ).do()
# print(json.dumps(response, indent=4))
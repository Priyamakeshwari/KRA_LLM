import weaviate
import ijson
client = weaviate.Client("http://localhost:8080")
# Settings for displaying the import progress
counter = 0
interval = 20  # print progress every this many records; should be bigger than the batch_size

if client.schema.exists("Customers"):
    client.schema.delete_class("Customers")
    
class_obj = {
    "class": "Customers",
    "vectorizer": "text2vec-huggingface",  # If set to "none" you must always provide vectors yourself. Could be any other "text2vec-*" also.
    "moduleConfig": {
        "model":"BAAI/bge-base-en"
        }# If set to "none" you must always provide vectors yourself. Could be any other "text2vec-*" also.
}
client.schema.create_class(class_obj)


def add_object(obj) -> None:
    global counter
    properties = {
        'cus_id': obj['customer_id'],
        'f_name': obj['first_name'],
        'l_name': obj['last_name'],
        'e-mail': obj['email'],
        'phone_no': obj['phone'],
        'addr': obj['address'],
        
    }

    client.batch.configure(batch_size=100)  # Configure batch
    with client.batch as batch:
        # Add the object to the batch
        batch.add_data_object(
            data_object=properties,
            class_name='Customers',
            # If you Bring Your Own Vectors, add the `vector` parameter here
            # vector=obj.vector
        )

        # Calculate and display progress
        counter += 1
        if counter % interval == 0:
            print(f'Imported {counter} articles...')


print('JSON streaming, to avoid running out of memory on large files...')
with open('customer.json', 'rb') as f:
    objects = ijson.items(f, 'item')
    for o in objects:
        add_object(o)

print(f'Finished importing {counter} articles.')
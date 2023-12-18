from datetime import datetime
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("ServiceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

# Specify the collection name
collection_name = "LastTest_Drop_In_Events"


def has_date_passed(date_string):
    '''
    Args:
        date_string (str): A date string in the format "Monday, December 18, 2023".

    Returns:
        bool: True if the date has already passed, False if it is today or in the future.
    '''

    # Convert the input date string to a datetime object
    target_date = datetime.strptime(date_string, "%A, %B %d, %Y")

    # Get the current date
    current_date = datetime.now()
    # current_date = datetime(2023, 12, 19)

    # Compare the two dates
    return target_date < current_date

collection_name = 'Drop_In_Events'
docs = db.collection(collection_name).get()
for doc in docs:
    data = doc.to_dict()
    date_value = data.get(
        'date')  # Assuming 'date' is the field you want to retrieve
    if date_value is not None:
        if has_date_passed(date_value):
            key = doc.id
            db.collection(collection_name).document(key).delete()
            # print(date_value)

    else:
        # print(f"Document ID: {doc.id}, Date field not found")
        continue
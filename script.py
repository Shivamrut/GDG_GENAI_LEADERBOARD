import json

# Load the existing data
with open("data.json", "r") as file:
    data = json.load(file)

# Add 'rank' key with a default value of 100 to each dictionary
for person in data:
    person["rank"] = 100

# Write the updated data back to the file
with open("data.json", "w") as file:
    json.dump(data, file, indent=2)

print("Added 'rank' key with value 100 to each entry.")

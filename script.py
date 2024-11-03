import json

# Load new data
with open("new.json", "r") as new_file:
    new_data = json.load(new_file)

# Load previous data
with open("prev.json", "r") as prev_file:
    prev_data = json.load(prev_file)

# Create a dictionary for quick lookup of existing ranks in prev.json
prev_rank_map = {person["User Email"]: person["rank"] for person in prev_data if person["rank"] != 100}

# Step 1: Add 'rank' key with a default value of 100 to each entry in new.json or keep the rank from prev.json
for person in new_data:
    email = person["User Email"]
    if email in prev_rank_map:
        # Retain the rank from prev.json if it exists and is not 100
        person["rank"] = prev_rank_map[email]
    else:
        # Default rank is 100 if no previous rank exists
        person["rank"] = 100

# Step 2: Find the highest rank in prev.json (excluding 100)
highest_rank = max([p["rank"] for p in prev_data if p["rank"] != 100], default=100)

# Step 3: Assign new ranks to users with exactly 16 badges (total skill + arcade) if they don't have a rank already
for person in new_data:
    total_badges = person.get("# of Skill Badges Completed", 0) + person.get("# of Arcade Games Completed", 0)
    
    # Only assign a new rank if the person has 16 badges and doesn't already have a valid rank (excluding 100)
    if total_badges == 16 and person["rank"] == 100:
        highest_rank += 1
        person["rank"] = highest_rank

# Step 4: Write the updated new data back to data.json
with open("data.json", "w") as new_file:
    json.dump(new_data, new_file, indent=2)

print("Ranks updated based on prev.json. Users with 16 badges and no previous rank assigned now have new ranks.")

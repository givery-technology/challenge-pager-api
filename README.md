# Information

The goal of this challenge is to create a basic pager API, the specifications for this API are created by using 'api-first-spec' so these are already avalaible to you.

As most of the specification is already defined in the spec files (see the spec folder), some steps might seem to be lacking information to run correctly, in these cases please read the spec file belonging to the step.

Any custom configuration can be done in the config.json file.

All calls done to the API shall be RESTful, all data shall be json.

The [database](./data/database.db) only contains one table called "challenges", which consist out of the following columns:
- Id (int, auto increment)
- Owner (string)
- Title (string)
- Date (timestamp)

The API should have the following options available that will be passed in the url as parameters:
- Offset: This is an integer which defines the offset in the list, so it is possible to skip a certain amount.
    - The default should be 0
- Take: This is an integer which defines how many items to display.
    - The default should be 10
- OrderCol: This integer defines what column to order on.
    - Default order is ascending
    - 0 means Id (Default)
    - 1 means Owner
    - 2 means Title
    - 3 means Date
- OrderDesc: This booleans defines if the order is descending.
    - Default is false
- Filter: This string defines what the values should be filtered on, this applies to all columns except 'Id'
- FromDate: This defines the date to start from.
- ToDate: This defines the date to end from.

The API should also return the following data:
- Total: The total of items in the database
- TotalFilter: The total of items after applying the filter

You are free to use "Comments.md" for any kind of notes, for example:
- Personal notes or problems
- Information on how your code works
- Any suggestions on what should be changed in the specifications.

### Step 1
Implement all basic features so a list of 10 challenges will be returned.

### Step 2
Implement the 'Offset' option

### Step 3
Implement the 'Take' option

### Step 4
Implement the 'OrderCol' and 'OrderDesc' options

### Step 5 
Implement the 'Filter' option

### Step 6
Implement the 'FromDate' and 'ToDate' options
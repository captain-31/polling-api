# Polling API
This is a polling API application built using node, express and mongodb. 

## Routes

- `POST /questions/create` - To create a question
- `POST /questions/:id/options/create` - To add options to a specific question
- `DELETE /questions/:id/delete` - To delete a question (A question can’t be deleted if one of it’s options has votes)
- `DELETE /options/:id/delete` - To delete an option (An option can’t be deleted if it has even one vote given to it)
- `PUT /options/:id/add_vote` - To increment the count of votes
- `GET /questions/:id` - To view a question and it’s options


## Installation

1. Clone the repository:

```bash
git clone https://github.com/captain-31/polling-api.git
cd polling-api
```

2. Install Dependencies:

```bash
npm i
```

3. Run the server.js file

```bash
node server.js
```

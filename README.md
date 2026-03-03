Requirements

Install the following:


Node.js (v18 or higher recommended)


npm (included with Node.js)


PostgreSQL (relational database engine)


MongoDB (NoSQL database engine for auditing)


(Optional) dBeaver for managing PostgreSQL


Clone and install dependencies: `git clone`, `cd`, `npm install`


Environment variables (`.env`)


Connect to your database from dBeaver or psql.


Start MongoDB


If you're using a local MongoDB instance:

`mongod`


Run the server:


Development mode:


`npm run dev`



The server runs at:

http://localhost:3000 (or the configured port)


This project migrates a file (CSV/Excel export) to a normalized relational model (PostgreSQL) and exposes the data through a REST API developed with Node.js and Express. MongoDB is used for audit logging when deleting records (event trail/audit).


1) Installed Dependencies


Nodo.js 18+


PostgreSQL


MongoDB


(Optional) DBeaver


npm installation


PostgreSQL is used as a trusted source for transactional data and entities that require strict constraints:

customers, vendors, categories, products

primary keys, foreign keys, unique constraints, and integrity checks.

MongoDB (Audit Logs)


MongoDB stores audit logs for deletion operations. Each deletion event stores a snapshot of the deleted record, the timestamp, and the request metadata.


POST /products


GET /products


GET /products/:id


PUT /products/:id


DELETE /products/:id (writes an audit log to MongoDB)

--------------------------------------------------------------------------------------------------------

npm init -y 


npm install express pg dotenv


mongodb cors 


npm install multer csv-parse


npm install --save-dev nodemon



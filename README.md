# Correctomatic API

Work in progress. Pending:
- Security roles
- Use a more flexible system for sharing the exercises with the correctomatic processes

This API is the entry point for managing the corrections. It provides and endpoint, `/grade`, that will upload the file to a shared folder and use BullMQ to create a correction task. It also provides endpoints for managing the assignments, the users and the API keys.

API's swagger documentation is available in the `/docs` endpoint.

## Authentication

The API uses two types of authentication:
- **JWT**: The JWT is obtained with the `/login` endpoint. It must be sent in the `Authorization` header.
- **API key**: The API key is passed in the header as `x-api-key`

### JWT Authentication

The JWT token is obtained by calling the `POST /login` endpoint. It will return a JWT token that must be used in the Authorization header for the rest of the requests. This is a login request example from command line:
```sh
curl --request POST \
  --url http://localhost:3000/login \
  --header 'Content-Type: application/json' \
  --data '{
  "user": "<user>",
  "password": "<password>"
}'
```

The JWT token must be sent in the authorization header for subsequent requests:
```sh
curl --request <method> \
  --url <enpoint> \
  --header 'Authorization: Bearer eyJ...8R54jw' \
  ...
```

### API key Authentication

The API key is passed in the `x-api-key` header:
```sh
curl --request <method> \
  --url <enpoint> \
  --header '
  x-api-key: <api-key>
  ...
```

Keys are managed through the API. You can create a new key with the `POST /keys` endpoint. The key is returned in the response. The keys are revoked by deleting them with the `DELETE /keys/:key` endpoint.

You can't use API key authentication for the API key management endpoints.


## Endpoints

The API is documented using OpenAPI. You can access the documentation in the `/docs` endpoint.

### Grading

#### POST /grade

This is the maint endpoint, used to enqueue a correction. The correction will be processed by the different processes in the correction runner.

It expects the input as a multipart form and will return the data in JSON format.

Expected parameters:
- **work_id**: Caller's id of the exercise
- **assignment_id**: Assignment id of the exercise, with the format `user/image`
- **param**: You can include as many fields named `param` with the params that will be passed to the container as environment variables. The content of each field must have the format `ENV_VAR_NAME=VALUE`, being `ENV_VAR_NAME` a valid environment variable name and `VALUE` the value to assign to it.
- **file**: File with the exercise
- **callback**: URL to call with the results

Return value:
- **success**: boolean
- **message**: string ('Work enqueued for grading' or 'Error grading work')

You have the schemas in `grade_schemas.js`:
  - `GRADE_REQUEST_SCHEMA` for the request
  - `GRADE_RESPONSE_SCHEMA` for the response


Example request from command line:

```sh
API_SERVER=http://localhost:3000 # This is where this project is running
CALLBACK_URL=http://localhost:9000 # To receive the results
ASSIGNMENT_ID="<user>/<assignment>"
WORK_ID=$(openssl rand -hex 4) # An internal id for this job, this is generating a random one
FILE="<path to the exercise file>"

curl --request POST \
  --url $API_SERVER/grade \
  --header 'Content-Type: multipart/form-data' \
  --form file=@$FILE \
  --form work_id=$WORK_ID \
  --form assignment_id=$ASSIGNMENT_ID \
  --form param="EXERCISE=exercise 6" \
  --form param="LANGUAGE=javascript"
  --form param=tututu=lalala
  --form callback=http://localhost:9000
```

You should open a server for receiving the results, ie, with netcat:
```sh
nc -lk 9000
```

### Assignment management

There is a REST API for managing the assignments. The endpoints are:

- `GET /assignments`: Get all the assignments
- `POST /assignments`: Create a new assignment **for the user logged in**
- `GET /assignments/:user`: Get all the assignments for a user
- `GET /assignments/:user/:assignment`: Get the details of an assignment
- `PUT /assignments/:user/:assignment`: Update the details of an assignment
- `DELETE /assignments/:user/:assignment`: Delete an assignment


### API key management

- `GET /keys`: Get all the keys for the user logged in
- `POST /keys`: Create a new key for the user logged in
- `DELETE /keys/:key`: Delete a key

### User management

- `POST /login`: Get a JWT token for the user

TO-DO: Add user management endpoints. Only the login endpoint is implemented.


## Configuration

The API uses an `.env` file for the configuration. It must be placed in the app's directory. The most important entries
are for configuring the access to the Redis server and the Database:

```sh
# --------------------------------
# Database options
# --------------------------------
DB_HOST=localhost
...

# --------------------------------
# Environment variables for redis, needed by bullMQ
# --------------------------------
REDIS_HOST=localhost
...
```

You will need to configure a shared folder between the API and the correction processes:
```sh
# Directory where uploaded files are uploaded and shared
UPLOAD_DIRECTORY=/tmp
```

The log level can also be configured for debuggin purposes. The `QUEUE_NAME` is standard, you should'nt modify it.

## Deployment

There is a proyect for building a docker image for the API: [correctomatic-api](https://github.com/correctomatic/API-image). You can use it to deploy the API. The image is available in the [Docker Hub](https://hub.docker.com/r/correctomatic/api).

For the first run you will need to migrate the database. You can do it running the following command in the host  or container:
```sh
yarn migrate
```

For creating the first user you can use the yarn script `create-root-user`. You can run it with the following command:
```sh
ROOT_USER=root ROOT_PASSWORD=$MI_ROOT_PASSWORD yarn create-root-user
```

There is also a `create_user.js` script that will create a user with the provided credentials. Run it with the following command:
```sh
node src/scripts/create_user.js <user> <password> <role1,role2,...>
```

## Development

There is a docker-compose file for development. You can start the services needed by the api
with the command `docker-compose up`.

Before running the app you must create a `.env` file with the configuration for the API. For development, you can simply copy the `.env.example` file. It will be useful to change `JWT_EXPIRES_IN` to something longer, like `30d`, if you don't want to be logging in every time.

After that, install dependencies and you can run the API. It will be available in `http://localhost:3000`:
```sh
yarn dev
```

You can use the [correctomatic-server](https://github.com/correctomatic/correctomatic-server) project to test the API integration with the correction processes.

The tests are not working yet.

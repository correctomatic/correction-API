
## Configuration

TODO: Redis configuration

## Endpoints

### POST /grade

This is the maint endpoint, used to enqueue a correction. The correction will be processed by the different processes in the correction runner.

It expects the input as a multipart form and will return the data in JSON format.

Expected parameters:
- **work_id**: caller's id of the exercise
- **assignment_id**: assignment id of the exercise. This is for computing the docker image for the correction.
  - TO-DO: currently it will use the assignment_id as the image, but this is a security risk.
- **file**: file with the exercise
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
ASSIGNMENT_ID="<id of the assigntment, currently the image name>"
WORK_ID=$(openssl rand -hex 4) # An internal id for this job, this is generating a random one
FILE="<path to the exercise file>"

curl --request POST \
  --url $API_SERVER/grade \
  --header 'Content-Type: multipart/form-data' \
  --form file=@$FILE \
  --form work_id=$WORK_ID \
  --form assignment_id=$ASSIGNMENT_ID \
  --form callback=http://localhost:9000
```

You should open a server for receiving the results, ie, with netcat:
```sh
nc -lk 9000
```

## Notes and TODOs
- **TO-DO**: Assignments / image database
- **TO-DO**: I've been unable to validate multipart forms with openapi schemas

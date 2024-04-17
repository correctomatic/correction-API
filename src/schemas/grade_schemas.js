
const GRADE_REQUEST_SCHEMA = {
  type: 'object',
  properties: {
    work_id: { type: 'string' },
    assignment_id: { type: 'string' },
    callback: { type: 'string' },
    file: { type: 'object', format: 'binary' }
  },
  required: ['work_id', 'assignment_id', 'callback', 'file'],
  additionalProperties: false
}

const GRADE_RESPONSE_SCHEMA = {
  type: 'object',
  required: ['sucess', 'message'],
  properties: {
    sucess: { type: 'boolean' },
    message: { type: 'string' },
  }
}

const GRADE_RESPONSE = {
  200: GRADE_RESPONSE_SCHEMA
  // What to do on errors¿
}

const GRADE_SCHEMA = {
  summary: "Correction request",
  description: "\
  Sends a file for correction.\
  ",
  consumes: ['multipart/form-data'],
  body: GRADE_REQUEST_SCHEMA,
  response: GRADE_RESPONSE
}


// app.post( '/upload', {
//   schema: {
//     description: 'Upload a File, the field name should be "file"',
//     tags: [ 'Files' ],
//     summary: 'Upload',
//     consumes: ['multipart/form-data'],
//     body: {
//       type: 'object',
//       required: ['file'],
//       properties: {
//         file: { $ref: '#mySharedSchema' }
//       }
//     },
//     response: {
//       201: {
//         description: 'Upload OK',
//         type: 'object'
//       },
//       400: {
//         description: 'Bad Request',
//         type: 'object'
//       }
//     }
//   }
// }

export {
  GRADE_SCHEMA,
}

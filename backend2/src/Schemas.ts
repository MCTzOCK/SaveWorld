/**
 * backend2/src/Schemas.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.01.2024
 *
 */

export const FastifySchemas = {
  info: {
    response: {
      200: {
        properties: {
          status: {
            type: "number",
          },
          name: {
            type: "string",
          },
          version: {
            type: "string",
          },
          description: {
            type: "string",
          },
          author: {
            properties: {
              name: {
                type: "string",
              },
              email: {
                type: "string",
              },
              url: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
  account_activate: {
    querystring: {
      properties: {
        token: {
          type: "string",
        },
      },
      required: ["token"],
    },
    response: {
      200: {
        properties: {
          status: {
            type: "number",
          },
          message: {
            type: "string",
          },
        },
      },
      400: {
        properties: {
          status: {
            type: "number",
          },
          error: {
            type: "string",
          },
        },
      },
    },
  },
  account_delete: {
    response: {
      200: {
        properties: {
          status: {
            type: "number",
          },
          message: {
            type: "string",
          },
        },
      },
      401: {
        properties: {
          status: {
            type: "number",
          },
          error: {
            type: "string",
          },
        },
      },
    },
  },
  account_login: {
    body: {
      properties: {
        email: {
          type: "string",
        },
        password: {
          type: "string",
        },
        totpCode: {
          type: "string",
        },
      },
      required: ["email", "password"],
    },
    response: {
      200: {
        status: {
          type: "number",
        },
        message: {
          type: "string",
        },
        token: {
          type: "string",
        },
      },
      400: {
        status: {
          type: "number",
        },
        error: {
          type: "string",
        },
      },
    },
  },
  account_preferences_get: {
    response: {
      200: {
        properties: {
          status: {
            type: "number",
          },
          prefs: {
            type: "object",
          },
        },
      },
      401: {
        properties: {
          status: {
            type: "number",
          },
          error: {
            type: "string",
          },
        },
      },
    },
  },
  account_preferences_post: {
    body: {
      properties: {
        update: {
          type: "object",
        },
      },
    },
    response: {
      401: {
        properties: {
          status: {
            type: "number",
          },
          error: {
            type: "string",
          },
        },
      },
      400: {
        properties: {
          status: {
            type: "number",
          },
          error: {
            type: "string",
          },
        },
      },
      200: {
        properties: {
          prefs: {
            type: "object",
          },
        },
      },
    },
  },
  account_register: {
    body: {
      properties: {
        username: {
          type: "string",
        },
        email: {
          type: "string",
        },
        password: {
          type: "string",
        },
        firstName: {
          type: "string",
        },
        lastName: {
          type: "string",
        },
      },
    },
    response: {
      200: {
        properties: {
          status: {
            type: "number",
          },
          message: {
            type: "string",
          },
        },
      },
      400: {
        properties: {
          status: {
            type: "number",
          },
          error: {
            type: "string",
          },
        },
      },
    },
  },
  account_update: {
    body: {
      properties: {
        update: {
          type: "object",
        },
        totpCode: {
          type: "string",
        },
      },
    },
    response: {
      200: {
        properties: {
          status: {
            type: "number",
          },
          message: {
            type: "string",
          },
          totpSecret: {
            type: "string",
          },
        },
      },
      400: {
        properties: {
          status: {
            type: "number",
          },
          error: {
            type: "string",
          },
        },
      },
      401: {
        properties: {
          status: {
            type: "number",
          },
          error: {
            type: "string",
          },
        },
      },
    },
  },
  account_verify_token: {
    response: {
      401: {
        properties: {
          status: {
            type: "number",
          },
          error: {
            type: "string",
          },
        },
      },
      200: {
        properties: {
          status: {
            type: "number",
          },
          user: {
            properties: {
              id: {
                type: "string",
              },
              email: {
                type: "string",
              },
              firstName: {
                type: "string",
              },
              lastName: {
                type: "string",
              },
              totpActive: {
                type: "boolean",
              },
              role: {
                type: "string",
              },
              username: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
};

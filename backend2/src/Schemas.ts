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
  notifications_my: {
    response: {
      200: {
        properties: {
          status: {
            type: "number",
          },
          entries: {
            type: "array",
          },
          pages: {
            type: "number",
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
  notifications_read: {
    querystring: {
      properties: {
        id: {
          type: "string",
        },
      },
      required: ["id"],
    },
    response: {
      200: {
        properties: {
          status: {
            type: "number",
          },
          notification: {
            type: "object",
          },
        },
      },
      404: {
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
  },
  submit_support_request: {
    body: {
      properties: {
        email: {
          type: "string",
        },
        category: {
          type: "string",
        },
        message: {
          type: "string",
        },
        additionalData: {
          type: "object",
        },
      },
      required: ["email", "category", "message"],
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
  lifestyle_templates: {
    response: {
      200: {
        properties: {
          lst: {
            type: "array",
          },
        },
      },
    },
  },
  lifestyle_my: {
    response: {
      200: {
        properties: {
          status: {
            type: "number",
          },
          lifestyle: {
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
  lifestyle_level: {
    response: {
      200: {
        properties: {
          status: {
            type: "number",
          },
          level: {
            type: "number",
          },
          totalGoals: {
            type: "number",
          },
          achievedGoals: {
            type: "number",
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
  lifestyle_submit: {
    body: {
      properties: {
        goals: {
          type: "array",
        },
      },
      required: ["goals"],
    },
    response: {
      200: {
        properties: {
          status: {
            type: "number",
          },
          data: {
            type: "object",
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
  lifestyle_update: {
    body: {
      properties: {
        goals: {
          type: "array",
        },
        actions: {
          type: "array",
        },
      },
      required: ["goals", "actions"],
    },
    response: {
      200: {
        properties: {
          status: {
            type: "number",
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
  lifestyle_my_weekly: {
    querystring: {
      properties: {
        dayInWeek: {
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
          goals: {
            type: "object",
          },
          startDate: {
            type: "string",
          },
          endDate: {
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
  lifestyle_my_day: {
    params: {
      properties: {
        date: {
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
          data: {
            type: "object",
          },
        },
      },
      404: {
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
  content_categories: {
    querystring: {
      properties: {
        id: {
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
          categories: {
            type: "array",
          },
        },
      },
    },
  },
  videos_suggested: {
    response: {
      200: {
        properties: {
          status: {
            type: "number",
          },
          video: {
            type: "object",
          },
        },
      },
    },
  },
  videos_search_category: {
    querystring: {
      properties: {
        q: {
          type: "string",
        },
        category: {
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
          videos: {
            type: "array",
          },
        },
      },
    },
  },
  videos_history: {
    body: {
      properties: {
        videoId: {
          type: "string",
        },
      },
      required: ["videoId"],
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
      403: {
        properties: {
          status: {
            type: "number",
          },
          error: {
            type: "string",
          },
        },
      },
      404: {
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
  videos_fts: {
    querystring: {
      properties: {
        q: {
          type: "string",
        },
        page: {
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
          videos: {
            type: "array",
          },
          count: {
            type: "number",
          },
        },
      },
    },
  },
  videos_comment: {
    body: {
      properties: {
        content: {
          type: "string",
        },
      },
      required: ["content"],
    },
    params: {
      properties: {
        id: {
          type: "string",
        },
      },
      required: ["id"],
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
      404: {
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
  videos_comments: {
    params: {
      properties: {
        id: {
          type: "string",
        },
      },
      required: ["id"],
    },
    querystring: {
      properties: {
        page: {
          type: "string",
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
        404: {
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
          status: {
            type: "number",
          },
          entries: {
            type: "array",
          },
          pages: {
            type: "number",
          },
        },
      },
    },
  },
  videos_metadata: {
    params: {
      properties: {
        id: {
          type: "string",
        },
      },
      required: ["id"],
    },
    response: {
      200: {
        properties: {
          video: {
            type: "object",
          },
        },
      },
      404: {
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
  videos_rate: {
    body: {
      properties: {
        rating: {
          type: "number",
        },
      },
      required: ["rating"],
    },
    params: {
      properties: {
        id: {
          type: "string",
        },
      },
      required: ["id"],
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
      404: {
        properties: {
          status: {
            type: "number",
          },
          error: {
            type: "string",
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
  },
  eatingplan_get: {
    querystring: {
      properties: {
        date: {
          type: "string",
        },
      },
      required: ["date"],
    },
    response: {
      200: {
        properties: {
          plan: {
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
      404: {
        properties: {
          error: {
            type: "string",
          },
        },
      },
    },
  },
  eatingplan_post: {
    querystring: {
      properties: {
        date: {
          type: "string",
        },
      },
      required: ["date"],
    },
    response: {
      200: {
        properties: {
          plan: {
            type: "object",
          },
        },
      },
      400: {
        properties: {
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
  eatingplan_put: {
    body: {
      properties: {
        date: {
          type: "string",
        },
        recipes: {
          type: "array",
        },
      },
      required: ["date", "recipes"],
    },
    response: {
      200: {
        properties: {
          plan: {
            type: "object",
          },
        },
      },
      404: {
        properties: {
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
  eatingplan_delete: {
    body: {
      properties: {
        date: {
          type: "string",
        },
      },
      required: ["date"],
    },
    response: {
      200: {
        properties: {
          success: {
            type: "boolean",
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
      400: {
        properties: {
          error: {
            type: "string",
          },
        },
      },
    },
  },
};

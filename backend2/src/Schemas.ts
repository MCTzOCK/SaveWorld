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
  eco_projects_my: {
    response: {
      200: {
        properties: {
          projects: {
            type: "array",
          },
          status: {
            type: "number",
          },
        },
      },
      401: {
        properties: {
          error: {
            type: "string",
          },
        },
      },
    },
  },
  eco_projects_list: {
    response: {
      200: {
        properties: {
          entries: {
            type: "array",
          },
          status: {
            type: "number",
          },
          pages: {
            type: "number",
          },
        },
      },
    },
  },
  eco_projects_create: {
    body: {
      properties: {
        name: {
          type: "string",
        },
        startDate: {
          type: "string",
        },
        lastsDays: {
          type: "number",
        },
        geoLocation: {
          type: "string",
        },
      },
      required: ["name", "startDate", "lastsDays", "geoLocation"],
    },
    response: {
      200: {
        properties: {
          project: {
            type: "object",
          },
          status: {
            type: "number",
          },
        },
      },
      400: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
    },
  },
  eco_projects_calendar: {
    querystring: {
      properties: {
        startDate: {
          type: "string",
        },
        endDate: {
          type: "string",
        },
      },
      required: ["startDate", "endDate"],
    },
    response: {
      200: {
        properties: {
          result: {
            type: "array",
          },
          status: {
            type: "number",
          },
        },
      },
    },
  },
  eco_projects_by_lat_lon: {
    querystring: {
      properties: {
        lat: {
          type: "string",
        },
        lon: {
          type: "string",
        },
      },
      required: ["lat", "lon"],
    },
    response: {
      200: {
        properties: {
          entries: {
            type: "array",
          },
          status: {
            type: "number",
          },
        },
      },
    },
  },
  eco_projects_all_geo_locations: {
    response: {
      200: {
        properties: {
          entries: {
            type: "array",
          },
          status: {
            type: "number",
          },
        },
      },
    },
  },
  eco_projects_toggle_member_status: {
    querystring: {
      properties: {
        projectId: {
          type: "string",
        },
      },
    },
    response: {
      404: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      403: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      401: {
        properties: {
          error: {
            type: "string",
          },
        },
      },
      200: {
        properties: {
          memberStatus: {
            type: "number",
          },
          status: {
            type: "number",
          },
        },
      },
    },
  },
  eco_projects_receive: {
    querystring: {
      properties: {
        id: {
          type: "string",
        },
      },
      required: ["id"],
    },
    response: {
      404: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      200: {
        properties: {
          project: {
            type: "object",
          },
          status: {
            type: "number",
          },
        },
      },
    },
  },
  eco_projects_edit: {
    body: {
      properties: {
        name: {
          type: "string",
        },
        startDate: {
          type: "string",
        },
        lastsDays: {
          type: "number",
        },
        geoLocation: {
          type: "string",
        },
      },
      required: ["name", "startDate", "lastsDays", "geoLocation"],
    },
    querystring: {
      properties: {
        id: {
          type: "string",
        },
      },
      required: ["id"],
    },
    response: {
      404: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      403: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      200: {
        properties: {
          project: {
            type: "object",
          },
          status: {
            type: "number",
          },
        },
      },
    },
  },
  eco_projects_delete: {
    querystring: {
      properties: {
        id: {
          type: "string",
        },
      },
      required: ["id"],
    },
    response: {
      404: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      403: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      200: {
        properties: {
          project: {
            type: "object",
          },
          status: {
            type: "number",
          },
        },
      },
    },
  },
  eco_projects_to_calendar: {
    querystring: {
      properties: {
        id: {
          type: "string",
        },
      },
      required: ["id"],
    },
  },
  eco_projects_todo_lists_receive: {
    querystring: {
      properties: {
        id: {
          type: "string",
        },
      },
      required: ["id"],
    },
    response: {
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      400: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      404: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      200: {
        properties: {
          lists: {
            type: "array",
          },
          status: {
            type: "number",
          },
        },
      },
    },
  },
  eco_projects_todo_items: {
    querystring: {
      properties: {
        listId: {
          type: "string",
        },
      },
      required: ["listId"],
    },
    response: {
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      400: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      404: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      200: {
        properties: {
          entries: {
            type: "array",
          },
          status: {
            type: "number",
          },
        },
      },
    },
  },
  eco_projects_todo_delete_list: {
    querystring: {
      properties: {
        listId: {
          type: "string",
        },
        id: {
          type: "string",
        },
      },
      required: ["listId", "id"],
    },
    response: {
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      400: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      404: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
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
    },
  },
  eco_projects_todo_delete_item: {
    querystring: {
      properties: {
        listId: {
          type: "string",
        },
        id: {
          type: "string",
        },
        itemId: {
          type: "string",
        },
      },
      required: ["listId", "id", "itemId"],
    },
    response: {
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      400: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      404: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
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
    },
  },
  eco_projects_todo_create_list: {
    body: {
      properties: {
        title: {
          type: "string",
        },
      },
      required: ["title"],
    },
    querystring: {
      properties: {
        id: {
          type: "string",
        },
      },
      required: ["id"],
    },
    response: {
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      404: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      403: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
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
    },
  },
  eco_projects_todo_create_item: {
    querystring: {
      properties: {
        id: {
          type: "string",
        },
        listId: {
          type: "string",
        },
      },
      required: ["id", "listId"],
    },
    body: {
      properties: {
        title: {
          type: "string",
        },
        description: {
          type: "string",
        },
      },
      required: ["title", "description"],
    },
    response: {
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      404: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      403: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      200: {
        properties: {
          status: {
            type: "number",
          },
          message: {
            type: "string",
          },
          item: {
            type: "object",
          },
        },
      },
    },
  },
  eco_projects_todo_check_item: {
    querystring: {
      properties: {
        id: {
          type: "string",
        },
        listId: {
          type: "string",
        },
        itemId: {
          type: "string",
        },
      },
      required: ["id", "listId", "itemId"],
    },
    response: {
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      404: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      403: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
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
    },
  },
  eco_projects_members_delete: {
    querystring: {
      properties: {
        projectId: {
          type: "string",
        },
        userId: {
          type: "string",
        },
      },
      required: ["projectId", "userId"],
    },
    response: {
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      404: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      403: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
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
    },
  },
  eco_projects_members_change_role: {
    querystring: {
      properties: {
        projectId: {
          type: "string",
        },
        userId: {
          type: "string",
        },
        newRole: {
          type: "string",
        },
      },
      required: ["projectId", "userId", "newRole"],
    },
    response: {
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      404: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      403: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
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
    },
  },
  eco_projects_homepage_segments: {
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
          segments: {
            type: "array",
          },
          status: {
            type: "number",
          },
        },
      },
      404: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
    },
  },
  eco_projects_homepage_update_segments: {
    body: {
      properties: {
        title: {
          type: "string",
        },
        content: {
          type: "string",
        },
        type: {
          type: "string",
        },
        pinned: {
          type: "boolean",
        },
      },
      required: ["title", "content", "type"],
    },
    querystring: {
      properties: {
        projectId: {
          type: "string",
        },
        id: {
          type: "string",
        },
      },
      required: ["projectId", "id"],
    },
  },
  response: {
    401: {
      properties: {
        error: {
          type: "string",
        },
        status: {
          type: "number",
        },
      },
    },
    400: {
      properties: {
        error: {
          type: "string",
        },
        status: {
          type: "number",
        },
      },
    },
    404: {
      properties: {
        error: {
          type: "string",
        },
        status: {
          type: "number",
        },
      },
    },
    403: {
      properties: {
        error: {
          type: "string",
        },
        status: {
          type: "number",
        },
      },
    },
    200: {
      properties: {
        status: {
          type: "number",
        },
        segment: {
          type: "object",
        },
      },
    },
  },
  eco_projects_homepage_delete_segment: {
    querystring: {
      properties: {
        projectId: {
          type: "string",
        },
        id: {
          type: "string",
        },
      },
      required: ["projectId", "id"],
    },
    response: {
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
        404: {
          properties: {
            error: {
              type: "string",
            },
            status: {
              type: "number",
            },
          },
        },
        403: {
          properties: {
            error: {
              type: "string",
            },
            status: {
              type: "number",
            },
          },
        },
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
      },
    },
  },
  eco_projects_homepage_create_segment: {
    querystring: {
      properties: {
        projectId: {
          type: "string",
        },
      },
      required: ["projectId"],
    },
    body: {
      properties: {
        title: {
          type: "string",
        },
        content: {
          type: "string",
        },
        type: {
          type: "string",
        },
        pinned: {
          type: "boolean",
        },
      },
      required: ["title", "content", "type"],
    },
    response: {
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
        404: {
          properties: {
            error: {
              type: "string",
            },
            status: {
              type: "number",
            },
          },
        },
        403: {
          properties: {
            error: {
              type: "string",
            },
            status: {
              type: "number",
            },
          },
        },
        200: {
          properties: {
            status: {
              type: "number",
            },
            segment: {
              type: "object",
            },
          },
        },
      },
    },
  },
  recipes_all: {
    querystring: {
      properties: {
        page: {
          type: "string",
        },
        q: {
          type: "string",
        },
      },
      required: ["page", "q"],
    },
    response: {
      200: {
        properties: {
          entries: {
            type: "array",
          },
          pages: {
            type: "number",
          },
          status: {
            type: "number",
          },
        },
      },
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "string",
          },
        },
      },
    },
  },
  recipes_create: {
    body: {
      properties: {
        title: {
          type: "string",
        },
        ingredients: {
          type: "array",
        },
        steps: {
          type: "array",
        },
        image: {
          type: "string",
        },
      },
      required: ["title", "ingredients", "steps", "image"],
    },
    response: {
      200: {
        type: "object",
      },
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "string",
          },
        },
      },
    },
  },
  recipes_delete: {
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
        type: "object",
      },
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "string",
          },
        },
      },
    },
  },
  recipes_my: {
    querystring: {
      properties: {
        page: {
          type: "string",
        },
        q: {
          type: "string",
        },
      },
      required: ["page"],
    },
    response: {
      200: {
        properties: {
          entries: {
            type: "array",
          },
          pages: {
            type: "number",
          },
          status: {
            type: "number",
          },
        },
      },
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "string",
          },
        },
      },
    },
  },
  recipes_receive: {
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
        type: "object",
      },
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "string",
          },
        },
      },
    },
  },
  recipes_update: {
    body: {
      properties: {
        title: {
          type: "string",
        },
        ingredients: {
          type: "array",
        },
        steps: {
          type: "array",
        },
        image: {
          type: "string",
        },
      },
      required: ["title", "ingredients", "steps", "image"],
    },
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
        type: "object",
      },
      401: {
        properties: {
          error: {
            type: "string",
          },
        },
      },
      403: {
        properties: {
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
  communtiy_suggested: {
    querystring: {
      properties: {
        page: {
          type: "string",
        },
      },
      required: ["page"],
    },
    response: {
      200: {
        properties: {
          entries: {
            type: "array",
          },
          pages: {
            type: "number",
          },
          status: {
            type: "number",
          },
        },
      },
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
    },
  },
  communtiy_search: {
    querystring: {
      properties: {
        page: {
          type: "string",
        },
        q: {
          type: "string",
        },
        type: {
          type: "string",
        },
      },
      required: ["page", "q", "type"],
    },
    response: {
      200: {
        properties: {
          entries: {
            type: "array",
          },
          pages: {
            type: "number",
          },
          status: {
            type: "number",
          },
        },
      },
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      400: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
    },
  },
  community_following: {
    querystring: {
      properties: {
        page: {
          type: "string",
        },
      },
      required: ["page"],
    },
    response: {
      200: {
        properties: {
          entries: {
            type: "array",
          },
          pages: {
            type: "number",
          },
          status: {
            type: "number",
          },
        },
      },
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
    },
  },
  community_blog_comment: {
    querystring: {
      properties: {
        id: {
          type: "string",
        },
      },
      required: ["id"],
    },
    body: {
      properties: {
        comment: {
          type: "string",
        },
      },
      required: ["comment"],
    },
    response: {
      200: {
        properties: {
          entry: {
            type: "object",
          },
          status: {
            type: "number",
          },
        },
      },
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      400: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      404: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
    },
  },
  community_blog_create: {
    body: {
      properties: {
        title: {
          type: "string",
        },
        content: {
          type: "string",
        },
        tags: {
          type: "array",
        },
      },
      required: ["comment", "content", "tags"],
    },
    response: {
      200: {
        properties: {
          entry: {
            type: "object",
          },
          status: {
            type: "number",
          },
        },
      },
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      400: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
    },
  },
  community_blog_delete: {
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
          entry: {
            type: "object",
          },
          status: {
            type: "number",
          },
        },
      },
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      403: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      404: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
    },
  },
  community_blog_like: {
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
          entry: {
            type: "object",
          },
          status: {
            type: "number",
          },
        },
      },
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      404: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
    },
  },
  community_blog_receive: {
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
          entry: {
            type: "object",
          },
          status: {
            type: "number",
          },
        },
      },
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      400: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      404: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
    },
  },
  community_profile_receive: {
    params: {
      properties: {
        username: {
          type: "string",
        },
      },
      required: ["username"],
    },
    response: {
      200: {
        properties: {
          profile: {
            type: "object",
          },
          level: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      403: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      400: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      404: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
    },
  },
  community_profile_follow: {
    params: {
      properties: {
        username: {
          type: "string",
        },
      },
      required: ["username"],
    },
    response: {
      200: {
        properties: {
          profile: {
            type: "object",
          },
          level: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      403: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      404: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
    },
  },
  community_profile_blogs: {
    params: {
      properties: {
        username: {
          type: "string",
        },
      },
      required: ["username"],
    },
    querystring: {
      properties: {
        page: {
          type: "string",
        },
      },
      required: ["page"],
    },
    response: {
      200: {
        properties: {
          entries: {
            type: "array",
          },
          pages: {
            type: "number",
          },
          status: {
            type: "number",
          },
        },
      },
      401: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
      400: {
        properties: {
          error: {
            type: "string",
          },
          status: {
            type: "number",
          },
        },
      },
    },
  },
  admin_stats: {
    response: {
      200: {
        properties: {
          stats: {
            type: "object",
          },
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
            type: "number",
          },
        },
      },
    },
  },
  admin_users: {
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
          users: {
            type: "array",
          },
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
            type: "number",
          },
        },
      },
    },
  },
  admin_users_delete: {
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
          success: {
            type: "boolean",
          },
        },
      },
      403: {
        properties: {
          status: {
            type: "number",
          },
          error: {
            type: "number",
          },
        },
      },
      404: {
        properties: {
          status: {
            type: "number",
          },
          error: {
            type: "number",
          },
        },
      },
    },
  },
  admin_users_update: {
    querystring: {
      properties: {
        id: {
          type: "string",
        },
      },
    },
    body: {
      properties: {
        update: {
          type: "object",
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
          user: {
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
            type: "number",
          },
        },
      },
    },
  },
  admin_support_request_get: {
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
          entry: {
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
            type: "number",
          },
        },
      },
    },
  },
  admin_support_request_post: {
    querystring: {
      properties: {
        id: {
          type: "string",
        },
      },
    },
    body: {
      properties: {
        message: {
          type: "object",
        },
      },
    },
    response: {
      200: {
        properties: {
          status: {
            type: "number",
          },
          entry: {
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
            type: "number",
          },
        },
      },
    },
  },
  admin_support_requests: {
    querystring: {
      properties: {
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
  admin_lifestyle_template_add: {
    body: {
      properties: {
        name: {
          type: "string",
        },
        goal: {
          type: "string",
        },
      },
      required: ["name", "goal"],
    },
    response: {
      200: {
        properties: {
          status: {
            type: "number",
          },
          lst: {
            type: "object",
          },
        },
      },
    },
  },
  admin_lifestyle_template_delete: {
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
  admin_lifestyle_template_update: {
    body: {
      properties: {
        id: {
          type: "string",
        },
        name: {
          type: "string",
        },
        goal: {
          type: "string",
        },
      },
      required: ["id", "goal", "name"],
    },
    response: {
      200: {
        properties: {
          status: {
            type: "number",
          },
          lst: {
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
};

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
  info: {},
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
    },
  },
  notifications_my: {
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
        additionalData: {},
      },
      required: ["email", "category", "message"],
    },
    response: {
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
  lifestyle_templates: {},
  lifestyle_my: {
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
    },
  },
  lifestyle_level: {
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
  },
  videos_suggested: {},
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
      401: {
        properties: {
          error: {
            type: "string",
          },
        },
      },
    },
  },
  eco_projects_list: {},
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
    response: {},
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
  },
  eco_projects_all_geo_locations: {},
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
      },
    },
  },
  eco_projects_homepage_create_segment: {
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
      required: ["page"],
    },
    response: {
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
      required: ["page", "type"],
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
      required: ["content", "tags"],
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
  admin_insights_api_requests: {
    querystring: {
      properties: {
        page: {
          type: "string",
        },
        filter: {
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
      },
      200: {
        properties: {
          requests: {
            type: "array",
          },
          count: {
            type: "number",
          },
          pages: {
            type: "number",
          },
        },
      },
    },
  },
  admin_stats: {
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
  admin_users_delete: {
    querystring: {
      properties: {
        id: {
          type: "string",
        },
      },
    },
    response: {
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
  admin_support_request_get: {
    querystring: {
      properties: {
        id: {
          type: "string",
        },
      },
    },
    response: {
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
          type: "string",
        },
      },
    },
    response: {
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
  admin_support_requests: {
    querystring: {
      properties: {
        page: {
          type: "string",
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
  admin_create_category: {
    body: {
      properties: {
        name: {
          type: "string",
        },
        description: {
          type: "string",
        },
        image: {
          type: "string",
        },
      },
    },
    response: {
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
  admin_delete_category: {
    querystring: {
      properties: {
        id: {
          type: "string",
        },
      },
    },
    response: {
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
  admin_create_video: {
    body: {
      properties: {
        title: {
          type: "string",
        },
        description: {
          type: "string",
        },
        sources: {
          type: "array",
        },
        youtubeVideoId: {
          type: "string",
        },
        categories: {
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
      },
    },
  },
  admin_delete_video: {
    querystring: {
      properties: {
        id: {
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
  admin_list_videos: {
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
      },
    },
  },
  admin_update_video: {
    querystring: {
      properties: {
        id: {
          type: "string",
        },
      },
    },
    body: {
      properties: {
        title: {
          type: "string",
        },
        description: {
          type: "string",
        },
        categories: {
          type: "array",
        },
        sources: {
          type: "array",
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
};

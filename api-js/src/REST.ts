/**
 * api/src/REST.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.08.2023
 *
 */
import makeRequest from "./util/makeRequest";
import { RESTEnv } from "./RESTEnv";

export class REST {
  public static Admin = {
    /**
     * @return the stats of the system (user count, category count, ...)
     * @param token used to authenticate
     */
    stats: async (token: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/admin/stats",
        method: "GET",
        token: token,
      });
    },
    /**
     * @return the requested user(s)
     * @param token used to authenticate
     * @param id of the user to get
     */
    users: async (token: string, id?: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/admin/users" + (id ? "?id=" + id : ""),
        method: "GET",
        token: token,
      });
    },
    /**
     * Updates a user account
     * @param token used to authenticate
     * @param id of the user to update
     * @param update the update object
     */
    updateUser: async (token: string, id: string, update: any) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/admin/users/update?id=" + id,
        method: "POST",
        token: token,
        body: {
          update: update,
        },
      });
    },
    /**
     * Deletes a user account
     * @param token used to authenticate
     * @param id of the user to delete
     */
    deleteUser: async (token: string, id: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/admin/users/delete?id=" + id,
        method: "DELETE",
        token: token,
      });
    },
    /**
     * Creates a category
     * @param token used to authenticate
     * @param name of the category
     * @param description of the category
     * @param image of the category (url)
     */
    createCategory: async (
      token: string,
      name: string,
      description: string,
      image: string,
    ) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/admin/content/categories",
        method: "POST",
        token: token,
        body: {
          name: name,
          description: description,
          image: image,
        },
      });
    },
    /**
     * Deletes a category
     * @param token used to authenticate
     * @param id of the category to delete
     */
    deleteCategory: async (token: string, id: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/admin/content/categories?id=" + id,
        method: "DELETE",
        token: token,
      });
    },
    /**
     * @return all videos
     * @param token used to authenticate
     * @param page the page to get
     */
    videos: async (token: string, page: number) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/admin/content/videos/list?page=" + page,
        method: "GET",
        token,
      });
    },
    /**
     * Deletes a video
     * @param token used to authenticate
     * @param id of the video to delete
     */
    deleteVideo: async (token: string, id: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/admin/content/videos/delete?id=" + id,
        method: "DELETE",
        token: token,
      });
    },
    /**
     * Updates a video
     * @param token used to authenticate
     * @param id of the video to update
     * @param title of the video
     * @param description of the video
     * @param categories of the video
     */
    updateVideo: async (
      token: string,
      id: string,
      title: string,
      description: string,
      categories: string[],
    ) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/admin/content/videos/update?id=" + id,
        method: "POST",
        token: token,
        body: {
          title: title,
          description: description,
          categories: categories,
        },
      });
    },
    /**
     * Create a lifestyle template
     * @param token used to authenticate
     * @param name of the template
     * @param goal of the template
     */
    createLifestyleTemplate: async (
      token: string,
      name: string,
      goal: string,
    ) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/admin/lifestyle/templates/add",
        method: "POST",
        token: token,
        body: {
          name: name,
          goal: goal,
        },
      });
    },
    /**
     * Deletes a lifestyle template
     * @param token used to authenticate
     * @param id of the template to delete
     */
    deleteLifestyleTemplate: async (token: string, id: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/admin/lifestyle/templates/delete?id=" + id,
        method: "DELETE",
        token: token,
      });
    },
    /**
     * Updates a lifestyle template
     * @param token used to authenticate
     * @param id of the template to update
     * @param name (new) of the template
     * @param goal (new) of the template
     */
    updateLifestyleTemplate: async (
      token: string,
      id: string,
      name: string,
      goal: string,
    ) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/admin/lifestyle/templates/update?id=" + id,
        method: "POST",
        token: token,
        body: {
          name: name,
          goal: goal,
        },
      });
    },
    /**
     * @return the requested support requests
     * @param token used to authenticate
     * @param page the page to get
     */
    supportRequests: async (token: string, page: number) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/admin/support/requests?page=" + page,
        method: "GET",
        token: token,
      });
    },
    /**
     * @return the requested support request
     * @param token used to authenticate
     * @param id of the request to get
     */
    supportRequest: async (token: string, id: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/admin/support/request?id=" + id,
        method: "GET",
        token: token,
      });
    },
    /**
     * Updates a support request
     * @param token used to authenticate
     * @param id of the request to update
     * @param message? the message to send to the user
     */
    processSupportRequest: async (
      token: string,
      id: string,
      message?: string,
    ) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/admin/support/request?id=" + id,
        method: "POST",
        token: token,
        body: {
          message: message,
        },
      });
    },
  };

  public static Account = {
    /**
     * @return the requested jwt
     * @param mail of the user
     * @param password of the user
     * @param totpCode of the user (optional, if enabled)
     */
    login: async (mail: string, password: string, totpCode?: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/account/login",
        method: "POST",
        body: {
          email: mail,
          password: password,
          totpCode: totpCode,
        },
      });
    },
    /**
     * Creates a new user account
     * @param options user data
     */
    register: async (options: {
      mail: string;
      password: string;
      username: string;
      firstName: string;
      lastName: string;
    }) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/account/register",
        method: "POST",
        body: {
          email: options.mail,
          password: options.password,
          username: options.username,
          firstName: options.firstName,
          lastName: options.lastName,
        },
      });
    },
    /**
     * @return the requested user by jwt
     * @param token used to authenticate
     */
    verify: async (token: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/account/verify-token",
        method: "GET",
        token: token,
      });
    },
    /**
     * Updates a user account
     * @param token used to authenticate
     * @param options the update object
     */
    update: async (
      token: string,
      options: {
        password?: string;
        firstName?: string;
        lastName?: string;
        totpActive?: boolean;
        totpCode?: string;
      },
    ) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/account/update",
        method: "POST",
        token: token,
        body: {
          update: {
            password: options.password,
            firstName: options.firstName,
            lastName: options.lastName,
            totpActive: options.totpActive,
          },
          totpCode: options.totpCode,
        },
      });
    },
    /**
     * Deletes a user account
     * @param token used to authenticate
     */
    delete: async (token: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/account/delete",
        method: "DELETE",
        token: token,
      });
    },
    /** Returns the user preferences
     * @param token used to authenticate
     */
    preferences: async (token: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/account/preferences",
        method: "GET",
        token: token,
      });
    },
    /**
     * Updates the user preferences
     * @param token used to authenticate
     * @param update the update object
     */
    updatePreferences: async (token: string, update: any) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/account/preferences",
        method: "POST",
        token: token,
        body: {
          update: update,
        },
      });
    },
  };

  public static Content = {
    /**
     * @return all categories
     */
    categories: async () => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/content/categories",
        method: "GET",
      });
    },
    /**
     * @return the metadata of the requested video
     */
    videoMetadata: async (s3id: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/content/videos/" + s3id + "/metadata",
        method: "GET",
      });
    },
    /**
     * @return the next suggested video
     * @param token used to authenticate
     */
    nextVideo: async (token: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/content/videos/suggested",
        method: "GET",
        token: token,
      });
    },
    /**
     * Adds a video to watch history
     * @param token used to authenticate
     * @param videoId of the video
     * @param time the time in seconds
     * @param finished if the video is finished
     */
    addVideoToHistory: async (token: string, videoId: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/content/videos/history",
        method: "POST",
        token: token,
        body: {
          videoId: videoId,
        },
      });
    },
    /**
     * @return the requested videos
     * @param query the query to search for
     * @param page the page to get
     */
    search: async (query: string, page: number) => {
      return await makeRequest({
        path:
          RESTEnv.API_URL + "/content/videos/fts?q=" + query + "&page=" + page,
        method: "GET",
      });
    },
    /**
     * Rates a video
     * @param id of the video to get
     * @param rating the rating to set
     */
    rate: async (id: string, rating: number) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/content/videos/" + id + "/rate",
        method: "POST",
        body: {
          rating: rating,
        },
      });
    },
  };

  public static Tracker = {
    /**
     * Creates a new eco action
     * @param token used to authenticate
     * @param action the action to create
     * @param description the description of the action
     * @param date the date of the action
     */
    createAction: async (
      token: string,
      action: string,
      description: string,
      date: string,
    ) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/tracker/createAction",
        method: "POST",
        token: token,
        body: {
          action: action,
          description: description,
          date: date,
        },
      });
    },
    /**
     * Deletes an eco action
     * @param token used to authenticate
     * @param id of the action to delete
     */
    deleteAction: async (token: string, id: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/tracker/deleteAction?id=" + id,
        method: "DELETE",
        token: token,
      });
    },
    /**
     * Updates an eco action
     * @param token used to authenticate
     * @param id of the action to update
     * @param action the action to create
     * @param description the description of the action
     * @param date the date of the action
     */
    updateAction: async (
      token: string,
      id: string,
      action: string,
      description: string,
      date: string,
    ) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/tracker/updateAction?id=" + id,
        method: "POST",
        token: token,
        body: {
          action: action,
          description: description,
          date: date,
        },
      });
    },
    /**
     * @return the requested eco actions
     * @param token used to authenticate
     * @param date the date to get
     */
    actions: async (token: string, date: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/tracker/actions?date=" + date,
        method: "GET",
        token: token,
      });
    },
    /**
     * @return all dates with eco actions
     * @param token used to authenticate
     */
    dates: async (token: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/tracker/dates",
        method: "GET",
        token: token,
      });
    },
  };

  public static Lifestyle = {
    /**
     * @return all lifestyle templates
     */
    templates: async () => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/lifestyle/templates",
        method: "GET",
      });
    },
    /**
     * @return the lifestyle of the user
     * @param token used to authenticate
     */
    my: async (token: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/lifestyle/my",
        method: "GET",
        token: token,
      });
    },
    /**
     * Updates the lifestyle of the user
     * @param token used to authenticate
     * @param actions the actions to set
     * @param goals the goals to set
     */
    update: async (token: string, actions: any[], goals: any[]) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/lifestyle/my/update",
        method: "POST",
        token: token,
        body: {
          actions: actions,
          goals: goals,
        },
      });
    },
    /**
     * Submits a new lifestyle summary for the current day
     * @param token used to authenticate
     * @param goals the goals to set
     */
    submit: async (token: string, goals: any[]) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/lifestyle/my/submit",
        method: "POST",
        token: token,
        body: {
          goals: goals,
        },
      });
    },
    /**
     * @return the lifestyle summary of the requested day
     * @param token used to authenticate
     * @param date the date to get
     */
    summary: async (token: string, date: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/lifestyle/my/day/" + date,
        method: "GET",
        token: token,
      });
    },
    /**
     * @return the lifestyle summary of the current week
     * @param token used to authenticate
     * @param dayInWeek some day in the week to get
     */
    weekly: async (token: string, dayInWeek?: string) => {
      return await makeRequest({
        path:
          RESTEnv.API_URL +
          "/lifestyle/my/weekly" +
          (dayInWeek ? "?dayInWeek=" + dayInWeek : ""),
        method: "GET",
        token: token,
      });
    },
    /**
     * @return the current lifestyle level based on the last period
     * @param token used to authenticate
     */
    level: async (token: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/lifestyle/my/level",
        method: "GET",
        token: token,
      });
    },
  };

  public static Community = {
    /**
     * @return the requested user profile
     * @param token used to authenticate
     * @param username of the user to get
     */
    profile: async (token: string, username: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/community/profile/" + username,
        method: "GET",
        token: token,
      });
    },
    /**
     * Creates a new blog entry
     * @param token used to authenticate
     * @param title of the blog entry
     * @param content of the blog entry
     * @param tags of the blog entry
     */
    createBlogEntry: async (
      token: string,
      title: string,
      content: string,
      tags: string[],
    ) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/community/blog/create",
        method: "POST",
        token: token,
        body: {
          title: title,
          content: content,
          tags: tags,
        },
      });
    },
    /**
     * @return the requested blog entry
     * @param token used to authenticate
     * @param id of the blog entry to get
     */
    blogEntry: async (token: string, id: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/community/blog/receive?id=" + id,
        method: "GET",
        token: token,
      });
    },
    /**
     * Toggles the like of a blog entry
     * @param token used to authenticate
     * @param id of the blog entry to like
     */
    likeBlogEntry: async (token: string, id: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/community/blog/like?id=" + id,
        method: "POST",
        token: token,
      });
    },
    /**
     * Deletes a blog entry
     * @param token used to authenticate
     * @param id of the blog entry to delete
     */
    deleteBlogEntry: async (token: string, id: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/community/blog/delete?id=" + id,
        method: "DELETE",
        token: token,
      });
    },
    /**
     * Creates a new comment
     * @param token used to authenticate
     * @param id of the blog entry to comment
     * @param comment the comment to create
     */
    commentBlogEntry: async (token: string, id: string, comment: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/community/blog/comment?id=" + id,
        method: "POST",
        token: token,
        body: {
          comment: comment,
        },
      });
    },
    /**
     * @return the requested blog entries of the user
     * @param token used to authenticate
     * @param username of the user to get
     * @param page the page to get
     */
    blogEntries: async (token: string, username: string, page: number) => {
      return await makeRequest({
        path:
          RESTEnv.API_URL +
          "/community/profile/" +
          username +
          "/blogs?page=" +
          page,
        method: "GET",
        token: token,
      });
    },
    /**
     * Toggle the follow of a user
     * @param token used to authenticate
     * @param username of the user to follow
     */
    follow: async (token: string, username: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/community/profile/" + username + "/follow",
        method: "POST",
        token: token,
      });
    },
    /**
     * @return the requested blog entries of users the user follows
     * @param token used to authenticate
     * @param page the page to get
     */
    followingBlogEntries: async (token: string, page: number) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/community/following?page=" + page,
        method: "GET",
        token: token,
      });
    },
    /**
     * @return the suggested blog entries
     * @param token used to authenticate
     * @param page the page to get
     */
    suggestedBlogEntries: async (token: string, page: number) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/community/suggested?page=" + page,
        method: "GET",
        token: token,
      });
    },
    /**
     * @return the requested search results
     * @param token used to authenticate
     * @param query the query to search for
     * @param type the type to search for (posts, profiles)
     * @param page the page to get
     */
    search: async (
      token: string,
      query: string,
      type: string,
      page: number,
    ) => {
      return await makeRequest({
        path:
          RESTEnv.API_URL +
          "/community/search?q=" +
          query +
          "&type=" +
          type +
          "&page=" +
          page,
        method: "GET",
        token: token,
      });
    },
  };

  public static Notifications = {
    /**
     * @return the requested notifications
     * @param token used to authenticate
     * @param page the page to get
     */
    notifications: async (token: string, page: number) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/notifications/my?page=" + page,
        method: "GET",
        token: token,
      });
    },
    /**
     * Marks a notification as read
     * @param token used to authenticate
     * @param id of the notification to mark as read
     * @return the updated notification
     */
    read: async (token: string, id: string) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/notifications/read?id=" + id,
        method: "POST",
        token: token,
      });
    },
  };

  public static Support = {
    /**
     * Submits a new support request
     * @param email of the user
     * @param category of the request
     * @param message of the request
     * @param additionalData of the request
     */
    submit: async (
      email: string,
      category: string,
      message: string,
      additionalData: string,
    ) => {
      return await makeRequest({
        path: RESTEnv.API_URL + "/submit-support-request",
        method: "POST",
        body: {
          email: email,
          category: category,
          message: message,
          additionalData: additionalData,
        },
      });
    },
  };
}

/** @format */
import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "articles",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    articlesRequested: (articles, action) => {
      articles.loading = true;
    },
    articlesReceived: (articles, action) => {
      articles.list = action.payload;
      articles.loading = false;
      articles.lastFetch = Date.now();
    },
    articleResolvedFailed: (articles, action) => {
      articles.loading = false;
    },
    articleAssignedToUser: (articles, action) => {
      const {  userId } = action.payload;
      const index = articles.list.findIndex((article) => article.id);
      articles.list[index].userId = userId;
    },
    articleAdded: (articles, action) => {
      articles.list.push(action.payload);
    },
    articleResolved: (articles, action) => {
      const index = articles.list.findIndex((article) => article.id);
      articles.list[index].resolved = true;
    },
  },
});

export const {
  articleAdded,
  articleResolved,
  articleAssignedToUser,
  articlesReceived,
  articlesRequested,
  articleResolvedFailed
} = slice.actions;
export default slice.reducer;

const url = "/articles";
export const loadArticles = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.articles;

  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  if (diffInMinutes < 10) return;
  dispatch(
    apiCallBegan({
      url,
      onStart: articlesRequested.type,
      onSuccess: articlesReceived.type,
      onError: articleResolvedFailed.type,
    }),
  );
};
export const addArticle = (article) =>
  apiCallBegan({
    url,
    method: "post",
    data: article,
    onSuccess: articleAdded.type,
  });
export const resolveArticle = (id) =>
  apiCallBegan({
    url: url + "/" + id,
    method: "patch",
    data: { resolved: true },
    onSuccess: articleResolved.type,
  });
export const assignArticleToUser = (id, userId) =>
  apiCallBegan({
    url: url + "/" + id,
    method: "patch",
    data: { userId },
    onSuccess: articleAssignedToUser.type,
  });
export const getUnresolvedArticles = createSelector(
  (state) => state.articles,
  (articles) => articles.filter((article) => !article.reducer),
);

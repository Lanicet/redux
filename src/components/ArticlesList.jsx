import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadArticles, getUnresolvedArticles,  } from "../store/articles";

const ArticlesList = () => {
    const dispatch = useDispatch();
   const articles = useSelector(state => state.entities.articles.list);
   useEffect(() => {
        dispatch(loadArticles());
        

    },[]);
    return (      
         <ul>
        {articles.map(article =>(<li key={article.id}>{article.description}</li>))}
    </ul> );
}
 
export default ArticlesList;
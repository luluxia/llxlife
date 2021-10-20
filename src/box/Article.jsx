import React, { useEffect, useState } from "react"
import { useQuery, gql } from "@apollo/client"
import { useParams } from "react-router"
import edjsParser from "editorjs-parser"
function Article(props) {
  const { id } = useParams()
  const { data } = useQuery(gql`
    query GetArticle($id: Int) {
      llxlife_article(where: {id: {_eq: $id}}) {
        title
        tag
        time
        data
      }
    }
  `, {
    variables: { id: id }
  })
  const [article, setArticle] = useState({})
  const parser = new edjsParser()
  useEffect(() => {
    if (data) {
      setArticle({
        ...data.llxlife_article[0],
        html: parser.parse(data.llxlife_article[0].data)
      })
      props.flushCover('sub')
    }
  }, [data])
  return (
    <article className="article">
      {
        article.title && (
          <>
            <div className="article-header">
              <div className="article-header-title">
                <span className="article-tag">{article.tag}</span>
                <h1 className="box-title">{article.title}</h1>
              </div>
              <p className="article-time">{new Date(article.time).toLocaleString('cn-ZH', { hour12: false })}</p>
            </div>
            <div dangerouslySetInnerHTML={{__html: article.html}} className="article-content">

            </div>
          </>
        )
      }
    </article>
  )
}
export default Article
import React, { useEffect } from "react"
import { useQuery, gql } from "@apollo/client"
function ArticleList(props) {
  const { data } = useQuery(gql`
    query MyQuery {
      llxlife_article {
        id
      }
    }
  `)
  useEffect(() => {
    console.log(data)
  }, [data])
  return (
    <>
      <h1 className="box-title">博文</h1>
      <div onClick={() => {props.openSub()}} className="article-list">
        <div className="article-item">
          <p className="article-time">2021-8-8</p>
          <p className="article-title">关于陆陆侠的生活</p>
          <p className="article-tag">作品诞生记</p>
        </div>
        <div className="article-item">
          <p className="article-time">2021-8-8</p>
          <p className="article-title">关于陆陆侠的生活</p>
          <p className="article-tag">作品诞生记</p>
        </div>
        <div className="article-item">
          <p className="article-time">2021-8-8</p>
          <p className="article-title">关于陆陆侠的生活</p>
          <p className="article-tag">作品诞生记</p>
        </div>
      </div>
    </>
  )
}
export default ArticleList
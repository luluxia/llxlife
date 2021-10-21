import React, { useEffect, useState } from "react"
import { useQuery, gql } from "@apollo/client"
import { useHistory } from "react-router"
function ArticleList(props) {
  const history = useHistory()
  const [finish, setFinish] = useState(0)
  const { data, fetchMore } = useQuery(gql`
    query GetArticles($offset: Int) {
      llxlife_article(limit: 10, offset: $offset, where: {hide: {_eq: 0}}, order_by: {id: desc}) {
        id
        tag
        title
        time
      }
      llxlife_article_aggregate {
        aggregate {
          count
        }
      }
    }
  `, {
    variables: { offset: 0 }
  })
  function loadMore() {
    fetchMore({
      variables: {
        offset: data.llxlife_article.length
      }
    })
  }
  useEffect(() => {
    if (data && !props.sub) {
      if (data.llxlife_article.length == data.llxlife_article_aggregate.aggregate.count) {
        setFinish(1)
      }
      props.flushCover()
    }
  }, [data])
  return (
    <>
      <h1 className="box-title">博文</h1>
      <div className="article-list">
        { data &&
          data.llxlife_article.map(item => (
            <div key={item.id} onClick={() => {props.openSub();history.push('/article/' + item.id)}} className="article-item">
              <p className="article-time">{new Date(item.time).toLocaleString('cn-ZH', { hour12: false })}</p>
              <p className="article-title">{item.title}</p>
              <p className="article-tag">{item.tag}</p>
            </div>
          ))
        }
        <div onClick={() => {loadMore()}} className={`article-item load-more ${finish ? 'load-finish' : ''}`}>
          {finish ? '已达岁月尽头' : '加载更多'}
        </div>
      </div>
    </>
  )
}
export default ArticleList
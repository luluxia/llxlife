import React, { useEffect, useState } from "react"
import { useQuery, gql } from "@apollo/client"
import { useHistory } from "react-router"
function PhotoList(props) {
  const history = useHistory()
  const [finish, setFinish] = useState(0)
  const { data, fetchMore } = useQuery(gql`
    query GetPhotos($offset: Int) {
      llxlife_photo(limit: 6, offset: $offset) {
        id
        time
        title
        tag
        img
      }
      llxlife_photo_aggregate {
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
        offset: data.llxlife_photo.length
      }
    })
  }
  useEffect(() => {
    if (data) {
      if (data.llxlife_photo.length == data.llxlife_photo_aggregate.aggregate.count) {
        setFinish(1)
      }
      props.flushCover()
    }
  }, [data])
  return (
    <>
      <h1 className="box-title">相册</h1>
      <div className="article-list">
        { data &&
          data.llxlife_photo.map(item => (
            <div key={item.id} onClick={() => {props.openSub();history.push('/photo/' + item.id)}} className="article-item photo-item">
              <img src={item.img} alt="" />
              <div className="photo-info">
                <p className="article-time">{new Date(item.time).toLocaleString('cn-ZH', { hour12: false })}</p>
                <p className="article-title">{item.title}</p>
                <p className="article-tag">{item.tag}</p>
              </div>
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
export default PhotoList
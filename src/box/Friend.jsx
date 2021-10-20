import React, { useEffect } from "react"
import { useQuery, gql } from "@apollo/client"
import { useHistory } from "react-router"
function FriendList(props) {
  const history = useHistory()
  const { data } = useQuery(gql`
    query GetFriends {
      llxlife_friend {
        id
        title
        sub
        url
        img
      }
    }
  `)
  useEffect(() => {
    if (data) {
      props.flushCover()
    }
  }, [data])
  return (
    <>
      <h1 className="box-title">友链</h1>
      <div className="article-list">
        { data &&
          data.llxlife_friend.map(item => (
            <a key={item.id} href={item.url} target="_blank" className="article-item friend-item">
              <img src={item.img} alt="" />
              <div className="friend-info">
                <p className="article-title">{item.title}</p>
                <p className="friend-sub">{item.sub}</p>
              </div>
            </a>
          ))
        }
        {/* <div className="article-item load-more">申请友链</div> */}
      </div>
    </>
  )
}
export default FriendList
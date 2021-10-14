import React from "react"
import { useHistory } from "react-router"
function PhotoList(props) {
  const history = useHistory()
  return (
    <>
      <h1 className="box-title">相册</h1>
      <div className="article-list">
        <div onClick={() => {props.openSub();history.push('/photo/1' + 1)}} className="article-item photo-item">
          <img src="../img/test.jpg" alt="" />
          <div className="photo-info">
            <p className="article-time">2021-8-8</p>
            <p className="article-title">关于陆陆侠的生活</p>
            <p className="article-tag">作品诞生记</p>
          </div>
        </div>
        <div className="article-item photo-item">
          <p className="article-time">2021-8-8</p>
          <p className="article-title">关于陆陆侠的生活</p>
          <p className="article-tag">作品诞生记</p>
        </div>
        <div className="article-item photo-item">
          <p className="article-time">2021-8-8</p>
          <p className="article-title">关于陆陆侠的生活</p>
          <p className="article-tag">作品诞生记</p>
        </div>
        <div className="article-item photo-item">
          <p className="article-time">2021-8-8</p>
          <p className="article-title">关于陆陆侠的生活</p>
          <p className="article-tag">作品诞生记</p>
        </div>
      </div>
    </>
  )
}
export default PhotoList
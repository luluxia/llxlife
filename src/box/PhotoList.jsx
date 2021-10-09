import React from "react"
function PhotoList(props) {
  return (
    <>
      <h1 className="box-title">相册</h1>
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
export default PhotoList
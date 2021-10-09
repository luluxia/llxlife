import React from "react"
function Logo(props) {
  return (
    <div className="content">
      <img src="../img/logo.svg" alt=""/>
      <ul className="menu">
        <li onClick={e => props.openCard(e, '/article')}>博文</li>
        <li onClick={e => props.openCard(e, '/photo')}>相册</li>
        <li onClick={e => props.openCard(e, '/work')}>作品</li>
        <li onClick={e => props.openCard(e, '/friend')}>友链</li>
      </ul>
      <p className="copyright">© 2021 Luluxia. All Rights Reserved. <a href="https://icp.gov.moe" target="_blank">萌ICP备 </a><a href="https://icp.gov.moe/?keyword=20201224" target="_blank"> 20201224号</a></p>
    </div>
  )
}
export default Logo
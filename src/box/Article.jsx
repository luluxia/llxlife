import React from "react"
import { useLocation } from "react-router"
function Article(props) {
  const location = useLocation()
  console.log(location)
  return (
    <div>
      <p>文章</p>
      <p>文章</p>
      <p>文章</p>
      <p>文章</p>
      <p>文章</p>
      <p>文章</p>
      <p>文章</p>
      <p>文章</p>
    </div>
  )
}
export default Article
import React, { useEffect } from "react"
import { useQuery, gql } from "@apollo/client"
import { useParams } from "react-router"
function Photo(props) {
  const { id } = useParams()
  const { data } = useQuery(gql`
    query GetPhoto($id: Int) {
      llxlife_photo(where: {id: {_eq: $id}}) {
        img
      }
    }
  `, {
    variables: { id: id }
  })
  useEffect(() => {
    if (data) {
      props.flushCover('sub')
    }
  }, [data])
  return (
    <article className="photo">
      {
        data && <img src={data.llxlife_photo[0].img} alt="" />
      }
    </article>
  )
}
export default Photo
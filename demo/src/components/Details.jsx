import React from 'react'
import {

  useQuery,
} from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
function Details() {
  const { ID } = useParams({ strict: false })

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['characterList'],
    queryFn: async () => {
      const response = await fetch(
        'https://rickandmortyapi.com/api/character/' + ID
      )
      return await response.json()
    },
  })
  return (
    <div>
      {isFetching ? <h4>LOADING...</h4> :
        <ul className='details'>
          <li>
            <img src={data?.image} alt="Profile Photo" width='100%' />
          </li>
          <li>
            <strong>Name:</strong>
            <span>{data?.name}</span>
          </li>
          <li>
            <strong>Gender:</strong>
            <span>{data?.gender}</span>
          </li>
          <li>
            <strong>Species:</strong>
            <span>{data?.species}</span>
          </li>
          <li>
            <strong>Status:</strong>
            <span>{data?.status}</span>
          </li>
        </ul>}
    </div>
  )
}

export default Details

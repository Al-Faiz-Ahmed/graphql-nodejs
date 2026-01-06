
import { useState } from 'react'
import './App.css'
import { useGraphQL } from './hooks/use-graphql'
import { GET_TODOS } from './queries/todo-queries'

function App() {



  return (
    <>
      <div>Cheking Graphql</div>
      
      <FetcherComp title='Fetch Todos' />
      
    </>
  )
}

export default App



const FetcherComp = ({title=""}) => {
    const {data,error,loading,fetchNow} =  useGraphQL(GET_TODOS)

  if (loading) return <p>Wait while loading the data</p>;
  if (error) return <p>Error in fetching data  {error}</p>
  
  return (
<div style={{width:"100%"}}>
        <div style={{display:"flex", justifyContent:"space-between",width:"100%"}}>{title} <button 
        onClick={fetchNow}
        style={{textTransform:"uppercase"}}>{title}</button></div>
        <div>
           {data && data.length !== 0 ? 
            <p>data fetched Succesfully</p>
            :
            <p>No data returned</p>
           }
        </div>
      </div>
  )
}

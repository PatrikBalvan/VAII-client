import React from 'react'

function App() {
  const [backEndData, setBackEndData] = React.useState<any>([{}])

  React.useEffect(() => {
    fetch('/api')
      .then((response) => {
        response.json()
          .then((data) => {
            setBackEndData(data)
          })
          .catch((err) => {
            console.error(err)
          })
      })
      .catch((err) => {
        console.error(err)
      })
  },[])

  return (
    <div>
      {
        (typeof backEndData.users === 'undefined')
        ?
        <p>Loading</p>
        :
        backEndData.users.map((user, index) => {
          return <p key={index}>{user}</p>
        })
      }
    </div>
  )
}

export default App
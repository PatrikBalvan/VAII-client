import { Dispatch, FC, SetStateAction } from "react"
import ArticleList from "../components/ArticleList"
import Login from "./Login"
import { User } from "../App"
import '../styles/Home.css'

interface HomeProps {
    user: User
    setUser: Dispatch<SetStateAction<User>>
}

const Home: FC<HomeProps> = (props) => {
    return (
        <div className=''>
            
        </div>
    )
}

export default Home
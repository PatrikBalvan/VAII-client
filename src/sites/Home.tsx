import { Dispatch, FC, SetStateAction } from "react"
import ArticleList from "../components/ArticleList"
import { User } from "../App"

interface HomeProps {
    user: User
    setUser: Dispatch<SetStateAction<User>>
}

const Home: FC<HomeProps> = (props) => {
    return (
        <div className='container lg:flex'>
            <div className='w-full lg:w-2/5'>
                <ArticleList/> 
            </div>
        </div>
    )
}

export default Home
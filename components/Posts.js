import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../firebase"
import Post from "./Post"

const posts = [{
    id: '123',
    username: 'rohang_1999',
    userImage: 'https://avatars.githubusercontent.com/u/39983195?v=4',
    img: 'https://avatars.githubusercontent.com/u/39983195?v=4',
    caption: 'Hello FAM',
    id: '456',
    username: 'rohang_1999',
    userImage: 'https://avatars.githubusercontent.com/u/39983195?v=4',
    img: 'https://avatars.githubusercontent.com/u/39983195?v=4',
    caption: 'Hello FAM'
}]

function Posts() {
    // to retrive data and store from firebase
    const [posts, setPosts] = useState([])

    useEffect(() => {
        // querying on the collection >>> posts >>> orderby desc >>> storing it in useState
        const unsubscribe = onSnapshot(query(collection(db,'posts'), orderBy('timestamp','desc')), snapshot=>(
            setPosts(snapshot.docs)
        ))
        
        // clean up the instance of onSnapshot
        return unsubscribe;
    }, [db]) //db as dependency


    return (
        <div>
            {/* post.data().username >>> .data() to get data from firestore */}
            {posts.map((post) => (
                <Post key={post.id} id={post.id} username={post.data().username} userImage={post.data().profileImg} img={post.data().image} caption={post.data().caption} />
            ))}

            {/* POST */}
            {/* POST */}
            {/* POST */}

        </div>
    )
}

export default Posts

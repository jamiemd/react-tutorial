import { useHistory, useParams } from "react-router-dom";
import useFetch from "./useFetch";
import supabase from "./config/supabaseClient";

const BlogDetails = () => {
    const { id } = useParams();
    const { data: blog, error, isPending } = useFetch('blogs', id);
    const history = useHistory();

    const handleClick=() => {
        supabase
            .from('blogs')
            .delete()
            .eq('id', blog.id)
            .select()
            .then(({data, error}) => {
                if(error) {
                    console.log(error);
                }
                if(data) {
                    console.log('blog deleted');
                    history.push('/');
                }
        })
    }

    return ( 
        <div className="blog-details">
            { isPending && <div>Loading...</div> }
            { error && <div>{ error }</div> }
            { blog && (
                <article>
                    <h2>{ blog.title }</h2>
                    <p>Written by { blog.author }</p>
                    <div>{ blog.body }</div>
                    <button onClick={handleClick}>delete</button>
                </article>
            )}
        </div>
     );
}
 
export default BlogDetails;
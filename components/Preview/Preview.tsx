import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";


function Preview({ markdown }) {
    return (
        <Markdown className={"markdown_div"} rehypePlugins={[rehypeRaw]}>{markdown}</Markdown>
    )
}
export default Preview;
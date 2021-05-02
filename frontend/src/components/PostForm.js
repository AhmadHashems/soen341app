import React, {useState} from 'react'
import ReactDOM from "react-dom";
import {getCookie} from '../GlobalFunctions'
import {useHistory} from 'react-router-dom'


function PostForm() {
    const [image, setImage] = useState("");
    const [isUploaded, setIsUploaded] = useState(false);
    const [caption, setCaption] = useState("");

    function handleImageChange(e) {
        if (e.target.files && e.target.files[0]) {
            let reader = new FileReader();

            reader.onload = function (e) {
                setImage(e.target.result);
                setIsUploaded(true);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    function handleCaptionChange(e) {
        setCaption(e.target.value);
    }

    // Because this is a functional component, the props are not initially available as in other components (ex: LoginForm),
    // so we set the history using 'react-router-dom's useHistory() and then push using that object in the .then() promise
    let history = useHistory();

    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', image);
        formData.append('caption', caption);

        const csrftoken = getCookie('csrftoken')

        fetch(
            '/api/post/', {
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(formData)),
                headers: {
                    'content-type': 'application/json',
                    'X-CSRFToken': csrftoken,
                }
            }
        )
            .then(response => response.json())
            .then(data => {
                if (data.success === 'true') {
                    return history.push('/feed');
                }
                const ErrorsList = () => (
                    <ul>{data.errors.map(error => <li key={error}> {error} </li>)}</ul>
                );
                const rootElement = document.getElementById("post-response-errors");
                ReactDOM.render(<ErrorsList />, rootElement);
            })
            .catch(error => console.log(error))
    }

    return (
        <form onSubmit={handleSubmit} className={'post-form-main'}>
            <h3>Make a Post</h3>
            <div className={'box-upload'}>
                {!isUploaded ?
                    (<>
                        <label className={'img-label'} htmlFor="upload-input">
                            <img style={{width: 100}} draggable={false}
                                 src='https://wayou.gallerycdn.vsassets.io/extensions/wayou/vscode-icons-mac/7.25.3/1564717968649/Microsoft.VisualStudio.Services.Icons.Default'
                                 alt="Folder Icon"/>
                            <p id={'sub'}>
                                Click to upload image
                            </p>
                        </label>
                        <input
                            className={'img-input'}
                            id="upload-input"
                            type="file"
                            accept=".jpg, .img, .png"
                            onChange={handleImageChange}
                        />
                    </>) : (
                        <div className={'image-preview'}>
                            <img className='close-icon'
                                 src='https://cdn.iconscout.com/icon/free/png-256/close-1781207-1518581.png'
                                 alt="Close Icon"
                                 onClick={() => {
                                     setIsUploaded(false);
                                     setImage(null);
                                 }}
                            />
                            <img id="uploaded-image"
                                 src={image}
                                 alt="Feed Post"
                                 draggable={false}
                            />
                        </div>
                    )
                }
            </div>
            <div className={'text-area'}>
                <textarea value={caption} onChange={handleCaptionChange} type="text" name="caption"
                          className={'description-input'} placeholder='Description'/>
            </div>
            <input className={'post-btn'} type="submit" value="Post"/>
            <div id={"post-response-errors"}/>
        </form>
    )
}

export default PostForm
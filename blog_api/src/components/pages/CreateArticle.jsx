import React, { useState } from 'react'
import { useCookies } from 'react-cookie';

export const CreateArticle = () => {
  const [cookies] = useCookies();
  const email = cookies.Email;
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [image, setImage] = useState();
  const date = new Date().toISOString(Date.now());
  const url = "https://mugblock-backend.onrender.com";
  
  const postArticle = async(e) =>{
    e.preventDefault();
    try {
      if(!title && !content){
        console.log('Empty fields, please write an entry')
      }else{
        const postArticleResponse = await fetch(`${url}/api/v1/articles`,{
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({email,title,content,date})
      })
         await postArticleResponse.json();
         
         if(postArticleResponse.status === 200){
         uploadImage();
          window.location.href=`/`;
         }
         
      }
      
    } catch (error) {
      console.error(error);
    }
  }

  const uploadImage = async()=>{
/////////////////////////////////////////////
    try {
      const selectArticles =  await fetch(`${url}/api/v1/articles`)
      const selectArticlesJson = await selectArticles.json();
      const lastestArticle =  selectArticlesJson[selectArticlesJson.length -1];
      const id = lastestArticle.article_id;
      
      
      const formData = new FormData();
      formData.append('file0',image);
      try {
        const response = await fetch(`${url}/api/v1/upload/${id}`,{
        method: 'POST',
        body: formData
      })
      

      } catch (error) {
        console.error(error)
      }
      // Manejar la respuesta si es necesario
      //const responseData = await response.json();
      
    } catch (error) {
      console.log(error)
    }

    //////////////////////////////////////
    
  }


  return (
    <div className='create-container'>
      <div className='create-container-box'>
          <form className='article-form' method='POST'>
            <input name='title' className='article-input' type="text" placeholder='Enter your title' 
            onChange={(e)=>setTitle(e.target.value)}/>
            <textarea name='content' onChange={(e)=>setContent(e.target.value)} className='article-input article-textarea' rows="10" cols="50" minLength="100" placeholder='Enter article content'/>
            <label htmlFor="file">Upload Image</label>
            <input className='image-upload' type="file" onChange={(e)=>setImage(e.target.files[0])} name='file0' id='file' />
            <input onClick={postArticle} className='article-input article-post' type="submit" value="Post" />
          </form>
      </div>
    </div>
  )
}

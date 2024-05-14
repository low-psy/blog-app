import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { toast } from 'react-toastify';
import { PostProps } from './PostList';
import Loader from './Loader';
import Comments from './Comments';

export default function PostDetail() {
  const [post, setPost] = useState<PostProps | null>(null);
  const params = useParams();
  const navigate = useNavigate();

  const getPost = async (id: string) => {
    if (id) {
      const docRef = doc(db, 'posts', id);
      const docSnap = await getDoc(docRef);
      setPost({ ...(docSnap.data() as PostProps), id: docSnap.id });
    }
  };
  const handleDelete = async () => {
    const confirm = window.confirm('정말 게시글을 삭제하시겠습니까?');
    if (confirm && post && post.id) {
      await deleteDoc(doc(db, 'posts', post.id));
      toast.success('게시글을 삭제했습니다');
      navigate('/');
    }
  };

  useEffect(() => {
    if (params?.id) getPost(params.id);
  }, [params.id]);
  return (
    <div className="post__detail">
      {post ? (
        <>
          <div className="post__box">
            <div className="post__title ">{post.title}</div>
            <div className="post__profile-box">
              <div className="post__profile" />
              <div className="post__author-name">{post.email}</div>
              <div className="post__date">{post.createdAt}</div>
            </div>
            <div className="post__utils-box">
              {post.category && (
                <div className="post__category">{post.category}</div>
              )}
              <div
                className="post__delete"
                onClick={handleDelete}
                role="presentation"
              >
                삭제
              </div>
              <div className="post__edit">
                <Link to={`/posts/edit/${post.id}`}>수정</Link>
              </div>
            </div>
            <div className="post__text post__text--pre-wrap">
              {post.content}
            </div>
          </div>
          <Comments post={post} getPost={getPost} />
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}

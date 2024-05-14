import React, { useContext, useEffect, useState } from 'react';
import AuthContext from 'context/AuthContext';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CATEGORIES, CategoryType, PostProps } from './PostList';

export default function PostForm() {
  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null);

  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [category, setCategory] = useState<CategoryType | string>('');

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (post && post.id) {
        const postRef = doc(db, 'posts', post.id);
        await updateDoc(postRef, {
          title,
          summary,
          content,
          updatedAt: new Date()?.toLocaleDateString('ko', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          category,
        });
        toast.success('게시물을 수정했습니다');
        navigate(`/posts/${post.id}`);
      } else {
        await addDoc(collection(db, 'posts'), {
          title,
          summary,
          content,
          createdAt: new Date()?.toLocaleDateString('ko', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          email: user?.email,
          uid: user?.uid,
          category,
        });
        toast.success('게시물을 생성했습니다');
        navigate('/');
      }
    } catch (e) {
      toast.error('게시물을 생성하는데 실패했습니다');
      console.log(e);
    }
  };

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const {
      target: { name, value },
    } = e;

    if (name === 'title') {
      setTitle(value);
    }
    if (name === 'summary') {
      setSummary(value);
    }
    if (name === 'content') {
      setContent(value);
    }
    if (name === 'category') {
      setCategory(value);
    }
  };

  const getPost = async (id: string) => {
    if (id) {
      const docRef = doc(db, 'posts', id);
      const docSnap = await getDoc(docRef);
      setPost({ ...(docSnap.data() as PostProps), id: docSnap.id });
    }
  };

  useEffect(() => {
    if (params?.id) getPost(params.id);
  }, [params.id]);

  useEffect(() => {
    if (post) {
      setTitle(post?.title);
      setSummary(post?.summary);
      setContent(post?.content);
      setCategory(post?.category as CategoryType);
    }
  }, [post]);

  return (
    <form action="/post" method="POST" className="form" onSubmit={onSubmit}>
      <div className="form__block">
        <label htmlFor="title">제목</label>
        <input
          type="text"
          name="title"
          id="title"
          required
          onChange={onChange}
          value={title}
        />
      </div>
      <div className="form__block">
        <label htmlFor="category">카테고리</label>
        <select name="category" id="category" onChange={onChange}>
          <option value="">카테고리를 선택해주세요</option>
          {CATEGORIES?.map((category) => {
            return (
              <option value={category} key={category}>
                {category}
              </option>
            );
          })}
        </select>
      </div>
      <div className="form__block">
        <label htmlFor="summary">요약</label>
        <input
          type="text"
          name="summary"
          id="summary"
          required
          onChange={onChange}
          value={summary}
        />
      </div>
      <div className="form__block">
        <label htmlFor="title">내용</label>
        <textarea
          name="content"
          id="content"
          required
          onChange={onChange}
          value={content}
        />
      </div>
      <div className="form__block">
        <input
          type="submit"
          value={post ? '수정' : '제출'}
          className="form__btn--submit"
        />
      </div>
    </form>
  );
}

import React, { useContext, useEffect, useState } from 'react';
import AuthContext from 'context/AuthContext';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from 'firebaseApp';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

type TabType = 'all' | 'my';

export type CategoryType = 'Frontend' | 'Backend' | 'Web' | 'Native';
export const CATEGORIES: CategoryType[] = [
  'Frontend',
  'Backend',
  'Native',
  'Web',
];

interface PostListProps {
  hasNavigation?: boolean;
  defaultTab?: TabType | CategoryType;
}

export interface CommentInterface {
  content: string;
  uid: string;
  email: string;
  createdAt: string;
}

export interface PostProps {
  id: string;
  title: string;
  email: string;
  summary: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  uid: string;
  category?: CategoryType;
  comments?: CommentInterface[];
}

export default function PostList({
  hasNavigation = true,
  defaultTab = 'all',
}: PostListProps) {
  const [activeTab, setActiveTab] = useState<TabType | CategoryType>(
    defaultTab,
  );
  const [posts, setPosts] = useState<PostProps[]>([]);
  const { user } = useContext(AuthContext);

  const getPosts = async () => {
    const postsRef = collection(db, 'posts');
    let postsQuery;

    if (activeTab === 'my' && user) {
      postsQuery = query(
        postsRef,
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc'),
      );
    } else if (activeTab === 'all') {
      postsQuery = query(postsRef, orderBy('createdAt', 'desc'));
    } else {
      postsQuery = query(
        postsRef,
        where('category', '==', activeTab),
        orderBy('createdAt', 'desc'),
      );
    }
    const datas = await getDocs(postsQuery);
    setPosts([]);
    datas.forEach((doc) => {
      const dataObj = { ...doc.data(), id: doc.id };
      setPosts((prev) => [...prev, dataObj] as PostProps[]);
    });
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('정말 게시글을 삭제하시겠습니까?');
    if (confirm && id) {
      await deleteDoc(doc(db, 'posts', id));
      toast.success('게시글을 삭제했습니다');
      getPosts();
    }
  };

  useEffect(() => {
    getPosts();
  }, [activeTab]);

  return (
    <>
      {hasNavigation && (
        <div className="post__navigation ">
          <div
            role="presentation"
            onClick={() => setActiveTab('all')}
            className={activeTab === 'all' ? 'post__navigation--active' : ''}
          >
            전체
          </div>
          <div
            role="presentation"
            onClick={() => setActiveTab('my')}
            className={activeTab === 'my' ? 'post__navigation--active' : ''}
          >
            나의 글
          </div>
          {CATEGORIES.map((category) => {
            return (
              <div
                key={category}
                role="presentation"
                onClick={() => setActiveTab(category)}
                className={
                  activeTab === category ? 'post__navigation--active' : ''
                }
              >
                {category}
              </div>
            );
          })}
        </div>
      )}
      <div className="post__list">
        {posts && posts?.length > 0 ? (
          posts?.map((post) => (
            <div key={post.id} className="post__box">
              <Link to={`/posts/${post.id}`}>
                <div>
                  <div className="post__profile-box">
                    <div className="post__profile" />
                    <div className="post__author-name">{post.email}</div>
                    <div className="post__date">{post.createdAt}</div>
                  </div>
                  <div className="post__title">{post.title}</div>
                  <div className="post__text">{post.summary}</div>
                </div>
              </Link>
              {post.email === user?.email && (
                <div className="post__utils-box">
                  <div
                    className="post__delete"
                    onClick={() => handleDelete(post.id)}
                    role="presentation"
                  >
                    삭제
                  </div>
                  <div className="post__edit">
                    <Link to={`/posts/edit/${post.id}`}>수정</Link>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="post__no-post">게시물이 없습니다</div>
        )}
      </div>
    </>
  );
}

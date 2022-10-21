import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Message from "../components/Message";
import { db } from "../utils/Firebase";

export default function Home() {
  const [allPosts, setAllPosts] = useState([]);

  const getPosts = async () => {
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      <Head>
        <title>Harman's Twitter</title>
        <meta name="description" content="A twitter for Harman" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="my-12 text-lg font-medium">
        <h2>See what other people are saying</h2>
        {allPosts.map((post) => (
          <Message {...post} key={post.id}>
            <Link href={{ pathname: `/${post.id}`, query: { ...post } }}>
              <button className="text-sm text-gray-500">
                {" "}
                {post?.comments?.length > 0 ? post?.comments?.length : 0}{" "}
                comments
              </button>
            </Link>
          </Message>
        ))}
      </div>
    </div>
  );
}

import Message from "../components/message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { toast } from "react-toastify";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

function Details() {
  const route = useRouter();
  const routeData = route.query;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  const submitMessage = async () => {
    if (!auth.currentUser) return route.push("/auth/login");
    if (!message) {
      toast.error("Don't leave an empty message!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message: message,
        avatar: auth.currentUser.photoURL,
        username: auth.currentUser.displayName,
        timestamp: Timestamp.now(),
      }),
    });
    toast.success("Message added 🎉", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1500,
    });
    setMessage("");
  };

  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllMessages(snapshot.data().comments);
    });
    return unsubscribe;
  };

  useEffect(() => {
    if (!route.isReady) return;
    getComments();
  }, [route.isReady]);

  return (
    <div>
      <Message {...routeData}></Message>
      <div className="my-4">
        <div className="flex gap-2">
          <input
            className="bg-gray-600 w-full p-2 text-white text-sm rounded-lg"
            type="text"
            value={message}
            placeholder="Send a message ☺️"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="bg-cyan-600 text-white py-2 px-4 rounded-lg text-sm"
            onClick={submitMessage}
          >
            Submit
          </button>
        </div>
        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {allMessages?.map((message) => (
            <div
              className="bg-white p-4 my-4 border-2 rounded-lg"
              key={message.timestamp}
            >
              <div className="flex items-center gap-2 mb-4">
                <img
                  src={message.avatar}
                  alt=""
                  className="w-10 rounded-full"
                />
                <h2>{message.username}</h2>
              </div>
              <h2>{message.message}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Details;

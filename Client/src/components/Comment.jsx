/* eslint-disable */
import { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";
import { Navigate, useNavigate } from "react-router-dom";

function Comment({ comment, onLike, onEdit, onDelete }) {
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({});
  const [editedContent, setEditedContent] = useState(comment.content);
  const navigate=useNavigate()
  console.log(user);

  useEffect(() => {
    const getUser = async () => {
      console.log(comment);
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
      });

      if (res.ok) {
        setIsEditing(false);
        onEdit(comment._id, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDelete = async () => {
    if(!currentUser){
      navigate('/sign-in')
    }
    try {
      const res = await fetch(`/api/comment/deleteComment/${comment._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        onDelete(comment._id);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex border-b dark:border-gray-600 text-sm p-4">
      <div className="">
        <img
          className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 mr-3"
          src={user.user?.profilePicture}
          alt=""
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.user?.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment?.createdAt).fromNow()}
          </span>
        </div>

        {isEditing ? (
          <>
            <Textarea
              placeholder="Add a Comment...."
              maxLength="200"
              onChange={(e) => setEditedContent(e.target.value)}
              value={editedContent}
              className="mb-2"
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 mb-2">{comment?.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser && comment?.likes.includes(currentUser.user._id)
                    ? "!text-blue-500"
                    : ""
                }`}
                onClick={() => {
                  onLike(comment._id);
                }}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {comment.numberOflikes > 0 &&
                  comment.numberOflikes +
                    " " +
                    (comment.numberOflikes === 1 ? "like" : "likes")}
              </p>

              {currentUser &&
                (currentUser.user._id === comment.userId ||
                  currentUser.user.isAdmin) && (
                  <>
                    <button
                      type="button"
                      className="text-gray-400  hover:text-blue-500"
                      onClick={handleEdit}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-gray-400  hover:text-blue-500"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Comment;

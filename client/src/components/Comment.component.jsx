import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import TextFieldComponent from '../components/Textfield.component';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { likeComment } from '../api/Comment/likeComment.api';
import { unlikeComment } from '../api/Comment/unlikeComment.api';
import { deleteComment } from '../api/Comment/deleteComment.api';
import { postComment } from '../api/Comment/postComment.api';
import likeIcon from '../assets/like-icon.png';
import unlikeIcon from '../assets/unlike-icon.png';
import dropDown from '../assets/downArrow.png';
import CustomButton from './CustomButton.component';

dayjs.extend(relativeTime);

const CommentSection = ({ comment, userId, campaignId, refreshComments }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [likes, setLikes] = useState(comment.likes.length);
  const [liked, setLiked] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);

  const form = useForm({
    defaultValues: {
      reply: ''
    }
  });

  useEffect(() => {
    const isLiked = comment.likes.includes(userId);
    setLiked(isLiked);
  }, [comment.likes, userId]);

  const handleLike = async () => {
    try {
      if (liked) {
        await unlikeComment(comment._id, userId);
        setLikes(likes - 1);
        setLiked(false);
      } else {
        await likeComment(comment._id, userId);
        setLikes(likes + 1);
        setLiked(true);
      }
    } catch (error) {
      alert('Error liking/unliking the comment:', error);
    }
  };

  const handleDelete = async () => {
    try {
      confirm('Are you sure you want to delete this comment?');
      await deleteComment(comment._id);
      refreshComments();
    } catch (error) {
      alert('Error deleting the comment:', error);
    }
  };

  const handleShowReplies = () => {
    if (comment.replies.length > 0) {
      setShowReplies(!showReplies);
    }
  };

  const toggleReplyInput = () => {
    setShowReplyInput(!showReplyInput);
  };

  const onSubmitReply = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    try {
      await postComment(campaignId, userId, form.watch('reply'), comment._id);
      refreshComments();
      form.reset({ reply: '' });
      setShowReplyInput(false);
    } catch (error) {
      alert('Error posting the reply:', error);
    }
  };

  return (
    <div className="m-2 p-4 border border-gray-300 rounded-md shadow-sm bg-white">
      <div className="flex justify-between mb-2 items-center">
        <div className="flex items-center">
          <img src={comment.profilePicture} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
          <strong className="text-sm text-gray-700">{comment.username}</strong>
        </div>
        <span className="text-xs text-gray-500">{dayjs(comment.createdAt).fromNow()}</span>
      </div>
      <p className="text-gray-800 mb-4 ml-10 text-left text-sm">{comment.content}</p>
      <div className="flex space-x mb-2 ml-10">
        <button
          onClick={handleLike}
          className={`px-2 py-1 flex flex-row gap-2 items-center text-xs hover:text-blue-500
          }`}>
           <img
            src={liked ? unlikeIcon : likeIcon} 
            alt={liked ? 'Unlike' : 'Like'}
            className="w-4 h-4"
          />
          {/* {liked ? 'Unlike' : 'Like'} */} {likes}
        </button>
        <button
          onClick={toggleReplyInput}
          className="px-2 py-1 hover:text-blue-600">
          Reply
        </button>
        {comment.user === userId && (
          <button
            onClick={handleDelete}
             className="px-2 py-1 hover:text-red-600">
            Delete
          </button>
        )}
      </div>
      <div className='flex justify-start ml-10'>
        <button
          onClick={handleShowReplies}
          className="px-2 py-1 text-sm">
          <div className='flex flex-row'>
            <img src={dropDown} className='w-4 h-4"'/>
            {comment.replies.length} Replies 
          </div>
        </button>
      </div>

      {showReplyInput && (
        <form onSubmit={onSubmitReply} className="mt-2">
          <TextFieldComponent
            name="reply"
            label=""
            placeholder="Add reply"
            control={form.control}
            type="textarea"
            rows={3}
            required={true}
            errorMessage={form.formState.errors.content?.message}
          />
          <CustomButton
            btnType="submit"
            className="mt-5 px-8"
            title="Post Reply"
            bgColor="#2C7A5A"
            textColor="#ffffff"
          />
        </form>
      )}

      {showReplies && comment.replies.length > 0 && (
        <div className="ml-4 mt-2 border-l border-gray-200 pl-2">
          {comment.replies.map((reply) => (
            <CommentSection
              key={reply._id}
              comment={reply}
              userId={userId}
              campaignId={reply.campaignId}
              refreshComments={refreshComments}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;

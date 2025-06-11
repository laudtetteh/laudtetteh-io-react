import React from 'react';

import ImageUploader from '../shared/ImageUploader';

interface PostImageUploaderProps {
  imageUrl: string;
  onChange: (url: string) => void;
}

const PostImageUploader: React.FC<PostImageUploaderProps> = ({ imageUrl, onChange }) => (
  <ImageUploader imageUrl={imageUrl} onChange={onChange} />
);

export default PostImageUploader;

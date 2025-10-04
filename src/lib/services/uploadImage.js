// lib/uploadImage.js
import axios from "axios"

export async function uploadImage(dataUrl) {
  try {
    const res = await axios.post('/api/images', { image: dataUrl });

    // Axios doesn't have `res.ok` — check status code instead
    if (res.status !== 200) {
      console.error('Upload failed with status:', res.status);
      throw new Error('Image upload failed');
    }

    const imageURL = res.data?.imageURL;
    if (!imageURL) {
      console.error('No imageURL returned in response:', res.data);
      throw new Error('Image URL missing from response');
    }

    console.log('Image uploaded successfully:', imageURL);
    return imageURL;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
}

export async function uploadImage2(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "vaahan_suraksha");
  formData.append("folder", "vaahan-suraksha");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/dvractwu7/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.secure_url;
}
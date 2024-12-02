"use client";
import { useState } from 'react';
import "@rainbow-me/rainbowkit/styles.css";
import { useStorageUpload } from '@thirdweb-dev/react';
interface FormData {
  eventName: string;
  date: string;
  location: string;
  price: string;
}

function Page() {
  const [isUploading, setIsUploading] = useState(false);
  const { mutateAsync: upload } = useStorageUpload();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    eventName: '',
    date: '',
    location: '',
    price: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showError, setShowError] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 當用戶開始輸入時清除該欄位的錯誤
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.eventName.trim()) {
      newErrors.eventName = 'Please enter the event name';
    }
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Please enter the location';
    }
    if (!formData.price) {
      newErrors.price = 'Please enter the price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    const isValid = validateForm();
    
    if (!isValid) {
      setShowError(true);
      // 3秒後自動隱藏錯誤提示
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    // TODO: 處理表單提交邏輯
    console.log('Form submitted:', formData);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function uploadImage() {
    if (selectedFile) {
      // 上傳到 IPFS
      try {
        setIsUploading(true);
        const cid = await upload({data: [selectedFile]});
        console.log('Uploaded to IPFS with CID:', cid);
        setFormData(prev => ({
          ...prev,
          imageIpfsCid: cid
        }));
      } catch (error) {
        console.error('Error uploading to IPFS:', error);
      } finally {
        setIsUploading(false);
      }
    }
  }

  return (
    <div className="min-h-screen pt-12 px-4 sm:px-6 lg:px-8">
      {/* {showError && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md">
          <p>請填寫所有必填欄位</p>
        </div>
      )} */}
      
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-center text-gray-800">
            Create Event
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Fill in the details for your new event
          </p>
        </div>

        <div className="space-y-6">
          <div className="form-control w-full">
            <label className="block">
              <span className="text-gray-700 font-medium mb-2 block">Event Name</span>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                placeholder="Yoasobi 2024 Concert"
                className={`text-black input input-bordered w-full bg-white hover:border-blue-500 focus:border-blue-500 transition-colors ${
                  errors.eventName ? 'border-red-500' : ''
                }`}
              />
              {errors.eventName && (
                <p className="text-red-500 text-sm mt-1">{errors.eventName}</p>
              )}
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="block">
                <span className="text-gray-700 font-medium mb-2 block">Date</span>
                <input
                  type="date"
                  name="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.date}
                  onChange={handleInputChange}
                  lang="en"
                  className={`text-black input input-bordered w-full bg-white hover:border-blue-500 focus:border-blue-500 transition-colors [color-scheme:light] ${
                    errors.date ? 'border-red-500' : ''
                  }`}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                )}
              </label>
            </div>

            <div className="form-control">
              <label className="block">
                <span className="text-gray-700 font-medium mb-2 block">Price (USD)</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="10000"
                  className={`text-black input input-bordered w-full bg-white hover:border-blue-500 focus:border-blue-500 transition-colors ${
                    errors.price ? 'border-red-500' : ''
                  }`}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </label>
            </div>
          </div>

          <div className="form-control w-full">
            <label className="block">
              <span className="text-gray-700 font-medium mb-2 block">Location</span>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Tokyo Dome"
                className={`text-black input input-bordered w-full bg-white hover:border-blue-500 focus:border-blue-500 transition-colors ${
                  errors.location ? 'border-red-500' : ''
                }`}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </label>
          </div>

          <div className="form-control w-full">
            <label className="block">
              <span className="text-gray-700 font-medium mb-2 block">Event Image</span>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors">
                {imagePreview ? (
                  <div className="relative w-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <button
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
              </div>
            </label>
          </div>

          <div className="mt-8 flex justify-end">
            <button 
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 active:scale-95 transition-all duration-200 ease-in-out"
            >
              Create Event
            </button>
            <button className='btn btn-primary' onClick={uploadImage}>
              uploadImage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
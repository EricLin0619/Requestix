"use client";
import { useState } from 'react';
import "@rainbow-me/rainbowkit/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import CreateEventButton from '@/components/button/createEventButton';

interface FormData {
  eventName: string;
  location: string;
  price: string;
  maxTickets: string;
  ticketSaleStart: string | number;
  eventStartTime: string | number;
  eventEndTime: string | number;
  ticketSaleEnd: string | number;
}

function Page() {
  // submmit loading
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    eventName: '',
    location: '',
    price: '',
    maxTickets: '',
    ticketSaleStart: 0,
    eventStartTime: 0,
    eventEndTime: 0,
    ticketSaleEnd: 0
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showError, setShowError] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (['ticketSaleStart', 'ticketSaleEnd', 'eventStartTime', 'eventEndTime'].includes(name)) {
      const timestamp = new Date(value).getTime() / 1000;
      setFormData(prev => ({
        ...prev,
        [name]: timestamp
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

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
    if (!formData.location.trim()) {
      newErrors.location = 'Please enter the location';
    }
    if (!formData.price) {
      newErrors.price = 'Please enter the price';
    }
    if (!formData.ticketSaleStart) {
      newErrors.ticketSaleStart = 'Please select the ticket sale start time';
    }
    if (!formData.eventStartTime) {
      newErrors.eventStartTime = 'Please select the event start time';
    }
    if (!formData.eventEndTime) {
      newErrors.eventEndTime = 'Please select the event end time';
    }
    if (!formData.ticketSaleEnd) {
      newErrors.ticketSaleEnd = 'Please select the ticket sale end time';
    }
    if (!formData.maxTickets) {
      newErrors.maxTickets = 'Please enter the number of tickets for sale';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const inputCheck = () => {
    const isValid = validateForm();
    
    if (!isValid) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return false;
    }

    console.log('Form submitted:', formData);
    return true;
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

  const timestampToDateTimeString = (timestamp: number) => {
    if (!timestamp) return '';
    return new Date(timestamp * 1000).toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen pt-12 px-4 sm:px-6 lg:px-8 mb-6">
      {isLoading && (
        <div className="fixed inset-0 bg-gray-800/75 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3 p-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-white font-medium">Creating event...</p>
          </div>
        </div>
      )}
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
                <span className="text-gray-700 font-medium mb-2 block">Price (FAU)</span>
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
            <div className="form-control">
              <label className="block">
                <span className="text-gray-700 font-medium mb-2 block">Tickets for sale</span>
                <input
                  type="number"
                  name="maxTickets"
                  value={formData.maxTickets}
                  onChange={handleInputChange}
                  placeholder="1000"
                  className={`text-black input input-bordered w-full bg-white hover:border-blue-500 focus:border-blue-500 transition-colors ${
                    errors.maxTickets ? 'border-red-500' : ''
                  }`}
                />
                {errors.maxTickets && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxTickets}</p>
                )}
              </label>
            </div>
          </div>
          <div className="form-control">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="block">
                <span className="text-gray-700 font-medium mb-2 block">Ticket Sale Start</span>
                <input
                  type="datetime-local"
                  name="ticketSaleStart"
                  value={timestampToDateTimeString(formData.ticketSaleStart as number)}
                  onChange={handleInputChange}
                  min={new Date().toISOString().slice(0, 16)}
                  className={`text-black input input-bordered w-full bg-white hover:border-blue-500 focus:border-blue-500 transition-colors [color-scheme:light] ${
                    errors.ticketSaleStart ? 'border-red-500' : ''
                  }`}
                />
                {errors.ticketSaleStart && (
                  <p className="text-red-500 text-sm mt-1">{errors.ticketSaleStart}</p>
                )}
              </label>
            </div>

            <div className="form-control">
              <label className="block">
                <span className="text-gray-700 font-medium mb-2 block">Ticket Sale End</span>
                <input
                  type="datetime-local"
                  name="ticketSaleEnd"
                  value={timestampToDateTimeString(formData.ticketSaleEnd as number)}
                  onChange={handleInputChange}
                  min={timestampToDateTimeString(formData.ticketSaleStart as number)}
                  className={`text-black input input-bordered w-full bg-white hover:border-blue-500 focus:border-blue-500 transition-colors [color-scheme:light] ${
                    errors.ticketSaleEnd ? 'border-red-500' : ''
                  }`}
                />
                {errors.ticketSaleEnd && (
                  <p className="text-red-500 text-sm mt-1">{errors.ticketSaleEnd}</p>
                )}
              </label>
            </div>
          </div>
          

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="block">
                <span className="text-gray-700 font-medium mb-2 block">Event Start Time</span>
                <input
                  type="datetime-local"
                  name="eventStartTime"
                  value={timestampToDateTimeString(formData.eventStartTime as number)}
                  onChange={handleInputChange}
                  min={new Date().toISOString().slice(0, 16)}
                  className={`text-black input input-bordered w-full bg-white hover:border-blue-500 focus:border-blue-500 transition-colors [color-scheme:light] ${
                    errors.eventStartTime ? 'border-red-500' : ''
                  }`}
                />
                {errors.eventStartTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.eventStartTime}</p>
                )}
              </label>
            </div>

            <div className="form-control">
              <label className="block">
                <span className="text-gray-700 font-medium mb-2 block">Event End Time</span>
                <input
                  type="datetime-local"
                  name="eventEndTime"
                  value={timestampToDateTimeString(formData.eventEndTime as number)}
                  onChange={handleInputChange}
                  lang='en'
                  min={timestampToDateTimeString(formData.eventStartTime as number)}
                  className={`text-black input input-bordered w-full bg-white hover:border-blue-500 focus:border-blue-500 transition-colors [color-scheme:light] ${
                    errors.eventEndTime ? 'border-red-500' : ''
                  }`}
                />
                {errors.eventEndTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.eventEndTime}</p>
                )}
              </label>
            </div>
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
            <CreateEventButton
              inputCheck={inputCheck}
              setLoading={setIsLoading}
              eventName={formData.eventName}
              location={formData.location}
              price={formData.price}
              maxRegistrations={Number(formData.maxTickets)}
              startDate={formData.eventStartTime as number}
              endDate={formData.eventEndTime as number}
              saleStartDate={formData.ticketSaleStart as number}
              saleEndDate={formData.ticketSaleEnd as number}
              image={selectedFile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
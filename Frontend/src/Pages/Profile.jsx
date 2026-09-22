import React, { useState } from 'react';
import { Camera, Mail, User } from 'lucide-react';
// Feel free to uncomment this line if your asset exists locally:
// import Profile_pic from '../assets/Profile_pic.png';

function Profile() {
  // Frontend Mock States to replace the backend store
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Mocked user profile data for immediate visual render
  const [user, setUser] = useState({
    fullname: "Alex Mercer",
    email: "alex.mercer@looptalk.com",
    profile_pic: null, // Set to a URL string if you have a default image link
    createdAt: "2024-03-15T08:30:00.000Z"
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    // Generate a temporary local URL for visual feedback inside the browser
    const previewURL = URL.createObjectURL(file);
    setSelectedImage(previewURL);

    // Simulate an uploading visual delay loop
    setIsUploadingProfile(true);
    setTimeout(() => {
      setIsUploadingProfile(false);
      console.log("Mock upload successful!");
    }, 1500);
  };

  return (
    <div className='min-h-screen pt-20 bg-slate-50 text-slate-800'>
      <div className='max-w-3xl mx-auto p-4 py-8'>
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8 space-y-8">
          
          <div className='text-center'>
            <h1 className='text-2xl font-semibold text-slate-900'>Profile</h1>
            <p className='mt-2 text-slate-500'>Your profile information</p>
          </div>

          {/* Profile pic section */}
          <div className='items-center gap-4 flex flex-col'>
            <div className='relative'>
              <img
                src={selectedImage || user.profile_pic || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                alt='profilepic'
                className='rounded-full border-4 border-slate-100 object-cover w-40 h-40 shadow-inner'
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-slate-900 hover:bg-slate-800 hover:scale-110
                  p-2.5 rounded-full cursor-pointer 
                  shadow-md transition-all duration-200
                  ${isUploadingProfile ? "animate-pulse pointer-events-none opacity-50" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploadingProfile}
                />
              </label>
            </div>
            <p className='text-sm text-slate-500 font-medium'>
              {isUploadingProfile ? "Uploading your profile..." : "Click on camera to update your profile."}
            </p>
          </div>

          {/* Info Section */}
          <div className='space-y-6'>
            <div className='space-y-1.5'>
              <div className='flex items-center gap-2 text-sm font-semibold text-slate-600'>
                <User className='w-4 h-4 text-slate-400' />
                Full Name
              </div>
              <p className='border border-slate-200 rounded-xl py-2.5 px-5 bg-slate-50 text-slate-700 font-medium'>
                {user.fullname}
              </p>
            </div>

            <div className='space-y-1.5'>
              <div className='flex items-center gap-2 text-sm font-semibold text-slate-600'>
                <Mail className='w-4 h-4 text-slate-400' />
                Email Address
              </div>
              <p className='border border-slate-200 rounded-xl py-2.5 px-5 bg-slate-50 text-slate-700 font-medium'>
                {user.email}
              </p>
            </div>
          </div>

          {/* Meta Account Details */}
          <div className='mt-6 bg-slate-50 border border-slate-100 rounded-xl p-6'>
            <h2 className='text-base font-semibold text-slate-900 mb-4'>Account Information</h2>
            <div className='space-y-3 text-sm font-medium text-slate-600'>
              <div className='flex items-center justify-between py-2 border-b border-slate-200'>
                <span>Member Since</span>
                <span className='text-slate-900'>
                  {new Date(user.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric", 
                    month: "short", 
                    year: "numeric"
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  Active
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;
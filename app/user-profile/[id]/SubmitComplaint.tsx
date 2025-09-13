import { useState, useRef } from "react";
import { Upload, FileText, X, ChevronDown } from "lucide-react";
import assets from "app/assets/assets";
import { useLanguage } from "../../context/LanguageContext";

const SubmitComplaint = () => {
  const { t } = useLanguage();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    comments: ''
  });
  const [dragActive, setDragActive] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fileInputRef = useRef(null);

  const categories = [
    "Vehicle Issue",
    "Booking Problem",
    "Payment Issue",
    "Customer Service",
    "Technical Problem",
    "Other"
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileUpload = (files) => {
    const validFiles = files.filter(file => 
      file.type === "application/pdf" || 
      file.type.startsWith("image/") ||
      file.type.startsWith("video/")
    );

    if (validFiles.length !== files.length) {
      alert("Some files were not uploaded. Please upload only PDF, image, or video files.");
    }

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile = {
          id: Date.now() + Math.random(),
          file: file,
          preview: e.target?.result,
          size: (file.size / 1024).toFixed(2) + ' KB',
          name: file.name,
          type: file.type
        };
        setUploadedFiles(prev => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(Array.from(e.target.files));
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategorySelect = (category) => {
    setFormData(prev => ({
      ...prev,
      category: category
    }));
    setIsDropdownOpen(false);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    console.log("Complaint submitted:", { formData, uploadedFiles });
  };

  return (
    <>
      <div className="h-full p-6 space-y-6">
        {/* Header */}
        <div className="mb-8 mt-5">
          <h1 className="text-2xl font-semibold text-white">
            {t("user.menu.submitComplaint")}
          </h1>
          <div className="w-full h-px bg-gray-700 mt-4" />
        </div>

        <div className="space-y-6">
          {/* Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                {t("user.profile.submitComplaint.name")}
              </label>
              <input
                type="text"
                placeholder="Vimal Mahawar"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F3B753]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                {t("user.profile.submitComplaint.email")}
              </label>
              <input
                type="email"
                placeholder="vimal@gmail.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F3B753]"
              />
            </div>
          </div>

          {/* Category & Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                {t("user.profile.submitComplaint.category")}
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-left text-white flex justify-between items-center"
                >
                  <span className={formData.category ? "text-white" : "text-gray-500"}>
                    {formData.category || t("user.profile.submitComplaint.selectCategory")}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-gray-600 rounded-lg z-10 max-h-60 overflow-y-auto">
                    {categories.length>0&&categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategorySelect(cat)}
                        className="w-full px-4 py-3 text-left text-white hover:bg-gray-700"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Upload Area */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                {t("user.profile.submitComplaint.uploadLabel")}
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 min-h-[60px] flex items-center justify-center text-center transition-all duration-200 cursor-pointer ${
                  dragActive
                    ? "border-[#F3B753] bg-[#F3B753]/10"
                    : "border-gray-600 hover:border-[#F3B753]/50 hover:bg-[#F3B753]/5"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.mp4,.mov,.avi"
                  multiple
                  onChange={handleFileChange}
                />

                {uploadedFiles.length === 0 ? (
                  <div className="flex flex-col items-center space-y-2">
                    <Upload className={`w-6 h-6 ${dragActive ? "text-[#F3B753]" : "text-gray-400"}`} />
                    <p className="text-sm text-[#F3B753] font-medium">
                      {t("user.profile.submitComplaint.uploadButton")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("user.profile.submitComplaint.uploadHint")}
                    </p>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="relative bg-[#2a2a2a] border border-gray-600 rounded-lg p-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(file.id);
                            }}
                            className="absolute -top-2 -right-2 p-1 bg-red-600 hover:bg-red-700 rounded-full"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>

                          <div className="flex flex-col items-center space-y-1">
                            {file.type.startsWith("image/") ? (
                              <img src={file.preview} alt="preview" className="w-12 h-12 object-cover rounded border border-gray-500" />
                            ) : (
                              <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
                                <FileText className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                            <p className="text-xs text-gray-300 truncate max-w-full">
                              {file.name.length > 12 ? file.name.substring(0, 12) + "..." : file.name}
                            </p>
                            <p className="text-xs text-gray-500">{file.size}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center space-x-2 text-sm text-[#F3B753] border-t border-gray-600 pt-3">
                      <Upload className="w-4 h-4" />
                      <span>{t("user.profile.submitComplaint.uploadButton")}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              {t("user.profile.submitComplaint.comments")}
            </label>
            <textarea
              placeholder={t("user.profile.submitComplaint.commentsPlaceholder")}
              value={formData.comments}
              onChange={(e) => handleInputChange("comments", e.target.value)}
              rows={6}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F3B753] resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-8 py-3 w-full md:w-[200px] bg-[#F3B753] text-black font-medium rounded-lg hover:bg-[#F3B753]/90 transition-colors disabled:opacity-50"
              disabled={!formData.name || !formData.email || !formData.category || !formData.comments}
            >
              {t("user.profile.submitComplaint.submit")}
            </button>
          </div>
        </div>
      </div>

      {/* Submit Success Modal */}
      {isSubmitted && (
        <div className="fixed inset-0 bg-[#000000a1] flex items-center justify-center z-50">
          <div className="bg-[#1D1B11] border border-[#F3B753] rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-center items-center mb-4">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mb-2">
                <img src={assets.submitted} className="w-100" alt="Submitted" />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-white text-center mb-4">
              {t("user.profile.submitComplaint.submitSuccess")}
            </h2>

            <p className="text-gray-400 text-center mb-6">
              {t("user.profile.submitComplaint.submitThankYou")}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setIsSubmitted(false)}
                className="flex-1 px-4 py-2 bg-[#F3B753] text-black rounded-md hover:bg-[#e6a945] font-medium"
              >
                {t("user.profile.submitComplaint.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubmitComplaint;

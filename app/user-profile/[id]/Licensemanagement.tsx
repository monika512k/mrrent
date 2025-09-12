import { useState, useRef, useEffect } from "react";
import { Upload, FileText, X, Calendar, AlertCircle, Check, Loader2 } from "lucide-react";
import { useLanguage } from '../../context/LanguageContext';
import { uploadLicence } from "app/services/api";

interface userData {
    firstName?: string;
    lastName?: string;
    gender?: 'Male' | 'Female';
    email?: string;
    phone?: string;
    address?: string;
    user_id: number;
}
interface AccountDetailsProps {
    userData: userData;
    setSelectedMenu: (menuId: string) => void;
}

const LicenseManagement: React.FC<AccountDetailsProps> = ({ userData,setSelectedMenu }) => {
  const [uploadedFiles, setUploadedFiles] = useState<any>({
    front: null,
    back: null
  });
  const [formData, setFormData] = useState({
    licenseNumber: '',
    expiryDate: '',
    dateOfBirth: '',
    issueDate: '',

  });
  const [dragActive, setDragActive] = useState({ front: false, back: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  
  const fileInputRefs = {
    front: useRef(null),
    back: useRef(null)
  };
  const { t } = useLanguage();

  const handleDrag = (e: React.DragEvent<HTMLDivElement>, type: keyof typeof uploadedFiles) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(prev => ({ ...prev, [type]: true }));
    } else if (e.type === "dragleave") {
      setDragActive(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: keyof typeof uploadedFiles) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: false }));
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0], type);
    }
  };

  const handleFileUpload = (file: File, type: keyof typeof uploadedFiles) => {
    if (file && (file.type === "application/pdf" || file.type.startsWith("image/"))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedFiles((prev:any) => ({
          ...prev,
          [type]: {
            file: file,
            preview: e.target?.result,
            size: (file.size / 1024).toFixed(2) + ' KB',
            name: file.name
          }
        }));
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a PDF or image file");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof uploadedFiles) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0], type);
    }
  };

  const removeFile = (type: keyof typeof uploadedFiles) => {
    setUploadedFiles((prev:any) => ({
      ...prev,
      [type]: null
    }));
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!uploadedFiles.front || !uploadedFiles.back || !formData.licenseNumber || !formData.expiryDate) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fill all required fields and upload both license images.'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const formDataToSend = new FormData();
      
      // Add form fields
      formDataToSend.append('upload_type', 'license');
      formDataToSend.append('user_id', String(userData?.user_id)); // You might want to get this from context/props
      formDataToSend.append('licence_number', formData?.licenseNumber);
      formDataToSend.append('expiry_date', formData?.expiryDate);
      if (formData.dateOfBirth) {
        formDataToSend.append('date_of_birth', formData?.dateOfBirth);
      }
      if (formData.issueDate) {
        formDataToSend.append('issue_date', formData.issueDate);
      }
      formDataToSend.append('front_image', uploadedFiles?.front?.file);
      formDataToSend.append('back_image', uploadedFiles?.back?.file);


   const response =  await uploadLicence(formDataToSend) as any
      if (response.status) {
        const result = await response.json();
        setSubmitStatus({
          type: 'success',
          message:result.message|| 'License uploaded successfully!'
        });
        
      } else {
        const errorData = await response.json();
        setSubmitStatus({
          type: 'error',
          message: errorData.message || 'Failed to upload license. Please try again.'
        });
      }
    } catch (error:any) {

      setSubmitStatus({
        type: 'error',
        message: error?.response?.data?.message||'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  type LicenseSide = "front" | "back";
  interface UploadAreaProps {
    type: LicenseSide;
    title: string;
  }
  
  const UploadArea: React.FC<UploadAreaProps> = ({ type, title }) => {
    const uploadedFile = uploadedFiles[type];
    
    if (uploadedFile) {
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {title}
          </label>
          <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-4 bg-[#1a1a1a]">
            <button
              onClick={() => removeFile(type)}
              className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 rounded-full transition-colors z-10"
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 text-white" />
            </button>
            
            <div className="flex flex-col items-center space-y-3">
              {uploadedFile.file.type.startsWith('image/') ? (
                <img 
                  src={uploadedFile.preview} 
                  alt="License preview" 
                  className="w-32 h-20 object-cover rounded border-2 border-gray-500"
                />
              ) : (
                <div className="w-32 h-20 bg-gray-700 rounded flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
              )}
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-green-400 mb-1">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <p className="text-xs text-gray-400">
                  {uploadedFile.size} of {uploadedFile.size}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {title}
        </label>
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer min-h-[140px] flex items-center justify-center
            ${dragActive[type] 
              ? 'border-[#F3B753] bg-[#F3B753]/10' 
              : 'border-gray-600 hover:border-[#F3B753]/50 hover:bg-[#F3B753]/5'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDragEnter={(e) => !isSubmitting && handleDrag(e, type)}
          onDragLeave={(e) => !isSubmitting && handleDrag(e, type)}
          onDragOver={(e) => !isSubmitting && handleDrag(e, type)}
          onDrop={(e) => !isSubmitting && handleDrop(e, type)}
          onClick={() => !isSubmitting && (fileInputRefs[type] as any).current?.click()}
        >
          <input
            ref={fileInputRefs[type]}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange(e, type)}
            disabled={isSubmitting}
          />
          
          <div className="flex flex-col items-center space-y-3">
            <Upload className={`w-8 h-8 ${dragActive[type] ? 'text-[#F3B753]' : 'text-gray-400'}`} />
            <div className="text-center">
              <p className="text-sm text-gray-300 mb-1">
                {t('user.profile.licenseManagement.uploadText')}
              </p>
              <p className="text-xs text-gray-500">
               {t('user.profile.licenseManagement.documentSupported')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 mt-5">
      {/* Header */}
      <div className="flex items-center justify-between mt-[50px]">
        <div>
          <h1 className="text-2xl font-semibold text-white">{t('user.menu.licenseManagement')}</h1>
        </div>
        <button className="flex items-center gap-2 text-[#F3B753] hover:text-[#F3B753]/80 transition-colors">
          <Calendar className="w-4 h-4" />
          <span className="text-sm" onClick={() => setSelectedMenu("licence-history")}>History</span>
        </button>
      </div>

      {/* Status Message */}
      {submitStatus.message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          submitStatus.type === 'success' 
            ? 'bg-green-600/20 border border-green-600/50 text-green-400' 
            : 'bg-red-600/20 border border-red-600/50 text-red-400'
        }`}>
          {submitStatus.type === 'success' ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="text-sm">{submitStatus.message}</span>
        </div>
      )}

      {/* Upload Section */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UploadArea 
            type="front" 
            title={t('user.profile.licenseManagement.licenseFront')}
          />
          <UploadArea 
            type="back" 
            title={t('user.profile.licenseManagement.licenseBack')}
          />
        </div>

        {/* License Details Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
             {t('user.profile.licenseManagement.licenseNumber')} *
            </label>
            <input
              type="text"
              placeholder="A123456Z99C"
              value={formData.licenseNumber}
              onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F3B753] transition-colors disabled:opacity-50"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              {t('user.profile.licenseManagement.licenseExpiry')} *
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#F3B753] transition-colors pr-10 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              {t('user.profile.licenseManagement.dateOfBirth')} *
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#F3B753] transition-colors pr-10 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              {t('user.profile.licenseManagement.issueDate')} *
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.issueDate}
                onChange={(e) => handleInputChange('issueDate', e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#F3B753] transition-colors pr-10 disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleSubmit}
            className="px-8 py-3 w-full md:w-[300px] bg-[#F3B753] text-black font-medium rounded-lg hover:bg-[#F3B753]/90 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            disabled={!uploadedFiles.front || !uploadedFiles.back || !formData.licenseNumber || !formData.expiryDate || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
              </>
            ) : (
           t('user.save')
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LicenseManagement;
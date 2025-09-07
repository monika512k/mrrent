import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, MessageCircle } from "lucide-react";
import { useLanguage } from 'app/context/LanguageContext';
import Image from 'next/image';
import assets from "../../assets/assets";

const ContactSupport = () => {
  const { t } = useLanguage();

  return (
    <div className="relative top-[30px] mt-5">
      {/* Header */}
      <div className="mb-8 mt-5">
        <h1 className="text-2xl font-semibold hidden md:block text-white">
          {t("user.contactSupport.title")}
        </h1>
      </div>

      {/* Main Container */}
      <div className="rounded-lg m-4">
        <div className="flex flex-col md:flex-row bg-gradient-to-br from-[#1C1C1C] to-[#121212] rounded-xl border border-yellow-700/30 backdrop-blur-[18px] px-8 py-12 gap-10 items-center">
          
          {/* Left: Illustration */}
          <div className="flex-1 flex justify-center">
            <Image
              src={assets.ContactUs}
              alt={t("user.contactSupport.imageAlt")}
              width={400}
              height={400}
              className="max-w-xs md:max-w-md"
            />
          </div>

          {/* Right: Contact Info */}
          <div className="flex-1 space-y-6 text-white">
            {/* Phone */}
            <div className="flex items-center gap-4">
              <Phone className="text-[#F3B753] w-6 h-6" aria-label="Phone icon" />
              <span className="text-lg">{t("user.contactSupport.phone")}</span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4">
              <Mail className="text-[#F3B753] w-6 h-6" aria-label="Email icon" />
              <span className="text-lg">{t("user.contactSupport.email")}</span>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4">
              <MapPin className="text-[#F3B753] w-6 h-6 mt-1" aria-label="Map icon" />
              <span className="text-lg">
                {t("user.contactSupport.address.line1")}<br />
                {t("user.contactSupport.address.line2")}
              </span>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-5 pt-4">
              {[Facebook, Twitter, Instagram, Linkedin, MessageCircle].map((Icon, idx) => (
                <Icon
                  key={idx}
                  className="w-8 h-8 text-black bg-[#F3B753] p-1.5 rounded-full hover:bg-yellow-500 cursor-pointer transition"
                  aria-label={`${Icon.name} icon`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;

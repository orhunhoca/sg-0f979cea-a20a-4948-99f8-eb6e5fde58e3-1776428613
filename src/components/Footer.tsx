import { MapPin, Phone, Mail, Instagram, Twitter, Linkedin, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <img 
              src="/logo.jpg" 
              alt="Eyüboğlu Logo" 
              className="h-12 w-auto"
            />
            <p className="text-sm text-gray-400">
              Eyüboğlu Eğitim Kurumları Mezunlar Derneği - Mezunlarımız arasında güçlü bir bağ oluşturuyoruz.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">İletişim Bilgileri</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  [ADRES BİLGİSİ EKLENECEK]
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="tel:+905403963337" className="text-sm hover:text-white transition-colors">
                  +90 540 396 33 37
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="mailto:info@eymeder.com" className="text-sm hover:text-white transition-colors">
                  [EMAIL BİLGİSİ EKLENECEK]
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Hızlı Erişim</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about/baskanin-mesaji" className="text-sm hover:text-white transition-colors">
                  Başkanın Mesajı
                </a>
              </li>
              <li>
                <a href="/about/yonetim-kurulu" className="text-sm hover:text-white transition-colors">
                  Yönetim Kurulu
                </a>
              </li>
              <li>
                <a href="/directory" className="text-sm hover:text-white transition-colors">
                  Mezun Dizini
                </a>
              </li>
              <li>
                <a href="/events" className="text-sm hover:text-white transition-colors">
                  Etkinlikler
                </a>
              </li>
              <li>
                <a href="/fonzip-signup" className="text-sm hover:text-white transition-colors">
                  Üyelik
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Bizi Takip Edin</h3>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/eyuboglumezunlardernegi/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-primary p-3 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/EyubogluMD"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-primary p-3 rounded-full transition-colors"
                aria-label="Twitter/X"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/eyüboğlu-mezunlar-derneği-578092131/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-primary p-3 rounded-full transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/905403963337"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-[#25D366] p-3 rounded-full transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Sosyal medyada bizi takip ederek güncel haberlerden haberdar olun!
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Eyüboğlu Eğitim Kurumları Mezunlar Derneği. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
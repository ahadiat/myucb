"use client"

import { useState, useEffect } from 'react';
import HeroCTA from '@/app/components/buttonMohon'
import { CheckCircle, ArrowRight, BookOpen, Heart, Stars, Award, ShieldCheck } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Daftar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1200, // Kelajuan animasi (1.2 saat)
      once: false,    // Jika 'false', animasi akan berulang setiap kali anda skrol atas/bawah
      mirror: true,   // Elemen akan hilang semula bila skrol melepasi ke atas
    });
  }, []);

  const scrollToForm = () => {
    const el = document.getElementById("application-form");
    if (!el) return console.warn("Form not found");
    el.scrollIntoView({ behavior: "smooth" });
  };



  useEffect(() => {
    const handleScroll = () => {
      // Jika skrol lebih daripada 10px, set isScrolled kepada true
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const benefits = [
    { text: "Caruman Insuran berkelompok serendah RM30", img: "https://www.ucbestari.edu.my/wp-content/uploads/2021/08/section-27.jpg" },
    { text: "Program Dapur Minda ( Makan RM3 untuk 3 kali makan *) ", img: "/img/2.jpg" },
    { text: "Pinjaman PTPTN", img: "https://www.ucbestari.edu.my/wp-content/uploads/2021/08/section-konvo-1.jpg" },
    { text: "Penginapan Percuma 1 Tahun.", img: "/img/4.jpg" },
   
  ];


  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      
      {/* 0. STICKY NAVBAR */}
     
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 px-4 md:px-10 flex justify-between items-center ${
  isScrolled 
    ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100 py-2 md:py-3' 
    : 'bg-transparent py-4 md:py-6 border-b border-transparent'
}`}>

  {/* LOGO SECTION */}
  <div
    className={`${
      isScrolled 
        ? 'block' 
        : 'hidden md:flex items-center'
    }`}
  >
    <img 
      src="https://www.ucbestari.edu.my/wp-content/uploads/2023/12/ucb-logo-heading-2.webp" 
      alt="UC Bestari Logo"
      className="h-10 md:h-12 lg:h-16 w-auto transition-all duration-500"
    />
  </div>

  {/* CTA BUTTON */}
  <div
    className={`${
      isScrolled 
        ? 'block' 
        : 'hidden md:flex items-center'
    }`}
  >
    <div className="transform scale-90 md:scale-100 origin-right">
      <HeroCTA onClick={scrollToForm}/>
    </div>
  </div>

</nav>

    

      {/* 1. HERO SECTION */}
      <header className="relative min-h-[80vh] flex items-center pt-24 pb-16 px-4 md:px-10 lg:pt-48 lg:pb-32 overflow-hidden">
  {/* 1. Background Image Layer dengan Auto-Zoom Animation */}
  <div 
    className={`absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform ease-out duration-[10000ms] 
      ${isVisible ? 'scale-110' : 'scale-100'}`}
    style={{ 
      backgroundImage: `url('https://www.ucbestari.edu.my/wp-content/uploads/2021/06/sekitar-1024x380-1.jpg')`,
    }}
  />

  {/* 2. Black/Dark Gradient Overlay Layer */}
  <div className="absolute inset-0 z-10 bg-linear-to-b from-black/30 via-slate-900/60 to-black" />

  {/* 3. Content Layer */}
  <div className="relative z-20 w-full max-w-6xl mx-auto text-center">
    <div className={`transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      
      {/* Badge: Font size lebih kecil di mobile */}
      <span className="inline-block py-1.5 px-4 rounded-full bg-linear-to-r from-red-600 via-red-600/30 to-black text-white text-xs md:text-sm font-bold mb-6 shadow-lg border border-white/10">
        Peluang Pendidikan Untuk Semua
      </span>
      
      {/* Heading: text-4xl di mobile, text-5xl di tablet, text-7xl di desktop */}
      <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight drop-shadow-2xl px-2">
        Semua orang berhak untuk <br className="hidden md:block" />
        <span className='text-red-600'>berjaya...</span>
      </h1>
      
      {/* Paragraph: Lebar (max-width) dikawal supaya tidak terlalu panjang di desktop */}
      <p className="text-base md:text-lg lg:text-xl text-slate-200 mb-10 max-w-xs md:max-w-2xl lg:max-w-3xl mx-auto drop-shadow-md leading-relaxed px-4">
        Di UC Bestari, kami percaya kemiskinan bukan penghalang impian. Kami menyediakan jambatan untuk pelajar yatim dan kurang berkemampuan mengubah takdir hidup.
      </p>
      
      {/* Container untuk CTA supaya senang klik di mobile */}
      <div className="flex justify-center px-6">
        <HeroCTA onClick={scrollToForm}/>
      </div>
    </div>
  </div>
</header>

      {/* 2. STORY SECTION */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="border-l-4 border-amber-400 pl-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-blue-900 mb-6 italic" data-aos="fade-right" >
              "Ramai yang berbakat, tetapi tidak berpeluang menyambung pelajaran oleh kerana kekangan wang."
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
            
            </p>
          </div>
        </div>
      </section>

      <section>
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-6 gap-32 py-40">
  
  {/* Ayat 1: Fade Up */}
  
  <div 
    data-aos="fade-up" 
    className="text-2xl md:text-4xl font-light italic text-center text-slate-300"
  >
    "...untuk anda yang tidak berhenti berharap"
  </div>
 
  

  {/* Ayat 2: Fade Right (Masuk dari kiri ke kanan) */}
  <div 
    data-aos="fade-right" 
    data-aos-delay="200"
    className="text-2xl md:text-4xl font-semibold italic text-center text-red-600"
  >
    "...untuk anda yang ingin mengubah hidup anda"
  </div>

  {/* Ayat 3: Fade Up dengan Delay lebih lama */}
  <div 
    data-aos="fade-up" 
    data-aos-delay="400"
    className="text-2xl md:text-4xl font-light italic text-center text-white border-b-2 border-red-600 pb-4"
  >
    "...untuk anda yang ingin melangkah"
  </div>

</div>
      </section>
     
      {/* 3. CORE DIFFERENCE */}
     

      {/* 4. BENEFITS SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-blue-900 mb-16">Kenapa Pilih UC Bestari?</h2>
          <div className="columns-1 md:columns-2 lg:columns-4 gap-6 space-y-6">
  {benefits.map((item, idx) => (
    <div
      key={idx}
      className={`relative overflow-hidden rounded-2xl break-inside-avoid shadow-lg group ${
        idx % 3 === 0 ? "h-64" : idx % 3 === 1 ? "h-80" : "h-56"
      }`}
    >
      {/* Background Image */}
      <img
        src={item.img}
        alt={item.text}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>

      {/* Content */}
      <div className="relative z-10 flex items-end h-full p-4">
        <div className="flex items-center space-x-2 text-white">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold">{item.text}</span>
        </div>
      </div>
    </div>
  ))}
</div>
        </div>
      </section>

      {/* 5. TRANSFORMATION SECTION */}
      <section className="py-24 px-6 bg-blue-900 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-blue-800/50 p-10 rounded-3xl border border-blue-700">
            <span className="text-blue-300 font-bold uppercase tracking-widest text-sm">Sebelum</span>
            <h3 className="text-3xl font-bold mt-4 mb-6">Tiada Hala Tuju & Buntu</h3>
            <ul className="space-y-4 text-blue-100">
              <li>• Risau masa depan kerana masalah kewangan</li>
              <li>• Rasa rendah diri dengan rakan sebaya</li>
              <li>• Terpaksa melupakan minat demi kelangsungan hidup</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-10 rounded-3xl shadow-2xl transform lg:scale-110">
            <span className="text-white/80 font-bold uppercase tracking-widest text-sm">Selepas</span>
            <h3 className="text-3xl font-bold mt-4 mb-6 text-white">Berdaya Saing & Berjaya</h3>
            <ul className="space-y-4 text-white">
              <li>• Mendapat pendidikan berkualiti tanpa beban</li>
              <li>• Keyakinan diri yang tinggi</li>
              <li>• Menjadi kebanggaan keluarga & masyarakat</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. TRUST SECTION */}
      <section className="py-12 px-6 border-b border-slate-100">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
          <div className="flex items-center space-x-2">
            <Award className="w-8 h-8" />
            <span className="font-bold text-xl tracking-tighter">MQA ACCREDITED</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-8 h-8" />
            <span className="font-bold text-xl tracking-tighter">KPT RECOGNIZED</span>
          </div>
          <p className="text-sm font-medium w-full text-center mt-4">Kredibiliti terjamin, masa depan dilindungi.</p>
        </div>
      </section>

      {/* 7. EMOTIONAL CLOSE */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl lg:text-6xl font-black text-blue-900 leading-tight">
            "Satu Keputusan Hari Ini, Mampu Mengubah Nasib Tujuh Keturunan."
          </h2>
        </div>
      </section>

      {/* 8 & 9. FINAL CTA & FORM SECTION */}
      <section id="application-form" className="py-24 px-6 bg-slate-900 text-white relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Mulakan perubahan hidup anda hari ini</h2>
            <p className="text-slate-400 text-lg mb-8">
              Isi borang ringkas ini dan pegawai kami akan hubungi anda dalam masa 24 jam untuk sesi konsultasi percuma.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold">1</div>
                <p>Isi maklumat diri yang lengkap</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold">2</div>
                <p>Pilih program yang diminati</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 lg:p-12 rounded-3xl shadow-2xl">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-slate-700 font-bold mb-2">Nama Penuh</label>
                <input type="text" placeholder="Contoh: Ahmad Bin Ibrahim" className="w-full p-4 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-2">No. Telefon (WhatsApp)</label>
                <input type="tel" placeholder="012-3456789" className="w-full p-4 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-2">Email</label>
                <input type="email" placeholder="nama@email.com" className="w-full p-4 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-2">Program Minat</label>
                <select className="w-full p-4 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>Pilih Program...</option>
                  <option>Diploma Pengurusan Perniagaan</option>
                  <option>Diploma Teknologi Maklumat</option>
                  <option>Diploma Pendidikan Awal Kanak-kanak</option>
                  <option>Lain-lain</option>
                </select>
              </div>
              <button className="w-full bg-amber-500 hover:bg-amber-600 text-blue-950 text-xl font-black py-5 rounded-xl transition-all shadow-lg shadow-amber-900/20">
                👉 Mohon Sekarang
              </button>
              <p className="text-center text-slate-400 text-xs">
                Data anda selamat bersama kami. Kami akan menghubungi anda segera.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-slate-500 text-sm border-t border-slate-100">
        © 2026 University College Bestari. Semua Hak Terpelihara.
      </footer>
    </div>
  );
};

export default Daftar;
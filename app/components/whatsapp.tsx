export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/601121982971?text=Assalamualaikum%2C%20saya%20ingin%20bertanya%20mengenai%20pendaftaran%20Dapo%20Minda."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi Admin melalui WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-green-500 px-4 py-3 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-green-600 active:scale-95 sm:bottom-8 sm:right-8"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6"
      >
        <path d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.5 0 .14 5.35.14 11.93c0 2.1.55 4.15 1.6 5.96L.04 24l6.26-1.64a11.9 11.9 0 0 0 5.77 1.47h.01c6.58 0 11.94-5.35 11.94-11.93a11.85 11.85 0 0 0-3.5-8.42Z" />
      </svg>

      <span className="text-sm font-semibold sm:text-base">
        Hubungi Admin
      </span>
    </a>
  );
}
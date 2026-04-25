const Footer = () => {
  return (
    <footer className="border-t border-slate-200 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-slate-600 flex flex-col gap-2">
        <p className="font-semibold text-slate-800">BoardTrack</p>
        <p>Premium billboard advertising management system.</p>
        <p>© {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
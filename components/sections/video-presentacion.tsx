export default function VideoPresentacion() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-semibold tracking-widest uppercase text-brand-DEFAULT">
          Presentación
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900">
          Conoce cómo te ayudamos
        </h2>
        <p className="mt-3 text-slate-500 max-w-xl mx-auto">
          Mira este video donde te explicamos cómo podemos ayudarte a conseguir tu crédito ideal.
        </p>
        <div className="mt-8 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video controls preload="metadata" className="w-full aspect-video bg-black" poster="/images/banner.jpg">
            <source src="/videos/presentacion.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}

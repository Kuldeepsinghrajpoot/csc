const galleryImages = [
  {
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80",
    title: "Modern CSC Office",
    category: "Office",
  },
  {
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
    title: "Customer Assistance",
    category: "Support",
  },
  {
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
    title: "Digital Banking",
    category: "Banking",
  },
  {
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    title: "Government Services",
    category: "Services",
  },
  {
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    title: "Document Verification",
    category: "Verification",
  },
  {
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    title: "Happy Customers",
    category: "Customers",
  },
];

const Gallery = () => {
  return (
    <section
      id="gallery"
      className="py-24 bg-slate-50"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-16">

          <span className="uppercase tracking-[4px] text-blue-500 font-semibold">

            Gallery

          </span>

          <h2 className="text-5xl font-bold text-slate-800 mt-5">

            Explore Our
            <span className="text-blue-500">
              {" "}Digital Service Center
            </span>

          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-gray-600 text-lg">

            Take a look inside our CSC Digital Service Center and see how
            we deliver secure, reliable, and customer-focused digital services.

          </p>

        </div>

        {/* Gallery Grid */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {galleryImages.map((item, index) => (

            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl shadow-lg"
            >

              <img
                src={item.image}
                alt={item.title}
                className="w-full h-80 object-cover group-hover:scale-110 transition duration-700"
              />

              {/* Overlay */}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500">

                <div className="absolute bottom-6 left-6">

                  <span className="bg-blue-500 px-3 py-1 rounded-full text-sm text-white">

                    {item.category}

                  </span>

                  <h3 className="text-white text-2xl font-bold mt-4">

                    {item.title}

                  </h3>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* Bottom Banner */}

        <div className="mt-20 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-12 text-center">

          <h2 className="text-4xl font-bold">

            Visit Our CSC Center Today

          </h2>

          <p className="mt-5 max-w-2xl mx-auto text-gray-300">

            Experience professional digital services with a friendly team,
            modern facilities, and quick processing for all government and
            banking requirements.

          </p>

          <button className="mt-8 bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-xl font-semibold transition">

            Schedule Your Visit

          </button>

        </div>

      </div>
    </section>
  );
};

export default Gallery;

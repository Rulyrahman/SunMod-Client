import React, { useState, useEffect } from "react";
import { fetchData } from "../admin/api";

const Profil = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadContent = async () => {
    setLoading(true);
    try {
      const response = await fetchData("product");
      setContent(response);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const renderContent = (item) => {
    if (item.id === 1) {
      return (
        <div
          key={item.id}
          className="col-span-1 row-span-1 xl:row-span-2 flex items-center justify-center text-xl font-bold rounded-custom-br overflow-hidden h-[250px] md:h-[400px] lg:h-[500px] xl:h-auto"
          style={{
            backgroundImage: `url(${item.picture})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="bg-black bg-opacity-50 w-full h-full flex flex-col justify-end p-6 lg:p-14">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-widest text-white">{item.name}</h1>
            <h2 className="font-normal text-xs sm:text-base lg:text-xl tracking-widest text-white">
              {item.description}
            </h2>
          </div>
        </div>
      );
    }

    return (
      <div key={item.id} className="bg-sumod-bl2 text-custom-black flex flex-col shadow-md rounded-lg p-6">
        <div className="flex flex-row xl:p-8 items-center mb-2 lg:mb-3">
          <h1 className="text-base sm:text-2xl lg:text-3xl xl:text-4xl text-sumod-bl font-bold tracking-wide text-start mb-4 flex-grow">
            {item.name}
          </h1>
          <div className="bg-white p-1 lg:p-2 xl:p-3 rounded-custom-br flex-shrink-0">
            <img
              src={item.picture}
              alt={item.name}
              className="h-14 w-14 lg:h-20 lg:w-20 xl:h-28 xl:w-28 object-contain"
            />
          </div>
        </div>
        <h2 className="font-normal text-xs sm:text-base lg:text-xl tracking-widest text-justify">{item.description}</h2>
      </div>
    );
  };

  const getContentByIds = (ids) => content.filter((item) => ids.includes(item.id));

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto">
      <div className="max-w-full">
        <div className="py-10 h-[200px] md:h-[280px] lg:h-[400px] flex lg:justify-center lg:items-center bg-gradient-to-l from-blue-50 via-blue-400 to-custom-blue mt-3 sm:mt-5 lg:mt-15 rounded-custom-br lg:mx-1">
          <div className="max-w-full mx-auto px-4 sm:px-8 md:px-10 lg:px-20 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="title-content space-y-4 my-auto text-white">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-widest">SUNAT MODERN</h1>
              <h2 className="font-normal text-xs sm:text-xl lg:text-2xl leading-3 tracking-widest">
                Layanan Terbaik dengan Metode Modern
              </h2>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="overflow-hidden md:block hidden">
                <img
                  src="https://res.cloudinary.com/dwaopoeya/image/upload/v1735427940/boards/ut0kl8egzuhvlsxibkjo.png"
                  alt="Profile"
                  className="w-1/2 h-auto object-cover mx-auto"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto mb-10 lg:mb-15 xl:mb-20 mt-6">
          {getContentByIds([1]).map(renderContent)}

          <div className="border-8 border-sumod-bl2 h-auto text-custom-black flex flex-col items-center justify-center text-lg font-medium rounded-custom-br p-6">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-widest">Visi</h1>
            <h2 className="font-normal text-xs sm:text-base lg:text-xl tracking-widest text-center mt-4">
              "Menjadi pusat layanan sunat modern terbaik yang mengutamakan kenyamanan, keamanan, dan kepuasan pelanggan
              melalui teknologi terkini dan pelayanan profesional."
            </h2>
          </div>

          <div className="sm:col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-1 border-8 border-sumod-bl2 text-custom-black flex flex-col items-center justify-center text-lg font-medium rounded-custom-br p-6">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-widest">Misi</h1>
            <div className="font-normal text-xs sm:text-base lg:text-xl tracking-widest text-center mt-4 space-y-2 lg:space-y-4">
              <p>
                1. Memberikan Pelayanan Profesional: Menghadirkan tim medis yang terlatih dan berpengalaman untuk
                memberikan prosedur sunat yang aman dan nyaman.
              </p>
              <p>
                2. Menggunakan Teknologi Modern: Mengaplikasikan metode sunat terkini seperti klamp, stapler, atau laser
                untuk mempercepat proses penyembuhan.
              </p>
              <p>
                3. Mengutamakan Kebersihan dan Sterilisasi: Memastikan setiap alat dan fasilitas sesuai dengan standar
                kesehatan internasional.
              </p>
              <p>
                4. Edukasi dan Sosialisasi: Memberikan informasi yang akurat kepada orang tua dan anak tentang proses,
                manfaat, dan perawatan pasca sunat.
              </p>
              <p>
                5. Fokus pada Kepuasan Pelanggan: Menyediakan layanan ramah anak, seperti fasilitas hiburan, untuk
                mengurangi rasa takut dan cemas.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-sumod-wt mb-5 lg:mb-8 xl:mb-10 rounded-custom-br p-6">
          <p className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-sumod-bl tracking-wide flex justify-center ">
            KENAPA HARUS DI SUMOD?
          </p>
        </div>

        <div className="bg-sumod-wt rounded-custom-br">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 lg:p-10 xl:p-14">
            {getContentByIds([2, 3, 4, 5, 6, 7]).map(renderContent)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;

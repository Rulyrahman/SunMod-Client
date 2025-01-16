import React, { useEffect, useState } from "react";
import { fetchData, updateData } from "../api/apiService";
import { ListBulletIcon, PencilIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { BallTriangle } from "react-loading-icons";

const AdminLayanan = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [newData, setNewData] = useState({
    name: "",
    description: "",
    fasilitas: "",
    keunggulan: "",
    picture: null,
  });
  const [btnLoading, setBtnLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [descError, setDescError] = useState("");
  const [facError, setFacError] = useState("");
  const [excError, setExcError] = useState("");
  const [pictError, setPictError] = useState("");

  const loadServices = async () => {
    setLoading(true);
    try {
      const response = await fetchData("service");
      setServices(response);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    let isValid = true;
    setNameError("");
    setDescError("");
    setFacError("");
    setExcError("");
    setPictError("");
    if (
      !newData.name.trim() ||
      !newData.description.trim() ||
      !newData.fasilitas.trim() ||
      !newData.keunggulan.trim()
    ) {
      alert("Semua kolom wajib diisi.");
      return;
    }
    if (!isValid) return;

    try {
      const formData = new FormData();
      formData.append("name", newData.name);
      formData.append("description", newData.description);
      formData.append("fasilitas", newData.fasilitas);
      formData.append("keunggulan", newData.keunggulan);
      if (newData.picture) {
        formData.append("picture", newData.picture);
      }
      setBtnLoading(true);
      const updatedService = await updateData("service", id, formData);
      toast.dismiss();
      toast.success(`Layanan ${updatedService.name} berhasil diupdate!`);
      setSelectedService(null);
      setNewData({ name: "", description: "", fasilitas: "", keunggulan: "", picture: null });
      loadServices();
      setBtnLoading(false);
    } catch (err) {
      toast.dismiss();
      toast.error("Gagal mengupdate layanan: " + (err.response?.data?.message || err.message));
      setBtnLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      e.target.value = "";
      setPictError("Ukuran file maksimal 5MB.");
      return;
    }
    if (file) {
      setPictError("");
      setNewData({ ...newData, picture: file });
    }
  };

  const handleBulletPoint = () => {
    const selectedText = window.getSelection().toString();

    if (selectedText.trim()) {
      const bulletText = `<span class='bg-emerald-100 font-semibold text-custom-black'>• ${selectedText}</span>`;
      document.execCommand("insertHTML", false, bulletText);
    } else {
      document.execCommand(
        "insertHTML",
        false,
        `<span class='bg-emerald-100 font-semibold text-custom-black'>• </span>`
      );
    }
  };

  const handleHighlight = () => {
    const selectedText = window.getSelection().toString();
    if (!selectedText) {
      alert("Pilih teks yang ingin di-highlight.");
      return;
    }

    const highlightedText = `[[highlight]]${selectedText}[[/highlight]]`;
    const updatedDescription = newData.description.replace(selectedText, highlightedText);
    setNewData({ ...newData, description: updatedDescription });
  };

  const renderFormattedDescription = (description) => {
    let formattedText = description.replace(/\n/g, "<span class='block mb-2'></span>");

    formattedText = formattedText.replace(
      /\[\[highlight\]\](.*?)\[\[\/highlight\]\]/g,
      '<span class="bg-emerald-100 font-semibold text-custom-black p-2 inline-block rounded-custom-br">$1</span>'
    );

    formattedText = formattedText.replace(/•/g, '<span class="font-bold">•</span>');

    return { __html: formattedText };
  };

  const resetForm = () => {
    setNewData({
      name: "",
      description: "",
      fasilitas: "",
      keunggulan: "",
      picture: null,
    });
    setNameError("");
    setDescError("");
    setFacError("");
    setExcError("");
    setPictError("");
    setSelectedService(null);
  };

  useEffect(() => {
    loadServices();
  }, []);

  if (loading) return <p className="flex justify-center items-center">Loading...</p>;
  if (error) return <p className="flex justify-center items-center">Error: {error}</p>;

  return (
    <div className="mx-auto p-4 mt-5">
      <h1 className="flex justify-center text-2xl font-bold mb-4">LAYANAN SUMOD</h1>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-3 lg:gap-5 xl:gap-6 mb-8">
          {Array.isArray(services) &&
            services.map((service) => (
              <div
                key={service.id}
                className="p-4 rounded-custom-br overflow-hidden bg-slate-50 shadow-lg w-auto sm:w-[350px] lg:w-[325px] xl:w-[300px] 2xl:w-[380] h-auto"
              >
                <img src={service.picture} alt={service.name} className="rounded-custom-br object-cover mb-2 mx-auto" />
                <div>
                  <h2 className="text-xl font-semibold text-center my-3">{service.name}</h2>
                  <p
                    className="font-light text-justify mb-4 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={renderFormattedDescription(service.description)}
                  ></p>

                  <div className="gap-16 flex justify-center p-2 whitespace-pre-wrap">
                    <p className="font-bold text-justify whitespace-pre-wrap">Fasilitas</p>
                    <p className="font-bold text-justify whitespace-pre-wrap">Keunggulan</p>
                  </div>
                  <div className="gap-4 flex justify-between p-2 whitespace-pre-wrap">
                    <p className="font-light text-justify mb-4 whitespace-pre-wrap">{service.fasilitas}</p>
                    <p className="font-light text-justify mb-4 whitespace-pre-wrap">{service.keunggulan}</p>
                  </div>

                  <div className="text-center mt-4">
                    <button
                      className="bg-orange-500 text-white px-4 py-2 rounded-custom-br tracking-wider"
                      onClick={() => {
                        setSelectedService(service);
                        setNewData({
                          name: service.name,
                          description: service.description,
                          fasilitas: service.fasilitas,
                          keunggulan: service.keunggulan,
                          picture: null,
                        });
                      }}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-screen overflow-y-auto rounded-custom-br">
            <div className="bg-white border p-2 md:p-3 lg:p-5 xl:p-6 rounded-custom-br shadow-lg w-full max-w-md overflow-y-auto">
              <h2 className="font-semibold mb-4">Update Layanan: "{selectedService.name}"</h2>
              <p className="text-custom-black/40 font-bold">Judul</p>
              <input
                type="text"
                placeholder="Judul Baru"
                value={newData.name}
                onChange={(e) => {
                  setNewData({ ...newData, name: e.target.value });
                  if (nameError) setNameError("");
                }}
                className="border p-2 w-full"
              />
              {nameError && <div className="text-red-500 font-semibold text-sm mb-4">{nameError}</div>}
              <p className="text-custom-black/40 font-bold mt-2">Deskripsi</p>
              <textarea
                id="description"
                placeholder="Deskripsi Baru (tambahkan deskripsi di sini)"
                value={newData.description}
                onChange={(e) => {
                  setNewData({ ...newData, description: e.target.value });
                  if (descError) setDescError("");
                }}
                className="border p-2 w-full h-40"
              ></textarea>
              <div className="mb-3 flex justify-center">
                <button onClick={handleBulletPoint} className="border border-gray-300 p-2 rounded mr-2">
                  <ListBulletIcon className="h-5 w-5 text-custom-black" />
                </button>

                <button onClick={handleHighlight} className="border border-gray-300 p-2 rounded">
                  <PencilIcon className="h-5 w-5 text-emerald-600" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-custom-black/40 font-bold mt-2">Fasilitas</p>
                  <textarea
                    id="fasilitas"
                    placeholder="Deskripsi Baru (tambahkan fasilitas di sini)"
                    value={newData.fasilitas}
                    onChange={(e) => {
                      setNewData({ ...newData, fasilitas: e.target.value });
                      if (facError) setFacError("");
                    }}
                    className="border p-2 w-full h-40"
                  ></textarea>
                </div>
                <div>
                  <p className="text-custom-black/40 font-bold mt-2">Keunggulan</p>
                  <textarea
                    id="keunggulan"
                    placeholder="Deskripsi Baru (tambahkan keunggulan di sini)"
                    value={newData.keunggulan}
                    onChange={(e) => {
                      setNewData({ ...newData, keunggulan: e.target.value });
                      if (excError) setExcError("");
                    }}
                    className="border p-2 w-full h-40"
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-center mb-3">
                <button onClick={handleBulletPoint} className="border border-gray-300 p-2 text-center rounded mr-2">
                  <ListBulletIcon className="h-5 w-5 text-custom-black" />
                </button>
              </div>

              <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 w-full mt-2" />
              {pictError && <div className="text-red-500 font-semibold text-sm mb-4">{pictError}</div>}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="bg-sidebar text-white px-4 py-2 rounded"
                  onClick={() => handleUpdate(selectedService.id)}
                  disabled={btnLoading}
                >
                  {btnLoading ? <BallTriangle className="h-7 w-7" /> : "Simpan Perubahan"}
                </button>

                <button className="bg-red-400 text-white px-4 py-2 rounded" onClick={resetForm}>
                  Batal
                </button>
              </div>
            </div>
            <div className="bg-white border p-2 md:p-3 lg:p-5 xl:p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="font-semibold">Preview Deskripsi:</h3>
              <div
                className="border p-2 w-full mt-2 h-auto bg-slate-50 max-h-[100px] md:max-h-[450px] overflow-y-auto"
                dangerouslySetInnerHTML={renderFormattedDescription(newData.description)}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayanan;

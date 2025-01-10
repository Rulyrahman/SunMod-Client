import React, { useState, useEffect } from "react";
import { fetchData, updateData } from "../api/apiService";
import { ListBulletIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { BallTriangle } from "react-loading-icons";

const AdminArtikel = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [newData, setNewData] = useState({ name: "", description: "", picture: null });
  const [nameError, setNameError] = useState("");
  const [descError, setDescError] = useState("");
  const [pictError, setPictError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const response = await fetchData("article");
      setAssets(response.reverse());
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
    setPictError("");
    if (!newData.name.trim()) {
      setNameError("Nama tidak boleh kosong.");
      isValid = false;
    }

    if (!newData.description.trim()) {
      setDescError("Deskripsi tidak boleh kosong.");
      isValid = false;
    }
    if (!isValid) return;

    try {
      const formData = new FormData();
      formData.append("name", newData.name);
      formData.append("description", newData.description);
      if (newData.picture) {
        formData.append("picture", newData.picture);
      }
      setBtnLoading(true);
      const updatedAsset = await updateData("article", id, formData);
      toast.dismiss();
      toast.success(`Artikel ${updatedAsset.name} berhasil diupdate!`);
      setSelectedAsset(null);
      setNewData({ name: "", description: "", picture: null });
      loadAssets();
      setBtnLoading(false);
    } catch (err) {
      toast.dismiss();
      toast.error("Gagal mengupdate artikel: " + (err.response?.data?.message || err.message));
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
    const selectedText = window.getSelection().toString().trim();

    if (selectedText) {
      const bulletText = `• ${selectedText}`;
      document.execCommand("insertText", false, bulletText);
    } else {
      document.execCommand("insertText", false, "• ");
    }
  };
  
  const resetForm = () => {
    setNewData({
      name: "",
      description: "",
      picture: null,
    });
    setNameError("");
    setDescError("");
    setPictError("");
    setSelectedAsset(null);
  };

  const currentPageData = assets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(assets.length / itemsPerPage);

  useEffect(() => {
    loadAssets();
  }, []);

  if (loading) return <p className="flex justify-center items-center ">Loading...</p>;
  if (error) return <p className="flex justify-center items-center">Error: {error}</p>;

  return (
    <div className="mx-auto p-4 mt-5">
      <h1 className="flex justify-center text-2xl font-bold mb-4">ARTIKEL SUMOD</h1>
      <div className="flex justify-center w-full">
        <div className="mb-8">
          {Array.isArray(currentPageData) &&
            currentPageData.map((asset) => (
              <div
                key={asset.id}
                className="flex flex-col md:flex-row items-center md:items-start p-4 rounded-custom-br overflow-hidden bg-slate-50 shadow-lg"
              >
                <div className="flex-shrink-0">
                  <img
                    src={asset.picture}
                    alt={asset.name}
                    className="rounded-custom-br object-cover w-[150px] h-[150px] md:w-[200px] md:h-[200px] mx-auto"
                  />
                </div>

                <div className="flex flex-col justify-center text-left">
                  <h2 className="text-xl font-semibold mb-2">{asset.name}</h2>
                  <p className="font-light mb-4 whitespace-pre-wrap">{asset.description}</p>
                  <div className="mt-4">
                    <button
                      className="bg-orange-500 text-white px-4 py-2 rounded-custom-br tracking-wider"
                      onClick={() => {
                        setSelectedAsset(asset);
                        setNewData({
                          name: asset.name,
                          description: asset.description,
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

      <div className="flex justify-center space-x-2 mb-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded ${currentPage === index + 1 ? "bg-orange-500 text-white" : "bg-gray-200"}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 m-0">
          <div className="max-h-screen p-6 w-full xl:w-1/2 overflow-y-auto rounded-custom-br">
            <div className="bg-white border p-2 md:p-3 lg:p-5 xl:p-6 rounded-lg shadow-lg max-w-full overflow-y-auto">
              <h2 className="font-semibold mb-4">Update Artikel: "{selectedAsset.name}"</h2>
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
                placeholder="Deskripsi Baru (tambahkan keunggulan di sini)"
                value={newData.description}
                onChange={(e) => {
                  setNewData({ ...newData, description: e.target.value });
                  if (descError) setDescError("");
                }}
                className="border p-2 w-full h-40"
              ></textarea>
              {descError && <div className="text-red-500 font-semibold text-sm mb-4">{descError}</div>}
              <div className="mb-3 flex justify-center">
                <button onClick={handleBulletPoint} className="border border-gray-300 p-2 rounded mr-2">
                  <ListBulletIcon className="h-5 w-5 text-custom-black" />
                </button>
              </div>
              <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 w-full mt-2" />
              {pictError && <div className="text-red-500 font-semibold text-sm mb-4">{pictError}</div>}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="bg-sidebar text-white px-4 py-2 rounded"
                  onClick={() => handleUpdate(selectedAsset.id)}
                  disabled={btnLoading}
                >
                  {btnLoading ? <BallTriangle className="h-7 w-7" /> : "Simpan Perubahan"}
                </button>

                <button className="bg-red-400 text-white px-4 py-2 rounded" onClick={resetForm}>
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArtikel;

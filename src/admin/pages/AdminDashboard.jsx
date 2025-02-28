import React, { useState, useEffect } from "react";
import { fetchData, updateData } from "../api/apiService";
import { toast } from "react-toastify";
import { BallTriangle } from "react-loading-icons";
import { Tabs } from "antd";

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [newData, setNewData] = useState({ name: "", picture: null });
  const [pictError, setPictError] = useState("");
  const [activeTab, setActiveTab] = useState("0");

  const loadBoards = async () => {
    setLoading(true);
    try {
      const response = await fetchData("banner");
      setBoards(response);
      setLoading(false);
    } catch (err) {
      setError(err?.message);
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    let isValid = true;
    setPictError("");
    
    if (!newData.picture) {
      setPictError("Banner tidak boleh kosong.");
      isValid = false;
    }
    if (!isValid) return;

    try {
      const formData = new FormData();
      formData.append("picture", newData.picture);

      setBtnLoading(true);
      const updatedBoard = await updateData("banner", id, formData);
      toast.dismiss();
      toast.success(`Banner ${updatedBoard.name} berhasil diupdate!`);
      resetForm();
      loadBoards();
      setBtnLoading(false);
    } catch (err) {
      toast.dismiss();
      toast.error("Gagal mengupdate banner: " + (err.response?.data?.message || err.message));
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

  const resetForm = () => {
    setNewData({ picture: null });
    setPictError("");
    setSelectedBoard(null);
  };

  useEffect(() => {
    loadBoards();
  }, []);
  
  const filteredBoards = [
    { key: "0", label: "Homepage", filter: (index) => index >= 2 && index <= 6 },
    { key: "1", label: "Layanan", filter: (index) => index >= 0 && index <= 1 },
    { key: "2", label: "Metode", filter: (index) => index >= 10 },
    { key: "3", label: "Profil", filter: (index) => index >= 7 },
  ];

  

  if (loading) return <p className="flex justify-center items-center">Loading...</p>;
  if (error) return <p className="flex justify-center items-center">Error: {error}</p>;

  return (
    <div className="mx-auto p-4 mt-5">
      <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
        {filteredBoards.map((tab) => (
          <Tabs.TabPane key={tab.key} tab={tab.label}>
            <div className="flex flex-col items-center w-full space-y-5">
              {boards.filter((_, index) => tab.filter(index)).map((board) => (
                <div
                  key={board.id}
                  className="p-4 rounded-custom-br overflow-hidden bg-white border border-sumod-bl shadow-sm w-full"
                >
                  <h2 className="text-3xl font-extrabold text-gray-600 text-center mb-3">{board.name.toUpperCase()}</h2>
                  <img
                    src={board.picture}
                    alt={board.name}
                    className="rounded-custom-br object-cover mb-2 mx-auto w-full h-full"
                  />
                  <div className="text-center mt-4">
                    <button
                      className="bg-sumod-bl3 hover:bg-sumod-bl transition text-sumod-wt text-bold px-4 py-2 rounded-custom-br w-full tracking-wider"
                      onClick={() => {
                        setSelectedBoard(board);
                        setNewData({
                          name: board.name,
                          description: board.description,
                          picture: null,
                        });
                      }}
                    >
                      Ganti banner baru
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Tabs.TabPane>
        ))}
      </Tabs>

      {selectedBoard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 m-0">
          <div className="bg-white border p-4 md:p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="font-semibold mb-4 text-center">Update Banner: "{selectedBoard.name}"</h2>

            <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 w-full mt-2" />
            {pictError && <div className="text-red-500 font-semibold text-sm mb-4">{pictError}</div>}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="bg-sidebar text-white px-4 py-2 rounded"
                onClick={() => handleUpdate(selectedBoard.id)}
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
      )}
    </div>
  );
};

export default Dashboard;

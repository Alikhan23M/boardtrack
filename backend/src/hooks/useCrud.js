import { useState, useEffect } from "react";
import api from "../api/axios";

const useCrud = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoint);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // helper to detect FormData
  const getConfig = (payload) => {
    if (payload instanceof FormData) {
      return {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
    }
    return {};
  };

  const createItem = async (payload) => {
    const response = await api.post(endpoint, payload, getConfig(payload));
    await fetchData();
    return response?.data;
  };

  const updateItem = async (id, payload) => {
    const response = await api.put(
      `${endpoint}/${id}`,
      payload,
      getConfig(payload)
    );
    await fetchData();
    return response?.data;
  };

  const patchItem = async (id, payload) => {
    const response = await api.patch(
      `${endpoint}/${id}`,
      payload,
      getConfig(payload)
    );
    await fetchData();
    return response?.data;
  };

  const deleteItem = async (id) => {
    const response = await api.delete(`${endpoint}/${id}`);
    await fetchData();
    return response?.data;
  };

  
  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return { data, loading, createItem, updateItem, deleteItem, fetchData ,patchItem};
};

export default useCrud;
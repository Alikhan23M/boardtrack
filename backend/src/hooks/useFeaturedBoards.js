import { useEffect, useState } from "react";
import api from "../api/axios";

const useFeaturedBoards = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await api.get("/boards/featured");
        setBoards(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch featured boards", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  return { boards, loading };
};

export default useFeaturedBoards;
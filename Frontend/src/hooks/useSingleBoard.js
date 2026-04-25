import  { useEffect, useState } from "react";
import api from "../api/axios";

const useSingleBoard = (boardId) => {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await api.get(`/boards/${boardId}`);
        setBoard(res.data.data);
      } catch (err) {
        console.error("Failed to fetch board", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [boardId]);

  return { board, loading };
};

export default useSingleBoard;
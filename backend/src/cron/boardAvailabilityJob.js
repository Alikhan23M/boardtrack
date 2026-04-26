import cron from "node-cron";
import prisma from "../../prisma/client.js";

export const releaseExpiredBoards = async () => {
  try {
    await prisma.board.updateMany({
      where: {
        status: "OCCUPIED",
        availableDate: {
          lte: new Date(),
        },
      },
      data: {
        status: "AVAILABLE",
        availableDate: null,
      },
    });
  } catch (error) {
    console.error("Board availability cron failed:", error.message);
  }
};

export const startBoardAvailabilityCron = () => {
  cron.schedule("*/5 * * * *", releaseExpiredBoards);
};

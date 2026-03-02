import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import clientRoutes from "./src/routes/clients.js";
import boardRoutes from "./src/routes/boards.js";
import dealRoutes from "./src/routes/deals.js";
import installmentRoutes from "./src/routes/installments.js";
import printingRoutes from "./src/routes/printingServices.js";
import reminderRoutes from "./src/routes/reminders.js";
import receiptRoutes from "./src/routes/receipts.js";
import { startBoardAvailabilityCron } from "./src/cron/boardAvailabilityJob.js";

dotenv.config();
const app = express();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BoardTrack Backend API",
      version: "1.0.0",
      description: "API documentation for BoardTrack backend services.",
    },
    tags: [
      { name: "Clients", description: "Client management endpoints" },
      { name: "Boards", description: "Board inventory endpoints" },
      { name: "Deals", description: "Deal management endpoints" },
      { name: "Installments", description: "Installment management endpoints" },
      { name: "Printing Services", description: "Printing service endpoints" },
      { name: "Reminders", description: "Reminder management endpoints" },
    ],
    components: {
      schemas: {
        Client: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Acme Corp" },
            address: { type: "string", example: "123 Main St" },
            contact: { type: "string", example: "+1-555-0100" },
          },
        },
        ClientInput: {
          type: "object",
          required: ["name", "address", "contact"],
          properties: {
            name: { type: "string", example: "Acme Corp" },
            address: { type: "string", example: "123 Main St" },
            contact: { type: "string", example: "+1-555-0100" },
          },
        },
        Board: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            size: { type: "string", example: "10x20 ft" },
            location: { type: "string", example: "Downtown Avenue" },
            frontSide: { type: "string", example: "North" },
            price: { type: "number", format: "float", example: 1200 },
            status: { type: "string", example: "available" },
            availableDate: { type: "string", format: "date-time", nullable: true },
          },
        },
        BoardInput: {
          type: "object",
          required: ["size", "location", "frontSide", "price", "status"],
          properties: {
            size: { type: "string", example: "10x20 ft" },
            location: { type: "string", example: "Downtown Avenue" },
            frontSide: { type: "string", example: "North" },
            price: { type: "number", format: "float", example: 1200 },
            status: { type: "string", example: "available" },
            availableDate: { type: "string", format: "date-time", nullable: true },
          },
        },
        Deal: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            clientId: { type: "integer", example: 1 },
            dealBoards: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  boardId: { type: "integer", example: 2 },
                  startDate: { type: "string", format: "date-time" },
                  endDate: { type: "string", format: "date-time" },
                },
              },
            },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            amount: { type: "number", format: "float", example: 5000 },
            paidAmount: { type: "number", format: "float", example: 2500 },
            remainingAmount: { type: "number", format: "float", example: 2500 },
          },
        },
        DealInput: {
          type: "object",
          required: ["clientId", "boardSelections", "paidAmount"],
          properties: {
            clientId: { type: "integer", example: 1 },
            boardSelections: {
              type: "array",
              items: {
                type: "object",
                required: ["boardId", "startDate", "endDate"],
                properties: {
                  boardId: { type: "integer", example: 2 },
                  startDate: { type: "string", format: "date-time" },
                  endDate: { type: "string", format: "date-time" },
                },
              },
            },
            paidAmount: { type: "number", format: "float", example: 2500 },
          },
        },
        Installment: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            dealId: { type: "integer", example: 1 },
            amount: { type: "number", format: "float", example: 1000 },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        InstallmentInput: {
          type: "object",
          required: ["dealId", "amount"],
          properties: {
            dealId: { type: "integer", example: 1 },
            amount: { type: "number", format: "float", example: 1000 },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        PrintingService: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            clientId: { type: "integer", example: 1 },
            printingType: { type: "string", example: "Vinyl" },
            details: { type: "string", nullable: true, example: "Double-layer print" },
            price: { type: "number", format: "float", example: 300 },
            status: { type: "string", example: "in-progress" },
          },
        },
        PrintingServiceInput: {
          type: "object",
          required: ["clientId", "printingType", "price", "status"],
          properties: {
            clientId: { type: "integer", example: 1 },
            printingType: { type: "string", example: "Vinyl" },
            details: { type: "string", nullable: true, example: "Double-layer print" },
            price: { type: "number", format: "float", example: 300 },
            status: { type: "string", example: "in-progress" },
          },
        },
        Reminder: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            boardId: { type: "integer", example: 2 },
            reminderDate: { type: "string", format: "date-time" },
            message: { type: "string", example: "Board contract ending soon" },
            status: { type: "string", example: "pending" },
          },
        },
        ReminderInput: {
          type: "object",
          required: ["boardId", "reminderDate", "message", "status"],
          properties: {
            boardId: { type: "integer", example: 2 },
            reminderDate: { type: "string", format: "date-time" },
            message: { type: "string", example: "Board contract ending soon" },
            status: { type: "string", example: "pending" },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", nullable: true, example: "Operation successful" },
            data: { nullable: true },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Something went wrong" },
          },
        },
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("BoardTrack Backend Running!");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/api/clients", clientRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/installments", installmentRoutes);
app.use("/api/printing-services", printingRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/receipts", receiptRoutes);

startBoardAvailabilityCron();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

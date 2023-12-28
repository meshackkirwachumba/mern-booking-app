import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel, { HotelType } from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";

const myHotelsRoutes = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});

// api/my-hotels
myHotelsRoutes.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
  ],
  body("facilities")
    .notEmpty()
    .isArray()
    .withMessage("Facilities are required"),
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      //other props of a form
      const newHotel: HotelType = req.body;

      // 1.upload the images to cloudinary
      const uploadPromises = imageFiles.map(async (imageFile) => {
        const b64 = Buffer.from(imageFile.buffer).toString("base64");
        let dataURI = "data:" + imageFile.mimetype + ";base64," + b64;

        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
      });

      const imageUrls = await Promise.all(uploadPromises);
      //   populate the imageUrls array in myHotel

      //2 if upload was successfull, add URLS to the new hotel
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      //3. save the new hotel in the database
      const hotel = new Hotel(newHotel);
      await hotel.save();

      // 4. return a 201 status
      return res.status(201).json(hotel);
    } catch (error) {
      console.log("Error creating hotel: ", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

// get all my hotels
myHotelsRoutes.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    return res.status(200).json(hotels);
  } catch (error) {
    console.log("Error getting hotels: ", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

export default myHotelsRoutes;

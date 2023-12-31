import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import { HotelType } from "../shared/types";

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

// get a single hotel
myHotelsRoutes.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });

    res.json(hotel);
  } catch (error) {
    console.log("Error getting hotel: ", error);
    res.status(500).json({ message: "Error fetching hotel" });
  }
});

// update a single hotel
myHotelsRoutes.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      const updatedHotel: HotelType = req.body;
      updatedHotel.lastUpdated = new Date();

      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
          userId: req.userId,
        },
        updatedHotel,
        { new: true }
      );

      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      // files added to cloudinary
      const imageFiles = req.files as Express.Multer.File[];

      // 1.upload the images to cloudinary
      const uploadPromises = imageFiles.map(async (imageFile) => {
        const b64 = Buffer.from(imageFile.buffer).toString("base64");
        let dataURI = "data:" + imageFile.mimetype + ";base64," + b64;

        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
      });
      // wait for all promises to resolve
      const updatedImageUrls = await Promise.all(uploadPromises);

      hotel.imageUrls = [
        ...updatedImageUrls,
        ...(updatedHotel.imageUrls || []),
      ];

      await hotel.save();

      return res.status(201).json(hotel);
    } catch (error) {
      console.log("Error updating hotel: ", error);
      res.status(500).json({ message: "Error updating hotel" });
    }
  }
);

export default myHotelsRoutes;
